// app/[locale]/loading.tsx

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="flex flex-grow flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)]">
        <div className="min-w-0">
          <TodayWeatherCardSkeleton />
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
          <MiniPanelSkeleton />
          <MiniPanelSkeleton />
        </div>
      </div>
      <ForecastViewSkeleton />
      <ForecastViewSkeleton />
    </main>
  );
}

function TodayWeatherCardSkeleton() {
  return (
    <Card className="min-h-[22rem] gap-6 p-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-36" />
      </div>
      <div className="flex items-end gap-5">
        <Skeleton className="h-32 w-32 rounded-full" />
        <div className="space-y-3">
          <Skeleton className="h-16 w-28" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-14" />)}
      </div>
    </Card>
  );
}

function MiniPanelSkeleton() {
  return (
    <Card className="gap-4 p-5">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-16 w-full" />
    </Card>
  );
}

function ForecastViewSkeleton() {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-9 w-32" />
      </div>
      <Skeleton className="h-[125px] w-full" />
    </Card>
  );
}
