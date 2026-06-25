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
        <main className="flex flex-grow items-center justify-center">
          <Card className="w-full max-w-md text-center">
            <CardContent className="py-10">
              <p className="text-sm font-medium text-destructive">{error}</p>
            </CardContent>
          </Card>
        </main>
      ) : (
        <main className="flex flex-grow flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="flex flex-col gap-4 lg:col-span-1">
              <TodayWeatherCard weatherData={weatherData!} units={units} location={weatherData!.name} />
            </div>
            <div className="flex flex-col gap-4 lg:col-span-2">
              <WeatherDataGrid weatherData={weatherData!} units={units} />
              <ForecastView type="hourly" weatherData={weatherData!} units={units} />
            </div>
          </div>
          <ForecastView type="daily" weatherData={weatherData!} units={units} />
        </main>
      )}
    </>
  );
}
