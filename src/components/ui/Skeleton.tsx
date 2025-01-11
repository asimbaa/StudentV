import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ 
  className,
  variant = 'rectangular',
  width,
  height
}: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-white/10',
        {
          'rounded-full': variant === 'circular',
          'rounded-lg': variant === 'rectangular',
          'rounded h-4': variant === 'text'
        },
        className
      )}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height
      }}
    />
  );
}