import { WeatherData } from './types';

const GEO_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const REVERSE_GEO_API_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';

// Fetches coordinates for a given city name
export const getCoordinatesForCity = async (city: string) => {
  // Sanitize the city name by removing the country code suffix (e.g., ", FR")
  // This ensures the geocoding API receives a clean city name.
  const cityName = city.split(',')[0].trim();

  const params = new URLSearchParams({
    name: cityName, // Use the sanitized city name for the search
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
      // Appending the country code is great for display, so we keep it.
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

  const response = await fetch(`${WEATHER_API_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Failed to fetch weather data.');
  }
  return response.json();
};

// Combined function to fetch weather by city name
export const fetchWeatherByCity = async (city: string, units: string = 'metric') => {
  // The 'city' parameter (e.g., "Clermont-Ferrand, FR") is passed here.
  // The sanitization will happen inside getCoordinatesForCity.
  const { latitude, longitude, name } = await getCoordinatesForCity(city);
  const weatherData = await fetchWeatherData(latitude, longitude, units);
  
  // We return the original, full city name for display consistency.
  return { ...weatherData, name: city, latitude, longitude };
};