import { useAppContext } from '@/app/context/AppContext';
import TodayWeatherCard from '@/components/features/today-weather-card';
import WeatherDataGrid from '@/components/features/weather-data-grid';
import ForecastView from '@/components/features/forecast-view';
import ErrorDisplay from '@/components/features/error-display';
import LoadingSkeleton from '@/app/Loading';
import { Card, CardContent } from '@/components/ui/card';

export default function HomePage() {
  const { weatherData, units, isLoading, error, isInitializing } = useAppContext();

  const showSkeleton = isInitializing || isLoading || (!weatherData && !error);

  return (
    <>
      <ErrorDisplay error={error} />

      {showSkeleton ? (
        <LoadingSkeleton />
      ) : error && !weatherData ? (
        <main className="flex min-h-0 items-center justify-center overflow-hidden">
          <Card className="w-full max-w-md text-center">
            <CardContent className="py-10">
              <p className="text-sm font-medium text-destructive">{error}</p>
            </CardContent>
          </Card>
        </main>
      ) : (
        <main className="min-h-0 overflow-hidden">
          <div className="flex h-full min-h-0 flex-col gap-2 overflow-y-auto pr-1 sm:gap-3 lg:overflow-hidden lg:pr-0">
            <div className="grid min-h-0 grid-cols-1 gap-2 sm:gap-3 lg:grid-cols-[minmax(18rem,0.9fr)_minmax(0,1.55fr)]">
              <div className="flex min-h-0 flex-col">
              <TodayWeatherCard weatherData={weatherData!} units={units} location={weatherData!.name} />
            </div>
              <div className="flex min-h-0 flex-col gap-2 sm:gap-3">
              <WeatherDataGrid weatherData={weatherData!} units={units} />
              <ForecastView type="hourly" weatherData={weatherData!} units={units} />
            </div>
          </div>
          <ForecastView type="daily" weatherData={weatherData!} units={units} />
          </div>
        </main>
      )}
    </>
  );
}
