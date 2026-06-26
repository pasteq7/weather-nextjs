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
  const [feelsLikeTemp] = formatTemperature(current.apparent_temperature ?? current.temperature_2m, units);
  const [highTemp] = formatTemperature(weatherData.daily.temperature_2m_max[0], units);
  const [lowTemp] = formatTemperature(weatherData.daily.temperature_2m_min[0], units);

  const displayLocation = location || weatherData.name || t('Weather.unknownLocation');
  const displayLastFetchedTime = lastFetchedTime || '--:--';
  const lastUpdatedLabel = t('Weather.lastUpdated', { time: '' }).replace(/\s*[:：]\s*$/, '');

  return (
    <Card className="today-weather-card relative h-full shrink-0 overflow-hidden rounded-lg border-primary/25 bg-card/70 p-0 shadow-lg shadow-primary/5">
      <div className="today-weather-card__body relative flex h-full min-h-[20rem] flex-col gap-4 p-4 min-[420px]:min-h-[17rem] sm:min-h-[17.5rem] sm:p-5 min-[72rem]:min-h-[16.75rem]">
        <div className="today-weather-card__header grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
          <div className="min-w-0">
            <h2
              className="today-weather-card__title max-w-full text-[1.55rem] font-bold leading-[1.08] text-card-foreground sm:text-[1.7rem] min-[72rem]:text-[1.6rem]"
              title={displayLocation}
            >
              {displayLocation}
            </h2>
            <p className="today-weather-card__description mt-1.5 text-xs font-semibold capitalize text-muted-foreground sm:text-sm">{description}</p>
          </div>
          <div className="today-weather-card__updated min-w-[6.75rem] shrink-0 rounded-lg border border-border/25 bg-background/15 px-2.5 py-2 text-right text-[0.68rem] font-medium leading-snug text-muted-foreground/75 sm:px-3">
            <span className="today-weather-card__updated-label block">{lastUpdatedLabel}</span>
            <span className="today-weather-card__updated-time block font-semibold text-card-foreground/85">{displayLastFetchedTime}</span>
          </div>
        </div>

        <div className="today-weather-card__current flex min-h-0 flex-1 flex-col items-center justify-center gap-3 px-2 py-2">
          <div className="flex min-h-0 justify-center">
            <div className="today-weather-card__icon h-28 w-28 shrink-0 drop-shadow-[0_18px_24px_rgba(0,0,0,0.22)] sm:h-32 sm:w-32 min-[72rem]:h-32 min-[72rem]:w-32">
              <CurrentWeatherIcon iconCode={icon} />
            </div>
          </div>
          <div className="flex min-w-0 flex-col items-center text-center">
            <p className="today-weather-card__temperature tabular-nums text-[3.55rem] font-bold leading-none text-card-foreground sm:text-[3.9rem] min-[72rem]:text-[3.65rem]">
              {temp}
              <span className="today-weather-card__unit align-top text-xl font-semibold text-primary sm:text-2xl">{tempUnit}</span>
            </p>
            <div className="today-weather-card__details mt-2 flex flex-col items-center gap-1.5">
              <p className="today-weather-card__feels-like text-xs font-medium text-muted-foreground sm:text-sm">
                {t('Weather.feelsLike')} {feelsLikeTemp}{tempUnit}
              </p>
              <p className="today-weather-card__range rounded-full border border-border/20 bg-background/20 px-3 py-1.5 text-xs font-semibold text-card-foreground/85">
                {lowTemp}{tempUnit} / {highTemp}{tempUnit}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
