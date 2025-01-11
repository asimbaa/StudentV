import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { LoadingSpinner } from './LoadingSpinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  className,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  children,
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden',
        {
          'btn-primary': variant === 'primary',
          'btn-secondary': variant === 'secondary',
          'btn-outline': variant === 'outline',
          'px-3 py-2 md:py-1.5 text-base md:text-sm rounded-md': size === 'sm',
          'px-4 py-3 md:py-2 text-base md:text-sm rounded-lg': size === 'md',
          'px-6 py-4 md:py-3 text-lg md:text-base rounded-lg': size === 'lg',
          'w-full': fullWidth
        },
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
      {isLoading && (
        <LoadingSpinner
          size="sm"
          className="absolute left-1/2 -translate-x-1/2"
        />
      )}
      <span className={cn(
        'flex items-center gap-2',
        isLoading && 'invisible'
      )}>
        {children}
      </span>
    </button>
  );
});

Button.displayName = 'Button';