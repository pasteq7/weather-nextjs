// lib/api.ts

import { WeatherData } from './types';

const GEO_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const REVERSE_GEO_API_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';

export const getCoordinatesForCity = async (city: string) => {
  const cityName = city.split(',')[0].trim();

  const params = new URLSearchParams({
    name: cityName,
    count: '1',
    language: 'en',
    format: 'json'
  });

  const response = await fetch(`${GEO_API_URL}?${params.toString()}`);
  if (!response.ok) {
    throw new Error('ERROR_FETCH_COORDINATES');
  }
  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error('ERROR_CITY_NOT_FOUND');
  }
  const { latitude, longitude, name } = data.results[0];
  return { latitude, longitude, name };
};

export const getCityNameFromCoordinates = async (latitude: number, longitude: number): Promise<{name: string | null, ok: boolean}> => {
    const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        localityLanguage: 'en',
    });
    try {
        const response = await fetch(`${REVERSE_GEO_API_URL}?${params.toString()}`);
        if (!response.ok) return { name: null, ok: false };
        
        const data = await response.json();
        if (data && data.city) {
          const name = data.countryCode ? `${data.city}, ${data.countryCode}` : data.city;
          return { name, ok: true };
        }
        return { name: null, ok: true };
    } catch (error) {
        console.error("Failed to fetch city name from coordinates", error);
        return { name: null, ok: false };
    }
};

export const fetchWeatherData = async (latitude: number, longitude: number, units: string, timezone: string = 'auto'): Promise<WeatherData> => {
  const isImperial = units === 'imperial';

  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: 'temperature_2m,relative_humidity_2m,is_day,weather_code,wind_speed_10m,pressure_msl',
    hourly: 'temperature_2m,precipitation_probability,weather_code,visibility,is_day,wind_speed_10m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset',
    timeformat: 'unixtime',
    timezone: timezone,
    forecast_days: '5',
    temperature_unit: isImperial ? 'fahrenheit' : 'celsius',
    wind_speed_unit: isImperial ? 'mph' : 'kmh',
  });

  const response = await fetch(`${WEATHER_API_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error('ERROR_FETCH_WEATHER');
  }
  return response.json();
};

export const fetchWeatherByCity = async (city: string, units: string = 'metric', timezone: string = 'auto') => {
  const { latitude, longitude } = await getCoordinatesForCity(city);
  const weatherData = await fetchWeatherData(latitude, longitude, units, timezone);
  
  return { ...weatherData, name: city, latitude, longitude };
};