import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <main className="flex flex-grow flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-1">
          <LocationCardSkeleton />
          <TodayWeatherCardSkeleton />
        </div>
        <div className="flex flex-col gap-4 lg:col-span-2">
          <WeatherDataGridSkeleton />
          <ForecastViewSkeleton />
        </div>
      </div>
      <ForecastViewSkeleton />
    </main>
  );
}

function LocationCardSkeleton() {
  return (
    <Card className="flex h-16 items-center justify-center p-4">
      <Skeleton className="h-8 w-48" />
    </Card>
  );
}

function TodayWeatherCardSkeleton() {
  return (
    <Card className="flex-grow p-0">
      <div className="flex h-full min-h-[22rem] flex-col justify-between gap-6 p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <Skeleton className="h-3 w-36" />
            <Skeleton className="h-9 w-3/4" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-10 w-36 rounded-lg" />
        </div>
        <div className="grid flex-1 items-center gap-6 sm:grid-cols-[minmax(8rem,1fr)_auto]">
          <div className="flex justify-center sm:justify-start">
            <Skeleton className="h-36 w-36 rounded-full sm:h-40 sm:w-40 lg:h-44 lg:w-44" />
          </div>
          <div className="flex flex-col items-center gap-4 sm:items-end">
            <Skeleton className="h-16 w-32 sm:h-20 sm:w-40" />
            <Skeleton className="h-7 w-28 rounded-full" />
          </div>
        </div>
      </div>
    </Card>
  );
}

function WeatherDataGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="flex h-16 flex-row items-center gap-4 p-4">
          <Skeleton className="h-12 w-12" />
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
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-9 w-32" />
      </div>
      <Skeleton className="h-[125px] w-full" />
    </Card>
  );
}
