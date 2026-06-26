import { useAppContext } from '@/app/context/AppContext';
import TodayWeatherCard from '@/components/features/today-weather-card';
import WeatherDataGrid from '@/components/features/weather-data-grid';
import ForecastView from '@/components/features/forecast-view';
import ErrorDisplay from '@/components/features/error-display';
import LoadingSkeleton from '@/app/Loading';
import { Card, CardContent } from '@/components/ui/card';
import Footer from '@/components/layout/footer';

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
          <div className="weather-dashboard flex h-full min-h-0 flex-col gap-2.5 overflow-y-auto overscroll-contain pb-1 pr-1 min-[72rem]:overflow-hidden min-[72rem]:pr-0">
            <div className="weather-summary-grid grid min-h-0 shrink-0 grid-cols-1 gap-2.5 min-[50rem]:grid-cols-[minmax(18rem,0.86fr)_minmax(0,1.6fr)]">
              <div className="flex min-h-0 flex-col">
                <TodayWeatherCard weatherData={weatherData!} units={units} location={weatherData!.name} />
              </div>
              <div className="weather-right-column flex min-h-0 flex-col gap-2.5">
                <WeatherDataGrid weatherData={weatherData!} units={units} />
                <ForecastView type="hourly" weatherData={weatherData!} units={units} />
              </div>
            </div>
            <ForecastView type="daily" weatherData={weatherData!} units={units} />
            <Footer />
          </div>
        </main>
      )}
    </>
  );
}
