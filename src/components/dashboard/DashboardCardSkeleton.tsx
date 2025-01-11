import { Skeleton } from '../ui/Skeleton';

export function DashboardCardSkeleton() {
  return (
    <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-white/10">
      <div className="flex items-center gap-4 mb-6">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1">
          <Skeleton variant="text" className="w-1/2 mb-2" />
          <Skeleton variant="text" className="w-1/3" />
        </div>
      </div>
      
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton variant="rectangular" className="w-8 h-8" />
            <Skeleton variant="text" className="flex-1" />
          </div>
        ))}
      </div>
    </div>
  );
}