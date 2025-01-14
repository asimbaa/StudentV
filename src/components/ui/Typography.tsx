import { cn } from '@/lib/utils';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
}

export function H1({ children, className }: TypographyProps) {
  return (
    <h1 className={cn(
      'text-4xl md:text-5xl font-bold tracking-tight leading-tight',
      'bg-clip-text text-transparent bg-gradient-to-r from-white to-white/90',
      className
    )}>
      {children}
    </h1>
  );
}

export function H2({ children, className }: TypographyProps) {
  return (
    <h2 className={cn(
      'text-3xl md:text-4xl font-semibold tracking-tight leading-tight',
      'text-white/90',
      className
    )}>
      {children}
    </h2>
  );
}

export function H3({ children, className }: TypographyProps) {
  return (
    <h3 className={cn(
      'text-2xl md:text-3xl font-semibold leading-snug',
      'text-white/80',
      className
    )}>
      {children}
    </h3>
  );
}

export function Text({ children, className, weight = 'normal' }: TypographyProps) {
  return (
    <p className={cn(
      'text-base md:text-lg leading-relaxed',
      'text-white/70',
      {
        'font-light': weight === 'light',
        'font-normal': weight === 'normal',
        'font-medium': weight === 'medium',
        'font-semibold': weight === 'semibold',
        'font-bold': weight === 'bold'
      },
      className
    )}>
      {children}
    </p>
  );
}

export function SmallText({ children, className, weight = 'normal' }: TypographyProps) {
  return (
    <p className={cn(
      'text-sm leading-relaxed',
      'text-white/60',
      {
        'font-light': weight === 'light',
        'font-normal': weight === 'normal',
        'font-medium': weight === 'medium',
        'font-semibold': weight === 'semibold',
        'font-bold': weight === 'bold'
      },
      className
    )}>
      {children}
    </p>
  );
}

export function Label({ children, className }: TypographyProps) {
  return (
    <span className={cn(
      'text-sm font-medium leading-none',
      'text-white/80',
      className
    )}>
      {children}
    </span>
  );
}

export function Caption({ children, className }: TypographyProps) {
  return (
    <span className={cn(
      'text-xs leading-tight',
      'text-white/50',
      className
    )}>
      {children}
    </span>
  );
}
