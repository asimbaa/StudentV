import { cn } from '@/lib/utils';

interface LoadingDotsProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'gold' | 'white';
  className?: string;
}

export function LoadingDots({ 
  size = 'md', 
  color = 'gold',
  className 
}: LoadingDotsProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className={cn(
            "rounded-full animate-bounce",
            {
              'bg-[hsl(var(--gold))]': color === 'gold',
              'bg-white': color === 'white',
              'w-1 h-1': size === 'sm',
              'w-2 h-2': size === 'md',
              'w-3 h-3': size === 'lg'
            }
          )}
          style={{
            animationDelay: `${i * 0.15}s`
          }}
        />
      ))}
    </div>
  );
}