'use client';

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import CurrentWeatherIcon from "@/components/icons/current-weather-icon";
import { formatTemperature, mapWmoToWeather } from "@/lib/utils";
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

  return (
    <Card className="flex-grow border-primary/20 bg-card/85 p-5 shadow-lg shadow-primary/5">
      <div className="flex h-full flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground/60">
              {t('Weather.currentLocation')}
            </p>
            <h2 className="mt-1 truncate text-2xl font-bold leading-tight text-card-foreground">
              {location || weatherData.name || t('Weather.unknownLocation')}
            </h2>
            <p className="mt-1 text-sm capitalize text-muted-foreground">{description}</p>
          </div>
          <div className="rounded-md border border-border/25 bg-background/20 px-2 py-1 text-right text-xs font-medium text-muted-foreground/70">
            {t('Weather.lastUpdated', { time: lastFetchedTime })}
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center gap-5 sm:justify-between">
          <div className="h-32 w-32 shrink-0 sm:h-36 sm:w-36">
            <CurrentWeatherIcon iconCode={icon} />
          </div>
          <div className="min-w-0">
            <p className="text-5xl font-bold leading-none text-card-foreground sm:text-6xl">
              {temp}
              <span className="align-top text-2xl font-semibold text-primary">{tempUnit}</span>
            </p>
            <p className="mt-4 text-sm font-semibold text-card-foreground/85">
              {lowTemp}{tempUnit} / {highTemp}{tempUnit}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
