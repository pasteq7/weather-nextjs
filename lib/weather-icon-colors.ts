export const currentWeatherIconColors: Record<string, string> = {
  "01d": "text-weather-clear-day",
  "01n": "text-weather-clear-night",
  "02d": "text-weather-partly-cloudy-day",
  "02n": "text-weather-partly-cloudy-night",
  "03d": "text-weather-cloud",
  "03n": "text-weather-cloud",
  "04d": "text-weather-overcast",
  "04n": "text-weather-overcast",
  "09d": "text-weather-rain",
  "09n": "text-weather-rain",
  "10d": "text-weather-rain",
  "10n": "text-weather-rain",
  "11d": "text-weather-storm",
  "11n": "text-weather-storm",
  "13d": "text-weather-snow",
  "13n": "text-weather-snow",
  "50d": "text-weather-fog",
  "50n": "text-weather-fog",
};

export const dataWeatherIconColors: Record<string, string> = {
  humidity: "text-weather-humidity",
  wind: "text-weather-wind",
  pressure: "text-weather-pressure",
  visibility: "text-weather-visibility",
  sunrise: "text-weather-sunrise",
  sunset: "text-weather-sunset",
};

export function getCurrentWeatherIconColor(iconCode: string) {
  return currentWeatherIconColors[iconCode] ?? currentWeatherIconColors["01d"];
}

export function getDataWeatherIconColor(type: string) {
  return dataWeatherIconColors[type] ?? "text-primary";
}
