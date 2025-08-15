// app/[locale]/loading.tsx

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="flex-grow flex flex-col gap-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column Skeleton */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <LocationCardSkeleton />
          <TodayWeatherCardSkeleton />
        </div>
        {/* Right Column Skeleton */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <WeatherDataGridSkeleton />
          <ForecastViewSkeleton />
        </div>
      </div>
      {/* Full-width Daily Forecast Skeleton */}
      <ForecastViewSkeleton />
    </main>
  );
}

// --- Component-level Skeletons for better accuracy ---

function LocationCardSkeleton() {
  return (
    <Card className="flex items-center justify-center h-16 p-4">
      <Skeleton className="w-48 h-8" />
    </Card>
  );
}

function TodayWeatherCardSkeleton() {
  return (
    <Card className="flex flex-col items-center justify-between p-2 flex-grow">
      <div className="w-40 h-40">
        <Skeleton className="w-full h-full rounded-full" />
      </div>
      <div className="w-full flex flex-col items-center gap-2 text-center">
        <Skeleton className="w-3/4 h-10" />
        <Skeleton className="w-1/2 h-6" />
        <Skeleton className="w-1/3 h-4" />
      </div>
    </Card>
  );
}

function WeatherDataGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="flex flex-row items-center p-4 h-16 gap-4">
          <Skeleton className="w-12 h-12" />
          <div className="flex-grow flex flex-col gap-2">
            <Skeleton className="w-1/2 h-4" />
            <Skeleton className="w-3/4 h-6" />
          </div>
        </Card>
      ))}
    </div>
  );
}

function ForecastViewSkeleton() {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-9 w-32" />
      </div>
      <Skeleton className="h-[110px] w-full" />
    </Card>
  );
}