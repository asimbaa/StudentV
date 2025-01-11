import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, placeholder = 'Select an option...', required, ...props }, ref) => {
    return (
      <select
        className={cn(
          "flex h-12 md:h-10 w-full rounded-lg border border-white/10 bg-black/40 backdrop-blur-sm",
          "px-4 py-3 md:py-2 text-base md:text-sm text-white appearance-none",
          "focus:outline-none focus:ring-2 focus:ring-[hsl(var(--gold))]/20",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        required={required}
        {...props}
      >
        <option value="" className="bg-[hsl(var(--navy))] text-base md:text-sm">{placeholder}</option>
        {options.map(({ value, label }) => (
          <option key={value} value={value} className="bg-[hsl(var(--navy))] text-base md:text-sm">
            {label}
          </option>
        ))}
      </select>
    );
  }
);

Select.displayName = 'Select';