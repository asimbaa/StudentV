import { motion } from 'framer-motion';
import { LoadingSpinner } from './LoadingSpinner';
import { useEffect } from 'react';
import { markPerformance, measurePerformance } from '@/lib/utils/performance';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  id?: string;
  className?: string;
}

export function LoadingState({ 
  message = 'Loading...', 
  size = 'md', 
  id,
  className 
}: LoadingStateProps) {
  useEffect(() => {
    if (id) {
      markPerformance(`loading-start-${id}`);
      return () => {
        markPerformance(`loading-end-${id}`);
        measurePerformance(`loading-duration-${id}`, `loading-start-${id}`, `loading-end-${id}`);
      };
    }
  }, [id]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "flex flex-col items-center justify-center p-8",
        "bg-black/40 backdrop-blur-sm rounded-lg border border-white/10",
        className
      )}
    >
      <LoadingSpinner size={size} className="mb-4" />
      <p className="text-white/60 text-base md:text-sm">{message}</p>
    </motion.div>
  );
}