import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from './AuthProvider';

export function GoogleAuthCallback() {
  const navigate = useNavigate();
  const { login } = useAuthContext();

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');

      if (code) {
        try {
          const response = await fetch(`/.netlify/functions/auth-google?code=${code}`);
          const data = await response.json();

          if (data.user) {
            await login({ provider: 'google', ...data });
            navigate('/dashboard');
          }
        } catch (error) {
          console.error('Google auth callback error:', error);
          navigate('/signin?error=google-auth-failed');
        }
      }
    };

    handleCallback();
  }, [login, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[hsl(var(--gold))] mx-auto mb-4"></div>
        <p className="text-white/80">Completing sign in...</p>
      </div>
    </div>
  );
}