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
          <div className="weather-dashboard flex h-full min-h-0 flex-col gap-3 overflow-y-auto overscroll-contain pb-1 pr-1 min-[72rem]:overflow-hidden min-[72rem]:pr-0">
            <div className="weather-summary-grid grid min-h-0 shrink-0 grid-cols-1 gap-3 min-[50rem]:grid-cols-[minmax(19rem,0.9fr)_minmax(0,1.55fr)]">
              <div className="flex min-h-0 flex-col">
                <TodayWeatherCard weatherData={weatherData!} units={units} location={weatherData!.name} />
              </div>
              <div className="weather-right-column flex min-h-0 flex-col gap-3">
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
