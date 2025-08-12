// app/[locale]/loading.tsx

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    // The main container div and TopBar have been moved to layout.tsx.
    // This skeleton now only represents the content of page.tsx.
    <main className="flex-grow flex flex-col gap-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 flex flex-col gap-4">
          {/* LocationCard Skeleton */}
          <Card className="flex items-center justify-center h-16 p-4">
            <Skeleton className="w-48 h-8" />
          </Card>
          {/* TodayWeatherCard Skeleton */}
          <Card className="flex flex-col items-center justify-between p-2 flex-grow min-h-[300px] gap-4">
            <Skeleton className="w-40 h-40 rounded-full" />
            <div className="w-full flex flex-col items-center gap-2">
              <Skeleton className="w-3/4 h-10" />
              <Skeleton className="w-1/2 h-6" />
              <Skeleton className="w-1/3 h-4" />
            </div>
          </Card>
        </div>
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* WeatherDataGrid Skeleton */}
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
          {/* Hourly ForecastView Skeleton */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-9 w-32" />
            </div>
            <Skeleton className="h-[150px] w-full" />
          </Card>
        </div>
      </div>
      {/* Daily ForecastView Skeleton */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-9 w-32" />
        </div>
        <Skeleton className="h-[150px] w-full" />
      </Card>
      {/* Footer Skeleton */}
      <Card className="w-full p-4 flex items-center justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-48" />
      </Card>
    </main>
  );
}