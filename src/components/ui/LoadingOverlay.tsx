import { motion } from 'framer-motion';
import { LoadingSpinner } from './LoadingSpinner';
import { cn } from '@/lib/utils';

interface LoadingOverlayProps {
  message?: string;
  isTransparent?: boolean;
  className?: string;
}

export function LoadingOverlay({
  message = 'Loading...',
  isTransparent = false,
  className
}: LoadingOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        isTransparent ? "bg-black/50" : "bg-black/80",
        "backdrop-blur-sm",
        className
      )}
    >
      <div className="text-center">
        <LoadingSpinner size="lg" className="mb-4" />
        <p className="text-white/80">{message}</p>
      </div>
    </motion.div>
  );
}
