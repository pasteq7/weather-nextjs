import type { ComponentType, SVGProps } from 'react';

import FillBarometer from '@meteocons/svg/fill/barometer.svg';
import FillClearDay from '@meteocons/svg/fill/clear-day.svg';
import FillClearNight from '@meteocons/svg/fill/clear-night.svg';
import FillCloudy from '@meteocons/svg/fill/cloudy.svg';
import FillDrizzle from '@meteocons/svg/fill/drizzle.svg';
import FillFog from '@meteocons/svg/fill/fog.svg';
import FillHorizon from '@meteocons/svg/fill/horizon.svg';
import FillHumidity from '@meteocons/svg/fill/humidity.svg';
import FillOvercast from '@meteocons/svg/fill/overcast.svg';
import FillPartlyCloudyDay from '@meteocons/svg/fill/partly-cloudy-day.svg';
import FillPartlyCloudyNight from '@meteocons/svg/fill/partly-cloudy-night.svg';
import FillRain from '@meteocons/svg/fill/rain.svg';
import FillSnow from '@meteocons/svg/fill/snow.svg';
import FillSunrise from '@meteocons/svg/fill/sunrise.svg';
import FillSunset from '@meteocons/svg/fill/sunset.svg';
import FillThunderstorms from '@meteocons/svg/fill/thunderstorms.svg';
import FillWind from '@meteocons/svg/fill/wind.svg';
import LineBarometer from '@meteocons/svg/line/barometer.svg';
import LineClearDay from '@meteocons/svg/line/clear-day.svg';
import LineClearNight from '@meteocons/svg/line/clear-night.svg';
import LineCloudy from '@meteocons/svg/line/cloudy.svg';
import LineDrizzle from '@meteocons/svg/line/drizzle.svg';
import LineFog from '@meteocons/svg/line/fog.svg';
import LineHorizon from '@meteocons/svg/line/horizon.svg';
import LineHumidity from '@meteocons/svg/line/humidity.svg';
import LineOvercast from '@meteocons/svg/line/overcast.svg';
import LinePartlyCloudyDay from '@meteocons/svg/line/partly-cloudy-day.svg';
import LinePartlyCloudyNight from '@meteocons/svg/line/partly-cloudy-night.svg';
import LineRain from '@meteocons/svg/line/rain.svg';
import LineSnow from '@meteocons/svg/line/snow.svg';
import LineSunrise from '@meteocons/svg/line/sunrise.svg';
import LineSunset from '@meteocons/svg/line/sunset.svg';
import LineThunderstorms from '@meteocons/svg/line/thunderstorms.svg';
import LineWind from '@meteocons/svg/line/wind.svg';
import MonochromeBarometer from '@meteocons/svg/monochrome/barometer.svg';
import MonochromeClearDay from '@meteocons/svg/monochrome/clear-day.svg';
import MonochromeClearNight from '@meteocons/svg/monochrome/clear-night.svg';
import MonochromeCloudy from '@meteocons/svg/monochrome/cloudy.svg';
import MonochromeDrizzle from '@meteocons/svg/monochrome/drizzle.svg';
import MonochromeFog from '@meteocons/svg/monochrome/fog.svg';
import MonochromeHorizon from '@meteocons/svg/monochrome/horizon.svg';
import MonochromeHumidity from '@meteocons/svg/monochrome/humidity.svg';
import MonochromeOvercast from '@meteocons/svg/monochrome/overcast.svg';
import MonochromePartlyCloudyDay from '@meteocons/svg/monochrome/partly-cloudy-day.svg';
import MonochromePartlyCloudyNight from '@meteocons/svg/monochrome/partly-cloudy-night.svg';
import MonochromeRain from '@meteocons/svg/monochrome/rain.svg';
import MonochromeSnow from '@meteocons/svg/monochrome/snow.svg';
import MonochromeSunrise from '@meteocons/svg/monochrome/sunrise.svg';
import MonochromeSunset from '@meteocons/svg/monochrome/sunset.svg';
import MonochromeThunderstorms from '@meteocons/svg/monochrome/thunderstorms.svg';
import MonochromeWind from '@meteocons/svg/monochrome/wind.svg';

