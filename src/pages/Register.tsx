import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { RegisterForm } from '../components/auth/RegisterForm';
import { useAuthContext } from '../components/auth/AuthProvider';
import AustralianLogo from '../components/AustralianLogo';
import { GoogleIcon } from '@/components/icons/GoogleIcon';
import { MicrosoftIcon } from '@/components/icons/MicrosoftIcon';
import { AppleIcon } from '@/components/icons/AppleIcon';
import { Button } from '@/components/ui/Button';
import { signInWithGoogle } from '@/lib/auth/googleAuth';

export default function Register() {
  const { register } = useAuthContext();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <AustralianLogo />
          </Link>
          <h1 className="text-3xl font-bold mt-6 mb-2">Create Account</h1>
          <p className="text-white/60">Join us on your immigration journey</p>
        </div>

        <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6">
          <RegisterForm onSubmit={register} />
          
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[hsl(var(--navy))] text-white/60">or continue with</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={signInWithGoogle}
            >
              <GoogleIcon className="w-5 h-5" />
              Continue with Google
            </Button>

            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => {}}
              disabled
            >
              <MicrosoftIcon className="w-5 h-5" />
              Continue with Microsoft Account
            </Button>

            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => {}}
              disabled
            >
              <AppleIcon className="w-5 h-5" />
              Continue with Apple
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-white/60">
              Already have an account?{' '}
              <Link 
                to="/signin" 
                className="text-[hsl(var(--gold))] hover:text-[hsl(var(--gold))]/80"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
