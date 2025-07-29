import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="p-2 md:p-4 lg:p-6 mx-auto max-w-7xl min-h-screen flex flex-col gap-4">
      {/* TopBar Skeleton */}
      <div className="flex items-center gap-2 w-full">
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 flex-grow" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-24" />
      </div>

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-grow">
        {/* Left Column */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="flex-grow w-full min-h-[300px]" />
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>

      {/* Daily Forecast Skeleton */}
      <Skeleton className="h-64 w-full" />

      {/* Footer Skeleton */}
      <Skeleton className="h-16 w-full" />
    </div>
  );
}