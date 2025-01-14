import { forwardRef } from 'react';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

export interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  error?: string;
  helperText?: string;
  as?: 'input' | 'textarea';
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, helperText, className, as = 'input', ...props }, ref) => {
    const Component = as === 'textarea' ? 'textarea' : Input;
    const inputClasses = cn(
      "w-full px-4 py-2 bg-black/40 backdrop-blur-sm rounded-lg",
      "border border-white/10 focus:border-white/20",
      "text-white placeholder-white/40",
      "focus:outline-none focus:ring-2 focus:ring-[hsl(var(--gold))]/20",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      "text-base md:text-sm", // Larger text on mobile
      error && "border-red-500/50 focus:ring-red-500/20",
      as === 'textarea' && "min-h-[100px] resize-none",
      className
    );

    return (
      <div className="space-y-2 w-full">
        <label className="block text-sm font-medium text-white/80 leading-none">
          {label}
        </label>
        <Component
          ref={ref as any}
          className={inputClasses}
          {...props}
        />
        {error ? (
          <p className="text-sm text-red-200 leading-snug">{error}</p>
        ) : helperText ? (
          <p className="text-sm md:text-xs text-white/60 leading-relaxed">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

FormField.displayName = 'FormField';
