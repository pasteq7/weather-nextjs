// app/[locale]/page.tsx
'use client';

import { useAppContext } from '../context/AppContext';
import TodayWeatherCard from '@/components/features/today-weather-card';
import WeatherConditionCards from '@/components/features/weather-condition-cards';
import ForecastView from '@/components/features/forecast-view';
import ErrorDisplay from '@/components/features/error-display';
import LoadingSkeleton from './loading';
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
        <main className="flex-grow flex items-center justify-center">
          <Card className="w-full max-w-md text-center">
            <CardContent className="py-10">
              <p className="text-sm font-medium text-destructive">{error}</p>
            </CardContent>
          </Card>
        </main>
      ) : (
        <main className="flex flex-grow flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)]">
            <div className="min-w-0">
              <TodayWeatherCard weatherData={weatherData!} units={units} location={weatherData!.name} />
            </div>
            <div className="min-w-0">
              <WeatherConditionCards weatherData={weatherData!} units={units} />
            </div>
          </div>
          <ForecastView type="hourly" weatherData={weatherData!} units={units} />
          <ForecastView type="daily" weatherData={weatherData!} units={units} />
        </main>
      )}
    </>
  );
}
