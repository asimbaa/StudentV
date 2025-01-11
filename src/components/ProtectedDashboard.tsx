import { useEffect } from 'react';
import { useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './auth/AuthProvider';
import Dashboard from '@/pages/Dashboard';
import ApplicationStatus from '@/pages/ApplicationStatus';
import DocumentUpload from '@/pages/DocumentUpload';
import { DashboardSidebar } from './dashboard/DashboardSidebar';
import { motion } from 'framer-motion';
import { Button } from './ui/Button';

export function ProtectedDashboard() {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/signin?redirect=/dashboard');
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold mb-4">Sign in to Access Dashboard</h1>
          <p className="text-white/80 mb-8 max-w-md">
            Create an account or sign in to access your personalized dashboard and track your visa application progress.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => navigate('/signin')}
              variant="outline"
            >
              Sign In
            </Button>
            <Button
              onClick={() => navigate('/register')}
              className="bg-[hsl(var(--gold))] text-[hsl(var(--navy))]"
            >
              Create Account
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--navy))] flex">
      <DashboardSidebar />
      <div className="flex-1 ml-64 overflow-x-hidden">
        <main className="p-8">
          <Routes>
            <Route path="/" element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<Dashboard />} />
            <Route path="applications" element={<ApplicationStatus />} />
            <Route path="documents" element={<DocumentUpload />} />
            <Route path="*" element={<Navigate to="overview" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}