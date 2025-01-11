import { Handler } from '@netlify/functions';

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri = process.env.URL ? 
  `${process.env.URL}/auth/callback/google` : 
  'http://localhost:3000/auth/callback/google';

export const handler: Handler = async (event) => {
  // Handle the initial OAuth redirect
  if (event.queryStringParameters?.code) {
    try {
      // Exchange code for tokens
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code: event.queryStringParameters.code,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code'
        })
      });

      const data = await response.json();
      
      // Get user info
      const userInfo = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${data.access_token}` }
      }).then(res => res.json());

      // Return user data and tokens
      return {
        statusCode: 200,
        body: JSON.stringify({
          user: {
            email: userInfo.email,
            name: userInfo.name,
            picture: userInfo.picture
          },
          tokens: {
            access_token: data.access_token,
            refresh_token: data.refresh_token
          }
        })
      };
    } catch (error) {
      console.error('Google auth error:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to authenticate with Google' })
      };
    }
  }

  // Initial OAuth redirect
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
    client_id: clientId!,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'email profile',
    access_type: 'offline',
    prompt: 'consent'
  })}`;

  return {
    statusCode: 302,
    headers: {
      Location: authUrl
    }
  };
};