import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="flex-grow flex flex-col gap-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 flex flex-col gap-4">
          {/* LocationCard Skeleton */}
          <Skeleton className="h-16 w-full" />
          {/* TodayWeatherCard Skeleton */}
          <Skeleton className="flex-grow w-full min-h-[300px]" />
        </div>
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* WeatherDataGrid Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
          {/* Hourly ForecastView Skeleton */}
          <Skeleton className="h-[220px] w-full" />
        </div>
      </div>
      {/* Daily ForecastView Skeleton */}
      <Skeleton className="h-[220px] w-full" />
      {/* Footer Skeleton */}
      <Skeleton className="h-16 w-full" />
    </main>
  );
}