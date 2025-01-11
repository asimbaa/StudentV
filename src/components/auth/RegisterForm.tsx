import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormField } from '@/components/forms/FormField';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { SUPPORTED_COUNTRIES } from '@/lib/core/constants';
import type { RegisterData, AuthUser } from '@/lib/auth/types';

interface RegisterFormProps {
  onSubmit: (data: RegisterData) => Promise<AuthUser>;
}

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  country: z.enum(SUPPORTED_COUNTRIES)
});

export function RegisterForm({ onSubmit }: RegisterFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema)
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-sm mx-auto">
      <FormField
        label="Full Name"
        error={errors.name?.message}
        {...register('name')}
        className="w-full"
      />

      <FormField
        label="Email Address"
        type="email"
        error={errors.email?.message}
        {...register('email')}
        className="w-full"
      />

      <FormField
        label="Password"
        type="password"
        error={errors.password?.message}
        {...register('password')}
        className="w-full"
      />

      <div>
        <label className="block text-sm font-medium text-white mb-1">
          Country
        </label>
        <div className="relative">
          <select
            {...register('country')}
            className={cn(
              "w-full h-12 md:h-10 px-4 py-3 md:py-2 text-base md:text-sm bg-black/40 border border-white/10 rounded-lg text-white appearance-none",
              "focus:outline-none focus:ring-2 focus:ring-[hsl(var(--gold))]/20",
              "hover:border-white/20 transition-colors"
            )}
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%23ffffff\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")',
              backgroundPosition: 'right 0.75rem center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '1.5em 1.5em',
              paddingRight: '2.5rem'
            }}
          >
            <option value="" className="py-2">Select country</option>
            {SUPPORTED_COUNTRIES.map((country) => (
              <option key={country} value={country} className="py-2">
                {country}
              </option>
            ))}
          </select>
        </div>
        <style>{`
          select option {
            background-color: hsl(220 40% 13%);
            color: white;
            padding: 0.75rem 1rem;
          }
          select option:hover {
            background-color: hsl(220 40% 15%);
          }
          select option:checked {
            background-color: hsl(220 40% 20%);
          }
        `}</style>
        {errors.country && (
          <p className="text-sm text-red-500 mt-1">{errors.country.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 md:h-10 text-base md:text-sm"
      >
        {isSubmitting ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  );
}