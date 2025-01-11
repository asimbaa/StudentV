export async function signInWithGoogle() {
  try {
    // Redirect to Google OAuth
    window.location.href = '/.netlify/functions/auth-google';
  } catch (error) {
    console.error('Google sign in error:', error);
    throw error;
  }
}