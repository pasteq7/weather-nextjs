import { WeatherData } from './types';

const GEO_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const REVERSE_GEO_API_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';

// Fetches coordinates for a given city name
export const getCoordinatesForCity = async (city: string) => {
  const params = new URLSearchParams({
    name: city,
    count: '1',
    language: 'en',
    format: 'json'
  });

  const response = await fetch(`${GEO_API_URL}?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch city coordinates.');
  }
  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error('City not found. Please try a different name.');
  }
  const { latitude, longitude, name } = data.results[0];
  return { latitude, longitude, name };
};

// Fetches a city name from given coordinates (reverse geocoding)
export const getCityNameFromCoordinates = async (latitude: number, longitude: number): Promise<string> => {
    const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        localityLanguage: 'en',
    });
    const response = await fetch(`${REVERSE_GEO_API_URL}?${params.toString()}`);
    if (!response.ok) return "Unknown Location";
    
    const data = await response.json();
    if (data && data.city) {
      return data.countryCode ? `${data.city}, ${data.countryCode}` : data.city;
    }
    return "Current Location";
};


// Fetches weather data from the API using coordinates
export const fetchWeatherData = async (latitude: number, longitude: number, units: string): Promise<WeatherData> => {
  const isImperial = units === 'imperial';

  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: 'temperature_2m,relative_humidity_2m,is_day,weather_code,wind_speed_10m,pressure_msl',
    hourly: 'temperature_2m,precipitation_probability,weather_code,wind_speed_10m,visibility,is_day',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset',
    timeformat: 'unixtime',
    timezone: 'auto',
    forecast_days: '5',
    temperature_unit: isImperial ? 'fahrenheit' : 'celsius',
    wind_speed_unit: isImperial ? 'mph' : 'kmh',
  });

  const response = await fetch(`${WEATHER_API_URL}?${params.toString()}`, {
    next: { revalidate: 3600 } // Revalidate data every hour
  });

  if (!response.ok) {
    throw new Error('Failed to fetch weather data.');
  }
  return response.json();
};

// Combined function to fetch weather by city name
export const fetchWeatherByCity = async (city: string, units: string = 'metric') => {
  const { latitude, longitude, name } = await getCoordinatesForCity(city);
  const weatherData = await fetchWeatherData(latitude, longitude, units);
  return { ...weatherData, name, latitude, longitude };
};