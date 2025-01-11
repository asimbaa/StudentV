import { Skeleton } from '../ui/Skeleton';

export function ScholarshipCardSkeleton() {
  return (
    <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-white/10">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-2 flex-1">
          <Skeleton variant="text" className="w-3/4" />
          <Skeleton variant="text" className="w-1/2" />
        </div>
        <Skeleton variant="rectangular" className="w-20 h-8 rounded-full" />
      </div>

      <div className="space-y-3 mb-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} variant="text" className="w-full" />
        ))}
      </div>

      <div className="flex gap-2">
        {[1, 2, 3].map((i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            className="w-16 h-6 rounded-full"
          />
        ))}
      </div>
    </div>
  );
}