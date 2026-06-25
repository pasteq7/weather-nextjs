import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <main className="min-h-0 overflow-hidden">
      <div className="flex h-full min-h-0 flex-col gap-2 overflow-y-auto pr-1 sm:gap-3 lg:overflow-hidden lg:pr-0">
      <div className="grid grid-cols-1 gap-2 sm:gap-3 lg:grid-cols-[minmax(18rem,0.9fr)_minmax(0,1.55fr)]">
        <div className="flex min-h-0 flex-col">
          <TodayWeatherCardSkeleton />
        </div>
        <div className="flex min-h-0 flex-col gap-2 sm:gap-3">
          <WeatherDataGridSkeleton />
          <ForecastViewSkeleton />
        </div>
      </div>
      <ForecastViewSkeleton />
      </div>
    </main>
  );
}

function TodayWeatherCardSkeleton() {
  return (
    <Card className="h-full p-0">
      <div className="flex h-full min-h-[14.5rem] flex-col justify-between gap-3 p-4 sm:min-h-[18rem] sm:gap-6 sm:p-6 lg:min-h-[18.25rem] lg:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <Skeleton className="h-3 w-36" />
            <Skeleton className="h-7 w-3/4 sm:h-9" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-10 w-24 shrink-0 rounded-lg sm:w-36" />
        </div>
        <div className="grid flex-1 grid-cols-[minmax(5.5rem,1fr)_auto] items-center gap-3 sm:grid-cols-[minmax(8rem,1fr)_auto] sm:gap-6">
          <div className="flex justify-center sm:justify-start">
            <Skeleton className="h-24 w-24 rounded-full sm:h-40 sm:w-40 lg:h-40 lg:w-40" />
          </div>
          <div className="flex flex-col items-center gap-4 sm:items-end">
            <Skeleton className="h-12 w-24 sm:h-20 sm:w-40" />
            <Skeleton className="h-7 w-28 rounded-full" />
          </div>
        </div>
      </div>
    </Card>
  );
}

function WeatherDataGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="flex h-16 flex-row items-center gap-2 p-3 sm:h-[4.6rem] sm:gap-4 sm:p-4">
          <Skeleton className="h-8 w-8 sm:h-10 sm:w-10" />
          <div className="flex flex-grow flex-col gap-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-6 w-3/4" />
          </div>
        </Card>
      ))}
    </div>
  );
}

function ForecastViewSkeleton() {
  return (
    <Card className="gap-3 p-3 sm:p-5 lg:p-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-9 w-32" />
      </div>
      <Skeleton className="h-[8.75rem] w-full sm:h-[10rem] lg:h-[6.5rem]" />
    </Card>
  );
}
