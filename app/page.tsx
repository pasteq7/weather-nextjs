import { fetchWeatherByCity, fetchWeatherData, getCityNameFromCoordinates } from '@/lib/api';
import LocationCard from '@/components/features/location-card';
import TodayWeatherCard from '@/components/features/today-weather-card';
import WeatherDataGrid from '@/components/features/weather-data-grid';
import ForecastView from '@/components/features/forecast-view';
import TopBar from '@/components/layout/top-bar';
import Footer from '@/components/layout/footer';
import { WeatherData } from '@/lib/types';
import Loading from './loading';

// This async function will fetch all necessary data.
// Errors thrown here will be caught by the nearest error.tsx boundary.
async function getWeather(
  locationQuery: string | undefined,
  lat: string | undefined,
  lon: string | undefined,
  units: string
) {
  // If no location is provided in the URL, return null to trigger the loading state.
  // The client-side TopBar component will handle geolocation.
  if (!locationQuery && !lat && !lon) {
    return { weatherData: null, locationName: null, units };
  }

  let weatherData: WeatherData;
  let locationName: string;

  if (lat && lon) {
    // Fetch by coordinates if lat/lon are present
    weatherData = await fetchWeatherData(parseFloat(lat), parseFloat(lon), units);
    locationName = await getCityNameFromCoordinates(parseFloat(lat), parseFloat(lon));
  } else {
    // A location query is guaranteed to exist here because of the initial check.
    const city = locationQuery!;
    weatherData = await fetchWeatherByCity(city, units);
    locationName = weatherData.name!;
  }

  return { weatherData, locationName, units };
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Await searchParams before accessing its properties
  const params = await searchParams;
  
  const locationQuery = params?.q as string | undefined;
  const lat = params?.lat as string | undefined;
  const lon = params?.lon as string | undefined;
  const units = (params?.units as string) || 'metric';

  const { weatherData, locationName } = await getWeather(locationQuery, lat, lon, units);

  return (
    <div className="p-2 md:p-4 lg:p-6 mx-auto max-w-7xl w-full flex-grow flex flex-col gap-4">
      {/* Always render TopBar - it handles geolocation */}
      <TopBar locationName={locationName || ''} />
      
      {/* If getWeather returns null, show loading for the main content */}
      {!weatherData || !locationName ? (
        <Loading />
      ) : (
        <main className="flex-grow flex flex-col gap-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-1 flex flex-col gap-4">
              <LocationCard location={locationName} />
              <TodayWeatherCard weatherData={weatherData} units={units} />
            </div>
            <div className="lg:col-span-2 flex flex-col gap-4">
              <WeatherDataGrid weatherData={weatherData} units={units} />
              <ForecastView type="hourly" weatherData={weatherData} units={units} />
            </div>
          </div>
          <ForecastView type="daily" weatherData={weatherData} units={units} />
          <Footer />
        </main>
      )}
    </div>
  );
}