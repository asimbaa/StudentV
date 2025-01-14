import { forwardRef } from 'react';
import { Button } from './Button';
import { LoadingSpinner } from './LoadingSpinner';
import { cn } from '@/lib/utils';

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(({
  children,
  isLoading = false,
  loadingText,
  className,
  disabled,
  ...props
}, ref) => {
  return (
    <Button
      ref={ref}
      className={cn(
        "relative",
        isLoading && "cursor-wait",
        className
      )}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && (
        <LoadingSpinner
          size="sm"
          className="absolute left-1/2 -translate-x-1/2"
        />
      )}
      <span className={cn(
        "flex items-center gap-2",
        isLoading && "invisible"
      )}>
        {isLoading ? loadingText : children}
      </span>
    </Button>
  );
});

LoadingButton.displayName = 'LoadingButton';
