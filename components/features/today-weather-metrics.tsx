'use client';

import WeatherIcon from '@/components/icons/weather-icon';
import { cn } from '@/lib/utils';
import { getDataWeatherIconColor } from '@/lib/weather-icon-colors';

interface TodayMetric {
  iconType: string;
  label: string;
  value: string;
  unit?: string;
}

interface TodayWeatherMetricsProps {
  metrics: TodayMetric[];
  compact?: boolean;
}

export default function TodayWeatherMetrics({ metrics, compact = false }: TodayWeatherMetricsProps) {
  return (
    <div className={cn(
      'grid gap-3',
      compact ? 'grid-cols-1' : 'grid-cols-2 sm:grid-cols-4'
    )}>
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="flex min-h-12 items-center gap-2 px-1 py-1"
        >
          <div className={cn('h-6 w-6 shrink-0 opacity-80', getDataWeatherIconColor(metric.iconType))}>
            <WeatherIcon type={metric.iconType} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-[0.68rem] font-medium text-muted-foreground/75">{metric.label}</p>
            <p className="truncate text-sm font-semibold text-card-foreground">
              {metric.value}
              {metric.unit && <span className="ml-1 text-[0.68rem] font-medium text-muted-foreground/75">{metric.unit}</span>}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
