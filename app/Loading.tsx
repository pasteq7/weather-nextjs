import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <main className="min-h-0 overflow-hidden">
      <div className="weather-dashboard flex h-full min-h-0 flex-col gap-3 overflow-y-auto overscroll-contain pb-1 pr-1 min-[72rem]:overflow-hidden min-[72rem]:pr-0">
        <div className="weather-summary-grid grid shrink-0 grid-cols-1 gap-3 min-[72rem]:grid-cols-[minmax(19rem,0.9fr)_minmax(0,1.55fr)]">
          <div className="flex min-h-0 flex-col">
            <TodayWeatherCardSkeleton />
          </div>
          <div className="weather-right-column flex min-h-0 flex-col gap-3">
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
    <Card className="today-weather-card h-full shrink-0 p-0">
      <div className="today-weather-card__body flex h-full min-h-[20rem] flex-col gap-4 p-4 min-[420px]:min-h-[17rem] sm:min-h-[17.5rem] sm:p-5 min-[72rem]:min-h-[16.75rem]">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <Skeleton className="h-3 w-36" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-10 w-28 shrink-0 rounded-lg" />
        </div>
        <div className="today-weather-card__current flex min-h-0 flex-1 flex-col items-center justify-center gap-3 px-2 py-2">
          <div className="flex justify-center">
            <Skeleton className="today-weather-card__icon h-28 w-28 rounded-full sm:h-32 sm:w-32 min-[72rem]:h-32 min-[72rem]:w-32" />
          </div>
          <div className="flex flex-col items-center gap-3">
            <Skeleton className="h-14 w-28 sm:h-16 sm:w-32" />
            <Skeleton className="h-7 w-28 rounded-full" />
          </div>
        </div>
      </div>
    </Card>
  );
}

function WeatherDataGridSkeleton() {
  return (
    <div className="weather-data-grid grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="weather-data-card flex min-h-[3.45rem] flex-row items-center gap-1.5 px-2 py-1.5 sm:min-h-[3.75rem] sm:gap-2 sm:px-2.5 sm:py-2 min-[72rem]:min-h-[3.35rem] min-[72rem]:px-2.5 min-[72rem]:py-1.5">
          <Skeleton className="weather-data-card__icon h-8 w-8 sm:h-10 sm:w-10 min-[72rem]:h-9 min-[72rem]:w-9" />
          <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-5 w-4/5 sm:h-6" />
          </div>
        </Card>
      ))}
    </div>
  );
}

function ForecastViewSkeleton() {
  return (
    <Card className="forecast-card shrink-0 gap-3 overflow-hidden p-3.5 sm:p-5 min-[72rem]:p-4">
      <div className="forecast-card__header flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-9 w-40" />
      </div>
      <Skeleton className="forecast-card__visual h-[11rem] w-full sm:h-[12rem] min-[72rem]:h-[7.75rem]" />
    </Card>
  );
}
