'use client';

import { Card } from '@/components/ui/card';
import { WeatherData } from '@/lib/types';
import { formatWindSpeed } from '@/lib/utils';
import { Droplets, Wind } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface WeatherConditionCardsProps {
  weatherData: WeatherData;
  units: string;
}

function MiniBar({ value, max = 100 }: { value: number; max?: number }) {
  const width = `${Math.min(100, Math.max(4, (value / max) * 100))}%`;

  return (
    <div className="h-1.5 rounded-full bg-white/10">
      <div className="h-full rounded-full bg-gradient-to-r from-chart-2 via-primary to-accent" style={{ width }} />
    </div>
  );
}

export default function WeatherConditionCards({ weatherData, units }: WeatherConditionCardsProps) {
  const t = useTranslations('Weather');
  const { current, hourly } = weatherData;
  const now = Math.floor(Date.now() / 1000);
  const currentHourIndex = hourly.time.findIndex((time) => time >= now);
  const precipitation = currentHourIndex !== -1
    ? hourly.precipitation_probability[currentHourIndex]
    : hourly.precipitation_probability[0];
  const nextRainValues = hourly.precipitation_probability.slice(
    Math.max(0, currentHourIndex),
    Math.max(0, currentHourIndex) + 8
  );
  const [windValue, windUnit] = formatWindSpeed(current.wind_speed_10m, units);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
      <Card className="gap-4 border-white/10 bg-card/60 p-5 shadow-xl shadow-black/5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t('precipitation')}</p>
            <p className="mt-1 text-3xl font-semibold text-card-foreground">{Math.round(precipitation)}%</p>
          </div>
          <Droplets className="h-5 w-5 text-chart-2" />
        </div>
        <div className="flex h-16 items-end gap-2">
          {nextRainValues.map((value, index) => (
            <div key={`${value}-${index}`} className="flex flex-1 items-end rounded-sm bg-white/5">
              <div
                className="w-full rounded-sm bg-chart-2/70"
                style={{ height: `${Math.max(12, Math.min(100, value))}%` }}
              />
            </div>
          ))}
        </div>
      </Card>

      <Card className="gap-5 border-white/10 bg-card/60 p-5 shadow-xl shadow-black/5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t('windSpeed')}</p>
            <p className="mt-1 text-2xl font-semibold text-card-foreground">
              {windValue}
              <span className="ml-1 text-xs font-medium text-muted-foreground">{windUnit}</span>
            </p>
          </div>
          <Wind className="h-5 w-5 text-weather-wind" />
        </div>
        <MiniBar value={Number(windValue) || 0} max={units === 'imperial' ? 45 : 72} />
      </Card>
    </div>
  );
}
