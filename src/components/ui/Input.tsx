import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 md:h-10 w-full rounded-lg border border-white/10 bg-black/40 backdrop-blur-sm",
          "px-4 py-3 md:py-2 text-base md:text-sm text-white",
          "focus:outline-none focus:ring-2 focus:ring-[hsl(var(--gold))]/20",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "placeholder:text-white/40",
          "hover:border-white/20 transition-colors",
          "shadow-sm shadow-black/10",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
