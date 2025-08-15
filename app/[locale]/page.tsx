// app/[locale]/page.tsx
'use client';

import { useAppContext } from '../context/AppContext';
import LocationCard from '@/components/features/location-card';
import TodayWeatherCard from '@/components/features/today-weather-card';
import WeatherDataGrid from '@/components/features/weather-data-grid';
import ForecastView from '@/components/features/forecast-view';
import ErrorDisplay from '@/components/features/error-display';
import LoadingSkeleton from './loading';

export default function HomePage() {
  const { weatherData, units, isLoading, error, isInitializing } = useAppContext();

  // This logic ensures the skeleton UI is shown in three key scenarios:
  // 1. `isInitializing`: On the very first load while attempting to geolocate the user.
  // 2. `isLoading`: When actively fetching new weather data after a user action (e.g., search).
  // 3. `!weatherData`: If there is no weather data to display, which is true on the initial render
  //    and, crucially, remains true if an API call fails and sets weatherData back to null.
  // This prevents the UI from ever showing a blank page instead of weather info or a skeleton.
  const showSkeleton = isInitializing || isLoading || !weatherData;

  return (
    <>
      {/* ErrorDisplay is always mounted to catch and display any errors via toast */}
      <ErrorDisplay error={error} />

      {showSkeleton ? (
        <LoadingSkeleton />
      ) : (
        // This content will ONLY render if we are not loading and have valid weatherData.
        <main className="flex-grow flex flex-col gap-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-1 flex flex-col gap-4">
              <LocationCard location={weatherData.name} />
              <TodayWeatherCard weatherData={weatherData} units={units} />
            </div>
            <div className="lg:col-span-2 flex flex-col gap-4">
              <WeatherDataGrid weatherData={weatherData} units={units} />
              <ForecastView type="hourly" weatherData={weatherData} units={units} />
            </div>
          </div>
          <ForecastView type="daily" weatherData={weatherData} units={units} />
        </main>
      )}
    </>
  );
}