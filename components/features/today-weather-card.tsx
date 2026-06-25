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

  const displayLocation = location || weatherData.name || t('Weather.unknownLocation');
  const displayLastFetchedTime = lastFetchedTime || '--:--';

  return (
    <Card className="flex-grow overflow-hidden border-primary/20 bg-card/85 p-0 shadow-lg shadow-primary/5">
      <div className="flex h-full min-h-[22rem] flex-col justify-between gap-6 p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground/60">
              {t('Weather.currentLocation')}
            </p>
            <h2 className="mt-2 max-w-full text-2xl font-bold leading-tight text-card-foreground [overflow-wrap:anywhere] sm:text-3xl">
              {displayLocation}
            </h2>
            <p className="mt-2 text-sm font-medium capitalize text-muted-foreground">{description}</p>
          </div>
          <p className="w-fit rounded-lg border border-border/20 bg-background/15 px-3 py-2 text-xs font-medium leading-snug text-muted-foreground/75 sm:max-w-40 sm:text-right">
            {t('Weather.lastUpdated', { time: displayLastFetchedTime })}
          </p>
        </div>

        <div className="grid flex-1 items-center gap-6 sm:grid-cols-[minmax(8rem,1fr)_auto]">
          <div className="flex justify-center sm:justify-start">
            <div className="h-36 w-36 shrink-0 sm:h-40 sm:w-40 lg:h-44 lg:w-44">
              <CurrentWeatherIcon iconCode={icon} />
            </div>
          </div>
          <div className="flex min-w-0 flex-col items-center text-center sm:items-end sm:text-right">
            <p className="tabular-nums text-6xl font-bold leading-none text-card-foreground sm:text-7xl">
              {temp}
              <span className="align-top text-2xl font-semibold text-primary sm:text-3xl">{tempUnit}</span>
            </p>
            <p className="mt-4 rounded-full bg-background/20 px-3 py-1 text-sm font-semibold text-card-foreground/85">
              {lowTemp}{tempUnit} / {highTemp}{tempUnit}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
