export interface DailyDataPoint {
  time: number;
  weather_code: number;
  temperature_2m_max: number;
  temperature_2m_min: number;
}

export interface HourlyDataPoint {
  time: number;
  temperature: number;
  weather_code: number;
  is_day: number;
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  name?: string; // Optional name from geocoding
  current_units: {
    time: string;
    interval: string;
    temperature_2m: string;
    relative_humidity_2m: string;
    is_day: string;
    weather_code: string;
    wind_speed_10m: string;
    pressure_msl: string;
  };
  current: {
    time: number;
    interval: number;
    temperature_2m: number;
    relative_humidity_2m: number;
    is_day: number;
    weather_code: number;
    wind_speed_10m: number;
    pressure_msl: number;
  };
  hourly_units: {
    time: string;
    temperature_2m: string;
    precipitation_probability: string;
    weather_code: string;
    wind_speed_10m: string;
    visibility: string;
    is_day: string;
  };
  hourly: {
    time: number[];
    temperature_2m: number[];
    precipitation_probability: number[];
    weather_code: number[];
    wind_speed_10m: number[];
    visibility: number[];
    is_day: number[];
  };
  daily_units: {
    time: string;
    weather_code: string;
    temperature_2m_max: string;
    temperature_2m_min: string;
    sunrise: string;
    sunset: string;
  };
  daily: {
    time: number[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    sunrise: number[];
    sunset: number[];
  };
}