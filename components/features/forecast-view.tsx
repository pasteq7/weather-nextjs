// components/features/forecast-view.tsx

'use client';

import { useMemo, useCallback, useState, useEffect } from 'react';
import { useViewPreference } from '@/hooks/use-view-preference'; 
import { Card, CardContent } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { LineChart, Line, XAxis, YAxis, ReferenceLine, Tooltip as RechartsTooltip } from 'recharts';
import { BarChart, List, Thermometer, Wind, Droplets } from 'lucide-react';
import { formatTemperature, mapWmoToWeather, formatWindSpeed, cn } from '@/lib/utils';
import { WeatherData, DailyDataPoint, HourlyDataPoint } from '@/lib/types';
import CurrentWeatherIcon from '../icons/current-weather-icon';
import { Skeleton } from '../ui/skeleton';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { useTranslations, useLocale } from 'next-intl';

type DailyRange = 7 | 14;

function DailyForecastItem({ day, units, chartId, itemIndex, locale }: { 
  day: DailyDataPoint; 
  units: string; 
  chartId: string;
  itemIndex: number;
  locale: string;
}) {
  const t = useTranslations('WMO');
  const [isHovered, setIsHovered] = useState(false);
  const [maxTemp, maxTempUnit] = formatTemperature(day.temperature_2m_max, units);
  const [minTemp] = formatTemperature(day.temperature_2m_min, units);
  const { icon, descriptionKey } = mapWmoToWeather(day.weather_code, 1);
  const description = t(descriptionKey);
  const date = new Date(day.time * 1000);
  const dayLabel = date.toLocaleDateString(locale, { weekday: 'long' });
  const capitalizedDayLabel = dayLabel.charAt(0).toUpperCase() + dayLabel.slice(1);

  return (
    <div 
      className="flex flex-col items-center justify-center text-center gap-1 p-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <p className="font-semibold text-sm">{capitalizedDayLabel}</p>
      <div className="w-16 h-16 flex items-center justify-center relative">
        <div className={cn("transition-opacity duration-300", { "opacity-0": isHovered })}>
          <div 
            key={`${chartId}-daily-${day.time}-${itemIndex}`} 
            className="weather-icon-container w-full h-full"
            style={{ isolation: 'isolate' }}
          >
            <CurrentWeatherIcon iconCode={icon} className="w-16 h-16" />
          </div>
        </div>
        <div className={cn("absolute p-1 inset-0 flex items-center justify-center text-center transition-opacity duration-300", { "opacity-0": !isHovered, "pointer-events-none": !isHovered })}>
          <p className="text-xs capitalize">{description}</p>
        </div>
      </div>
      <div className="text-sm">
        <span className="font-bold">{maxTemp}{maxTempUnit}</span>
        <span className="text-muted-foreground"> / {minTemp}{maxTempUnit}</span>
      </div>
    </div>
  );
}

function HourlyForecastItem({ 
  hour, 
  units, 
  timezone, 
  chartId, 
  itemIndex,
  locale
}: { 
  hour: HourlyDataPoint; 
  units: string; 
  timezone: string; 
  chartId: string;
  itemIndex: number;
  locale: string;
}) {
  const t = useTranslations('WMO');
  const [isHovered, setIsHovered] = useState(false);
  const [temp, tempUnit] = formatTemperature(hour.temperature_2m, units);
  const { icon, descriptionKey } = mapWmoToWeather(hour.weather_code, hour.is_day);
  const description = t(descriptionKey);
  const timeLabel = new Date(hour.time * 1000).toLocaleTimeString(locale, { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: units === 'imperial', 
    timeZone: timezone 
  });

  return (
    <div 
      className="flex flex-col items-center justify-center text-center gap-1 p-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <p className="font-semibold text-sm">{timeLabel}</p>
      <div className="w-16 h-16 flex items-center justify-center relative">
        <div className={cn("transition-opacity duration-300", { "opacity-0": isHovered })}>
          <div 
            key={`${chartId}-hourly-${hour.time}-${itemIndex}`} 
            className="weather-icon-container w-full h-full"
            style={{ isolation: 'isolate' }}
          >
            <CurrentWeatherIcon iconCode={icon} className="w-16 h-16" />
          </div>
        </div>
        <div className={cn("absolute p-1 inset-0 flex items-center justify-center text-center transition-opacity duration-300", { "opacity-0": !isHovered, "pointer-events-none": !isHovered })}>
          <p className="text-xs capitalize">{description}</p>
        </div>
      </div>
      <p className="text-sm font-bold">{temp}{tempUnit}</p>
    </div>
  );
}

