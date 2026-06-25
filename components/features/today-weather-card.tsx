'use client';

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import CurrentWeatherIcon from "@/components/icons/current-weather-icon";
import TodayWeatherMetrics from "@/components/features/today-weather-metrics";
import {
  formatHumidity,
  formatPressure,
  formatTemperature,
  formatTime,
  formatVisibility,
  formatWindSpeed,
  mapWmoToWeather
} from "@/lib/utils";
import { WeatherData } from "@/lib/types";
import { useTranslations } from 'next-intl';

interface TodayWeatherCardProps {
  weatherData: WeatherData;
  units: string;
  location?: string;
}

export default function TodayWeatherCard({ weatherData, units, location }: TodayWeatherCardProps) {
  const t = useTranslations();
  const [lastFetchedTime, setLastFetchedTime] = useState('');

  useEffect(() => {
    // This effect now runs whenever new weatherData is received.
    if (weatherData) {
      // Get the current time from the user's computer
      const now = new Date();
      const time = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: units === 'imperial',
      });
      setLastFetchedTime(time);
    }
  }, [weatherData, units]); // Re-run when data or units change

  if (!weatherData) {
    return (
      <Card className="flex flex-grow flex-col items-center justify-center p-4">
        <Skeleton className="w-32 h-32 rounded-full" />
        <Skeleton className="w-3/4 h-10 mt-4" />
        <Skeleton className="w-1/2 h-6 mt-2" />
        <Skeleton className="w-1/3 h-4 mt-2" />
      </Card>
    );
  }

  const { current } = weatherData;
  const { descriptionKey, icon } = mapWmoToWeather(current.weather_code, current.is_day);
  const description = t(`WMO.${descriptionKey}`);
  const [temp, tempUnit] = formatTemperature(current.temperature_2m, units);
  const [highTemp] = formatTemperature(weatherData.daily.temperature_2m_max[0], units);
  const [lowTemp] = formatTemperature(weatherData.daily.temperature_2m_min[0], units);
  const humidity = formatHumidity(current.relative_humidity_2m);
  const pressure = formatPressure(current.pressure_msl, units);
  const wind = formatWindSpeed(current.wind_speed_10m, units);
  const now = new Date();
  const currentHourIndex = weatherData.hourly.time.findIndex((timestamp) => {
    const hourDate = new Date(timestamp * 1000);
    return hourDate.getHours() === now.getHours() && hourDate.getDate() === now.getDate();
  });
  const visibilityValue = currentHourIndex !== -1
    ? weatherData.hourly.visibility[currentHourIndex]
    : weatherData.hourly.visibility[0];
  const visibility = formatVisibility(visibilityValue, units);
  const sunrise = formatTime(new Date(weatherData.daily.sunrise[0] * 1000), weatherData.timezone, units);
  const sunset = formatTime(new Date(weatherData.daily.sunset[0] * 1000), weatherData.timezone, units);
  const daylightHours = Math.max(0, weatherData.daily.sunset[0] - weatherData.daily.sunrise[0]) / 3600;
  const daylight = `${Math.floor(daylightHours)}h ${Math.round((daylightHours % 1) * 60)}m`;
  const metrics = [
    { iconType: 'humidity', label: t('Weather.humidity'), value: humidity[0], unit: humidity[1] },
    { iconType: 'wind', label: t('Weather.windSpeed'), value: wind[0], unit: wind[1] },
    { iconType: 'pressure', label: t('Weather.pressure'), value: pressure[0], unit: pressure[1] },
    { iconType: 'visibility', label: t('Weather.visibility'), value: visibility[0], unit: visibility[1] },
  ];

  return (
    <Card className="relative min-h-[22rem] overflow-hidden border-white/10 bg-card/75 p-5 shadow-xl shadow-black/10 md:p-6">
      <div className="relative flex h-full flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground/75">{t('Weather.nowIn')}</p>
            <h2 className="mt-1 truncate text-3xl font-semibold leading-tight text-card-foreground md:text-4xl">
              {location || weatherData.name || t('Weather.unknownLocation')}
            </h2>
            <p className="mt-1 text-sm capitalize text-muted-foreground">{description}</p>
          </div>
          <div className="rounded-md border border-white/10 bg-background/20 px-2 py-1 text-right text-xs font-medium text-muted-foreground/75">
            {t('Weather.lastUpdated', { time: lastFetchedTime })}
          </div>
        </div>

        <div className="grid flex-1 gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="flex flex-col justify-end gap-4">
            <div className="flex items-end gap-5">
              <div className="h-28 w-28 shrink-0 sm:h-36 sm:w-36">
                <CurrentWeatherIcon iconCode={icon} />
              </div>
              <div className="min-w-0 pb-2">
                <p className="text-6xl font-semibold leading-none tracking-normal text-card-foreground sm:text-7xl">
                  {temp}
                  <span className="align-top text-2xl font-medium text-primary">{tempUnit}</span>
                </p>
                <p className="mt-3 text-sm font-medium text-muted-foreground">
                  {lowTemp}{tempUnit} / {highTemp}{tempUnit}
                </p>
              </div>
            </div>
            <TodayWeatherMetrics metrics={metrics} />
          </div>
          <div className="grid gap-3 border-white/10 lg:w-36 lg:border-l lg:pl-5">
            <TodayWeatherMetrics
              compact
              metrics={[
                { iconType: 'sunrise', label: t('Weather.sunrise'), value: sunrise },
                { iconType: 'sunset', label: t('Weather.sunset'), value: sunset },
                { iconType: 'sunrise', label: t('Weather.daylight'), value: daylight },
              ]}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
