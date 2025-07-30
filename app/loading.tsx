import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="p-2 md:p-4 lg:p-6 mx-auto max-w-7xl w-full flex-grow flex flex-col">
      <main className="flex-grow flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1 flex flex-col gap-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="flex-grow w-full min-h-[300px]" />
          </div>
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
            <Skeleton className="h-[220px] w-full" />
          </div>
        </div>
        <Skeleton className="h-[202px] w-full" />
      </main>
      <footer className="w-full">
        <Skeleton className="h-16 w-full" />
      </footer>
    </div>
  );
}