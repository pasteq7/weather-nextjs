// components/features/forecast-list-skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

interface ForecastListSkeletonProps {
  itemCount: number;
  type: 'hourly' | 'daily';
}

export default function ForecastListSkeleton({ itemCount, type }: ForecastListSkeletonProps) {
  const gridCols = type === 'daily' ? 'grid-cols-3 sm:grid-cols-5' : 'grid-cols-4 md:grid-cols-8';

  return (
    <div className={`grid ${gridCols} gap-2 h-[150px] overflow-y-auto`}>
      {Array.from({ length: itemCount }).map((_, index) => (
        <div key={index} className="flex flex-col items-center justify-center text-center gap-2 p-2">
          <Skeleton className="w-12 h-4" /> {/* Time/Day */}
          <Skeleton className="w-16 h-16 rounded-full" /> {/* Icon */}
          <Skeleton className="w-10 h-4" /> {/* Temp */}
        </div>
      ))}
    </div>
  );
}