interface ForecastViewProps {
  type: 'hourly' | 'daily';
  weatherData: WeatherData;
  units: string;
}

export default function ForecastView({ type, weatherData, units }: ForecastViewProps) {
  const t = useTranslations('Forecast');
  const locale = useLocale();
  const chartConfig = useMemo(() => ({
    temperature: {
      label: t('temperature'),
      color: "var(--chart-1)",
    },
    rain: {
      label: t('rain'),
      color: "var(--chart-2)",
    },
    wind: {
      label: t('wind'),
      color: "var(--chart-4)",
    },
  }), [t]);

  const { preferences, setPreferences } = useViewPreference(
    type, 
    { 
      view: type === 'hourly' ? 'chart' : 'list', 
      displayModes: ['temperature'] 
    }
  );
  const { view, displayModes } = preferences;
  const [isMounted, setIsMounted] = useState(false);
  const [dailyRange, setDailyRange] = useState<DailyRange>(7);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const chartId = useMemo(() => 
    `forecast-${type}-${Date.now()}-${Math.random().toString(36).substr(2, 12)}`, 
    [type]
  );

  const handleViewChange = useCallback((value: string) => {
    if (value && (value === 'chart' || value === 'list')) {
      setPreferences({ view: value as 'chart' | 'list' });
    }
  }, [setPreferences]);

  const handleDisplayModesChange = useCallback((value: string[]) => {
    const newModes = ['temperature', ...value.filter(v => v !== 'temperature')];
    setPreferences({ displayModes: newModes });
  }, [setPreferences]);

  const handleDailyRangeChange = useCallback((value: string) => {
    if (value === '7' || value === '14') {
      setDailyRange(Number(value) as DailyRange);
    }
  }, []);

  const config = useMemo(() => ({
    hourly: {
      title: t('hourlyTitle'),
      tickFormatter: (tick: number) => new Date(tick * 1000).toLocaleTimeString(locale, { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: units === 'imperial'
      }),
    },
    daily: {
      title: t('dailyTitle'),
      tickFormatter: (tick: number) => new Date(tick * 1000).toLocaleDateString(locale, { 
        month: 'short', 
        day: 'numeric' 
      }),
    },
  }), [units, t, locale]);

  const chartData = useMemo(() => {
    if (!weatherData?.hourly?.time || !weatherData?.daily?.time?.[0]) return [];
    const { time, temperature_2m, precipitation_probability, wind_speed_10m } = weatherData.hourly;

    let startIndex;
    if (type === 'hourly') {
      const nowInSeconds = Math.floor(Date.now() / 1000);
      startIndex = time.findIndex(t => t >= nowInSeconds);
    } else {
      const firstDayTimestamp = weatherData.daily.time[0];
      startIndex = time.findIndex(t => t >= firstDayTimestamp);
    }

    if (startIndex === -1) return [];

    const dataSlice = type === 'hourly' ? 24 : dailyRange * 24;

    return time.slice(startIndex, startIndex + dataSlice).map((t, i) => ({
      time: t,
      temperature: temperature_2m[startIndex + i],
      rain: precipitation_probability[startIndex + i],
      wind: wind_speed_10m[startIndex + i],
    }));
  }, [weatherData, type, dailyRange]);

  const hourlyTicks = useMemo(() => {
    if (type !== 'hourly' || !chartData.length) return undefined;
    const ticks = [];
    for (let i = 0; i < chartData.length; i += 6) {
      ticks.push(chartData[i].time);
    }
    return ticks;
  }, [chartData, type]);

  const listData = useMemo(() => {
    if (type === 'daily') {
      return weatherData.daily.time.slice(0, dailyRange).map((t, i) => ({
        time: t,
        temperature_2m_max: weatherData.daily.temperature_2m_max[i],
        temperature_2m_min: weatherData.daily.temperature_2m_min[i],
        weather_code: weatherData.daily.weather_code[i],
      }));
    } else {
      const { hourly, daily } = weatherData;

      if (
        !hourly?.time?.length ||
        !daily?.time?.length ||
        !daily?.sunrise?.length ||
        !daily?.sunset?.length ||
        !hourly?.temperature_2m?.length ||
        !hourly?.weather_code?.length
      ) {
        return [];
      }
      
      const { wind_speed_10m } = hourly;
      
      const now = new Date();
      now.setHours(now.getHours() + 1, 0, 0, 0);
      const nowInSeconds = Math.floor(now.getTime() / 1000);
      const startIndex = hourly.time.findIndex(t => t >= nowInSeconds);

      if (startIndex === -1) {
        return [];
      }

      const result: HourlyDataPoint[] = [];
      for (let i = 0; i < 8; i++) {
        const hourlyIndex = startIndex + (i * 3);

        if (hourlyIndex >= hourly.time.length) {
          break;
        }
        
        const hourTimestamp = hourly.time[hourlyIndex];
        const dayIndex = daily.time.findLastIndex(dayStart => hourTimestamp >= dayStart);

        if (dayIndex === -1) {
          continue;
        }

        const sunrise = daily.sunrise[dayIndex];
        const sunset = daily.sunset[dayIndex];
        const temperature = hourly.temperature_2m[hourlyIndex];
        const weather_code = hourly.weather_code[hourlyIndex];
        const precipitation_probability = hourly.precipitation_probability[hourlyIndex];
        const current_wind_speed = wind_speed_10m[hourlyIndex];
        const visibility = hourly.visibility[hourlyIndex];

        if (sunrise === undefined || sunset === undefined || temperature === undefined || weather_code === undefined || precipitation_probability === undefined || visibility === undefined) {
          continue;
        }

        const calculatedIsDay = (hourTimestamp >= sunrise && hourTimestamp < sunset) ? 1 : 0;

        result.push({
          time: hourTimestamp,
          temperature_2m: temperature,
          weather_code: weather_code,
          is_day: calculatedIsDay,
          precipitation_probability: precipitation_probability,
          wind_speed_10m: current_wind_speed,
          visibility: visibility,
        });
      }
      return result;
    }
  }, [weatherData, type, dailyRange]);

  const tempMetrics = useMemo(() => {
    if (!chartData.length) return { domain: [0, 0], min: 0, max: 0, ticks: [0] };
    const temps = chartData.map(d => d.temperature);
    const min = Math.min(...temps);
    const max = Math.max(...temps);
    const padding = (max - min) * 0.2 || 5;
    const domainMin = Math.floor(min - padding);
    const domainMax = Math.ceil(max + padding);
    
    return {
      domain: [domainMin, domainMax],
      min: Math.round(min),
      max: Math.round(max),
      ticks: [Math.round(min), Math.round(max)]
    };
  }, [chartData]);
  
  const midnightTimestamps = useMemo(() => weatherData.daily.time || [], [weatherData.daily.time]);
  const daySeparators = useMemo(() => {
    if (!chartData.length) return [];

    const chartStart = chartData[0].time;
    const chartEnd = chartData[chartData.length - 1].time;

    return midnightTimestamps.filter((time) => time > chartStart && time < chartEnd);
  }, [chartData, midnightTimestamps]);

  const dailyTicks = useMemo(() => {
    if (type !== 'daily') return undefined;
    return midnightTimestamps
      .slice(1, dailyRange)
      .filter((_, index) => dailyRange === 7 || index % 2 === 0);
  }, [dailyRange, midnightTimestamps, type]);

  const visibleLegendItems = useMemo(() => (
    displayModes
      .filter((mode): mode is keyof typeof chartConfig => mode in chartConfig)
      .map((mode) => chartConfig[mode])
  ), [chartConfig, displayModes]);

  return (
    <Card className="border-border/25 bg-card/55 shadow-none">
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="font-bold text-card-foreground/85">{config[type].title}</h3>
          <div className="flex items-center gap-2">
            {type === 'daily' && (
              <ToggleGroup
                type="single"
                variant="outline"
                size="sm"
                value={String(dailyRange)}
                onValueChange={handleDailyRangeChange}
                aria-label={t('dailyRangeLabel')}
              >
                <ToggleGroupItem value="7" aria-label={t('next7Days')}>
                  {t('sevenDays')}
                </ToggleGroupItem>
                <ToggleGroupItem value="14" aria-label={t('next14Days')}>
                  {t('fourteenDays')}
                </ToggleGroupItem>
              </ToggleGroup>
            )}
            {view === 'chart' && (
              <TooltipProvider>
                <ToggleGroup 
                  type="multiple" 
                  variant="outline" 
                  size="sm" 
                  value={displayModes} 
                  onValueChange={handleDisplayModesChange}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <ToggleGroupItem 
                          value="temperature" 
                          aria-label="Temperature" 
                          disabled 
                          data-chart="temperature"
                        >
                          <Thermometer className="h-4 w-4" />
                        </ToggleGroupItem>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t('tempAlwaysShown')}</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <ToggleGroupItem value="rain" aria-label="Rain" data-chart="rain">
                        <Droplets className="h-4 w-4" />
                      </ToggleGroupItem>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t('toggleRain')}</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <ToggleGroupItem value="wind" aria-label="Wind" data-chart="wind">
                        <Wind className="h-4 w-4" />
                      </ToggleGroupItem>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t('toggleWind')}</p>
                    </TooltipContent>
                  </Tooltip>
                </ToggleGroup>
              </TooltipProvider>
            )}
            <TooltipProvider>
              <ToggleGroup 
                type="single" 
                variant="outline" 
                size="sm" 
                value={view} 
                onValueChange={handleViewChange}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ToggleGroupItem value="chart" aria-label="Chart view">
                      <BarChart className="h-4 w-4" />
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('chartView')}</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ToggleGroupItem value="list" aria-label="List view">
                      <List className="h-4 w-4" />
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('listView')}</p>
                  </TooltipContent>
                </Tooltip>
              </ToggleGroup>
            </TooltipProvider>
          </div>
        </div>
        {view === 'chart' && (
          <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-muted-foreground/70">
            {visibleLegendItems.map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        )}

        <div className="relative h-[165px] w-full">
          {!isMounted ? (
            <Skeleton className="w-full h-full" />
          ) : (
            <>
              {/* Chart View */}
              <div
                className={cn(
                  "absolute inset-0 w-full h-full transition-opacity duration-300",
                  view === 'chart'
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                )}
              >
                {!chartData.length ? <Skeleton className="w-full h-full" /> : (
                  <ChartContainer config={chartConfig} className="w-full h-full">
                    <LineChart
                      data={chartData}
                      margin={{ top: 6, right: 28, left: 4, bottom: 0 }}
                      id={`${chartId}-chart`}
                    >
                      <defs>
                        <linearGradient id={`${chartId}-temperature-gradient`} x1="0" y1="1" x2="0" y2="0">
                          <stop offset="0%" stopColor="var(--chart-1)" />
                          <stop offset="100%" stopColor="var(--chart-3)" />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="time"
                        type="number"
                        domain={['dataMin', 'dataMax']}
                        ticks={type === 'daily' ? dailyTicks : hourlyTicks}
                        tickFormatter={config[type].tickFormatter}
                        tickLine={false}
                        axisLine={false}
                        stroke="var(--muted-foreground)"
                        tick={{ fill: "var(--muted-foreground)", opacity: 0.65 }}
                        fontSize={12}
                      />
                      <YAxis
                        yAxisId="temp"
                        tickLine={false}
                        axisLine={false}
                        stroke="var(--muted-foreground)"
                        tick={{ fill: "var(--muted-foreground)", opacity: 0.65 }}
                        tickFormatter={(value) => `${value}°`}
                        domain={tempMetrics.domain}
                        ticks={tempMetrics.ticks}
                        fontSize={12}
                      />
                      <YAxis yAxisId="rain" hide domain={[0, 105]} />
                      <YAxis yAxisId="wind" hide domain={[0, 'dataMax + 10']} />
                      
                      <RechartsTooltip
                        cursor={true}
                        content={
                          <ChartTooltipContent
                            labelFormatter={(label) => new Date(Number(label) * 1000).toLocaleString(locale, {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: units === 'imperial'
                            })}
                            formatter={(value, name, item) => {
                              let displayValue;

                              if (name === 'temperature') {
                                const [val, unit] = formatTemperature(value as number, units);
                                displayValue = `${val}${unit}`;
                              } else if (name === 'wind') {
                                const [val, unit] = formatWindSpeed(value as number, units);
                                displayValue = `${val} ${unit}`;
                              } else if (name === 'rain') {
                                const val = Math.round(value as number);
                                displayValue = `${val}%`;
                              } else {
                                return null;
                              }

                              const itemConfig = chartConfig[name as keyof typeof chartConfig];

                              return (
                                <div className="flex items-center gap-2 text-xs">
                                  <div
                                    className="w-2.5 h-2.5 rounded-full"
                                    style={{ background: item.color }}
                                  />
                                  <div className="flex flex-1 justify-between gap-2">
                                    <span className="text-muted-foreground">{itemConfig.label}</span>
                                    <span className="font-bold">{displayValue}</span>
                                  </div>
                                </div>
                              )
                            }}
                          />
                        }
                      />

                      {daySeparators.map((time, index) => (
                        <ReferenceLine
                          key={`${chartId}-day-separator-${index}`}
                          x={time}
                          yAxisId="temp"
                          stroke="var(--border)"
                          strokeWidth={1}
                          strokeOpacity={0.24}
                        />
                      ))}
                      {displayModes.includes('temperature') && (
                        <Line
                          yAxisId="temp"
                          type="monotone"
                          dataKey="temperature"
                          stroke={`url(#${chartId}-temperature-gradient)`}
                          dot={false}
                          activeDot={{ r: 5, fill: "var(--chart-1)", stroke: "var(--background)", strokeWidth: 2 }}
                          strokeWidth={2}
                        />
                      )}
                      {displayModes.includes('rain') && (
                        <Line
                          yAxisId="rain"
                          type="monotone"
                          dataKey="rain"
                          stroke="var(--color-rain)"
                          dot={false}
                          activeDot={{ r: 5, fill: "var(--chart-2)", stroke: "var(--background)", strokeWidth: 2 }}
                          strokeWidth={2}
                        />
                      )}
                      {displayModes.includes('wind') && (
                        <Line
                          yAxisId="wind"
                          type="monotone"
                          dataKey="wind"
                          stroke="var(--color-wind)"
                          dot={false}
                          activeDot={{ r: 5, fill: "var(--chart-4)", stroke: "var(--background)", strokeWidth: 2 }}
                          strokeWidth={2}
                        />
                      )}
                    </LineChart>
                  </ChartContainer>
                )}
              </div>

              {/* List View */}
              <div
                className={cn(
                  `absolute inset-0 grid ${type === 'daily' ? 'grid-flow-col auto-cols-[minmax(6.5rem,1fr)] grid-rows-1 overflow-x-auto overflow-y-hidden pb-2' : 'grid-cols-4 md:grid-cols-8 overflow-y-auto'} gap-2 h-full transition-opacity duration-300`,
                  view === 'list'
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                )}
              >
                {type === 'daily'
                  ? (listData as DailyDataPoint[]).map((day, index) => (
                      <DailyForecastItem
                        key={`${day.time}-${index}`}
                        day={day}
                        units={units}
                        chartId={chartId}
                        itemIndex={index}
                        locale={locale}
                      />
                    ))
                  : (listData as HourlyDataPoint[]).map((hour, index) => (
                      <HourlyForecastItem
                        key={`${hour.time}-${index}`}
                        hour={hour}
                        units={units}
                        timezone={weatherData.timezone}
                        chartId={chartId}
                        itemIndex={index}
                        locale={locale}
                      />
                    ))
                }
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
    );
}
