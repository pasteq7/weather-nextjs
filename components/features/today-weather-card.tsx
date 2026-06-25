'use client';

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import CurrentWeatherIcon from "@/components/icons/current-weather-icon";
import { formatTemperature, mapWmoToWeather } from "@/lib/utils";
import { WeatherData } from "@/lib/types";
import { useTranslations } from 'next-intl';
import { MapPin } from 'lucide-react';

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
  const [feelsLikeTemp] = formatTemperature(current.apparent_temperature ?? current.temperature_2m, units);
  const [highTemp] = formatTemperature(weatherData.daily.temperature_2m_max[0], units);
  const [lowTemp] = formatTemperature(weatherData.daily.temperature_2m_min[0], units);

  const displayLocation = location || weatherData.name || t('Weather.unknownLocation');
  const displayLastFetchedTime = lastFetchedTime || '--:--';
  const lastUpdatedLabel = t('Weather.lastUpdated', { time: '' }).replace(/\s*[:：]\s*$/, '');

  return (
    <Card className="relative h-full overflow-hidden rounded-lg border-primary/25 bg-card/70 p-0 shadow-lg shadow-primary/5">
      <div className="relative flex h-full min-h-[14.5rem] flex-col justify-between gap-3 p-4 sm:min-h-[18rem] sm:gap-5 sm:p-6 lg:min-h-[18.25rem] lg:p-5">
        <div className="flex flex-row items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              <MapPin className="h-3.5 w-3.5" />
              <span>{t('Weather.currentLocation')}</span>
            </p>
            <h2 className="mt-1.5 max-w-full text-xl font-bold leading-tight text-card-foreground [overflow-wrap:anywhere] sm:mt-2 sm:text-3xl lg:text-2xl">
              {displayLocation}
            </h2>
            <p className="mt-1 text-sm font-medium capitalize text-muted-foreground sm:mt-2">{description}</p>
          </div>
          <div className="w-fit shrink-0 rounded-lg border border-border/25 bg-background/15 px-2.5 py-2 text-xs font-medium leading-snug text-muted-foreground/75 sm:min-w-36 sm:px-3 sm:text-right">
            <span className="block">{lastUpdatedLabel}</span>
            <span className="block font-semibold text-card-foreground/85">{displayLastFetchedTime}</span>
          </div>
        </div>

        <div className="grid flex-1 grid-cols-[minmax(5.5rem,1fr)_auto] items-center gap-3 sm:grid-cols-[minmax(9rem,1fr)_auto] sm:gap-5">
          <div className="flex justify-center sm:justify-start">
            <div className="h-24 w-24 shrink-0 drop-shadow-[0_18px_24px_rgba(0,0,0,0.22)] sm:h-40 sm:w-40 lg:h-40 lg:w-40">
              <CurrentWeatherIcon iconCode={icon} />
            </div>
          </div>
          <div className="flex min-w-0 flex-col items-center text-center sm:items-end sm:text-right">
            <p className="tabular-nums text-4xl font-bold leading-none text-card-foreground sm:text-7xl lg:text-6xl">
              {temp}
              <span className="align-top text-xl font-semibold text-primary sm:text-3xl">{tempUnit}</span>
            </p>
            <p className="mt-1.5 text-xs font-medium text-muted-foreground sm:mt-3 sm:text-sm">
              {t('Weather.feelsLike')} {feelsLikeTemp}{tempUnit}
            </p>
            <p className="mt-2 rounded-full border border-border/20 bg-background/20 px-3 py-1.5 text-xs font-semibold text-card-foreground/85 sm:mt-4 sm:px-4 sm:text-sm">
              {lowTemp}{tempUnit} / {highTemp}{tempUnit}
            </p>
            <p className="mt-2 text-xs font-medium text-muted-foreground/70">{t('Weather.minMax')}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
