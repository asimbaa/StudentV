import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: 'gold' | 'white';
  thickness?: 'thin' | 'medium' | 'thick';
}

export function LoadingSpinner({ 
  size = 'md', 
  className, 
  color = 'gold',
  thickness = 'medium'
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full',
        {
          'border-t-[1px]': thickness === 'thin',
          'border-t-2': thickness === 'medium',
          'border-t-[3px]': thickness === 'thick',
          'border-[hsl(var(--gold))]': color === 'gold',
          'border-white': color === 'white',
          'w-4 h-4': size === 'sm',
          'w-8 h-8': size === 'md',
          'w-12 h-12': size === 'lg'
        },
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}