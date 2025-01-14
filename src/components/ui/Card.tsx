import { cn } from '@/lib/utils';
import { LoadingSpinner } from './LoadingSpinner';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated';
  isLoading?: boolean;
}

export function Card({ children, className, variant = 'default', isLoading = false }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-white/10 bg-gradient-card backdrop-blur-sm p-6 text-white',
        'hover:border-white/20 transition-all duration-300',
        'shadow-lg shadow-black/20',
        {
          'shadow-xl shadow-black/30': variant === 'elevated'
        },
        className
      )}
    >
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[100px]">
          <LoadingSpinner size="md" />
        </div>
      ) : children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('mb-4', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={cn(
      'text-xl md:text-2xl font-semibold leading-snug',
      'text-white/90',
      className
    )}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn(
      'text-sm md:text-base leading-relaxed',
      'text-white/60',
      className
    )}>
      {children}
    </p>
  );
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('', className)}>
      {children}
    </div>
  );
}