export type MeteoconStyle = 'line' | 'fill' | 'monochrome';
export type MeteoconName =
  | 'barometer'
  | 'clear-day'
  | 'clear-night'
  | 'cloudy'
  | 'drizzle'
  | 'fog'
  | 'horizon'
  | 'humidity'
  | 'overcast'
  | 'partly-cloudy-day'
  | 'partly-cloudy-night'
  | 'rain'
  | 'snow'
  | 'sunrise'
  | 'sunset'
  | 'thunderstorms'
  | 'wind';

export type MeteoconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export const meteoconStyles: MeteoconStyle[] = ['line', 'fill', 'monochrome'];

export const currentWeatherIconNames: Record<string, MeteoconName> = {
  '01d': 'clear-day',
  '01n': 'clear-night',
  '02d': 'partly-cloudy-day',
  '02n': 'partly-cloudy-night',
  '03d': 'cloudy',
  '03n': 'cloudy',
  '04d': 'overcast',
  '04n': 'overcast',
  '09d': 'drizzle',
  '09n': 'drizzle',
  '10d': 'rain',
  '10n': 'rain',
  '11d': 'thunderstorms',
  '11n': 'thunderstorms',
  '13d': 'snow',
  '13n': 'snow',
  '50d': 'fog',
  '50n': 'fog',
};

export const dataWeatherIconNames: Record<string, MeteoconName> = {
  humidity: 'humidity',
  pressure: 'barometer',
  sunrise: 'sunrise',
  sunset: 'sunset',
  visibility: 'horizon',
  wind: 'wind',
};

const icons: Record<MeteoconStyle, Record<MeteoconName, MeteoconComponent>> = {
  line: {
    barometer: LineBarometer,
    'clear-day': LineClearDay,
    'clear-night': LineClearNight,
    cloudy: LineCloudy,
    drizzle: LineDrizzle,
    fog: LineFog,
    horizon: LineHorizon,
    humidity: LineHumidity,
    overcast: LineOvercast,
    'partly-cloudy-day': LinePartlyCloudyDay,
    'partly-cloudy-night': LinePartlyCloudyNight,
    rain: LineRain,
    snow: LineSnow,
    sunrise: LineSunrise,
    sunset: LineSunset,
    thunderstorms: LineThunderstorms,
    wind: LineWind,
  },
  fill: {
    barometer: FillBarometer,
    'clear-day': FillClearDay,
    'clear-night': FillClearNight,
    cloudy: FillCloudy,
    drizzle: FillDrizzle,
    fog: FillFog,
    horizon: FillHorizon,
    humidity: FillHumidity,
    overcast: FillOvercast,
    'partly-cloudy-day': FillPartlyCloudyDay,
    'partly-cloudy-night': FillPartlyCloudyNight,
    rain: FillRain,
    snow: FillSnow,
    sunrise: FillSunrise,
    sunset: FillSunset,
    thunderstorms: FillThunderstorms,
    wind: FillWind,
  },
  monochrome: {
    barometer: MonochromeBarometer,
    'clear-day': MonochromeClearDay,
    'clear-night': MonochromeClearNight,
    cloudy: MonochromeCloudy,
    drizzle: MonochromeDrizzle,
    fog: MonochromeFog,
    horizon: MonochromeHorizon,
    humidity: MonochromeHumidity,
    overcast: MonochromeOvercast,
    'partly-cloudy-day': MonochromePartlyCloudyDay,
    'partly-cloudy-night': MonochromePartlyCloudyNight,
    rain: MonochromeRain,
    snow: MonochromeSnow,
    sunrise: MonochromeSunrise,
    sunset: MonochromeSunset,
    thunderstorms: MonochromeThunderstorms,
    wind: MonochromeWind,
  },
};

export function getMeteocon(style: MeteoconStyle, name: MeteoconName) {
  return icons[style][name];
}
