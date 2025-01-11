import { Skeleton } from './Skeleton';

export function SkeletonCard() {
  return (
    <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-white/10">
      <div className="flex items-start gap-4">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1 space-y-3">
          <Skeleton variant="text" className="w-3/4" />
          <Skeleton variant="text" className="w-1/2" />
        </div>
      </div>
    </div>
  );
}