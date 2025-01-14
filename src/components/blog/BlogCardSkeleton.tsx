import { Skeleton } from '../ui/Skeleton';

export function BlogCardSkeleton() {
  return (
    <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-white/10">
      <div className="space-y-4">
        <Skeleton variant="text" className="w-1/4" />
        <Skeleton variant="text" className="w-3/4" />
        <Skeleton variant="text" className="w-full" />
        
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              className="w-16 h-6 rounded-full"
            />
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          <Skeleton variant="text" className="w-24" />
          <Skeleton variant="text" className="w-24" />
        </div>
      </div>
    </div>
  );
}
