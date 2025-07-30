// components\features\forecast-view.tsx
'use client';

import { useState, useMemo, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { LineChart, Line, XAxis, YAxis, ReferenceLine, Tooltip as RechartsTooltip } from 'recharts';
import { BarChart, List, Thermometer, Wind, Droplets } from 'lucide-react';
import { formatTemperature, mapWmoToWeather, formatWindSpeed, cn } from '@/lib/utils';
import { WeatherData, DailyDataPoint, HourlyDataPoint } from '@/lib/types';
import CurrentWeatherIcon from '../icons/current-weather-icon';
import { Skeleton } from '../ui/skeleton';
import { ChartContainer, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

function DailyForecastItem({ day, units, chartId }: { day: DailyDataPoint; units: string; chartId: string }) {
  const [maxTemp, maxTempUnit] = formatTemperature(day.temperature_2m_max, units);
  const [minTemp] = formatTemperature(day.temperature_2m_min, units);
  // Daily forecast always uses a day icon
  const { icon, description } = mapWmoToWeather(day.weather_code, 1);
  const date = new Date(day.time * 1000);
  const dayLabel = date.toLocaleDateString(undefined, { weekday: 'long' });

  return (
    <div className="flex flex-col items-center justify-center text-center gap-1 p-2">
      <p className="font-semibold text-sm">{dayLabel}</p>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            {/* Force SVG isolation with key prop and unique container */}
            <div key={`${chartId}-daily-${day.time}`} className="weather-icon-container">
              <CurrentWeatherIcon iconCode={icon} className="w-16 h-16" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="capitalize">{description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div className="text-sm">
        <span className="font-bold">{maxTemp}{maxTempUnit}</span>
        <span className="text-muted-foreground"> / {minTemp}{maxTempUnit}</span>
      </div>
    </div>
  );
}

function HourlyForecastItem({ hour, units, timezone, chartId }: { hour: HourlyDataPoint; units: string; timezone: string; chartId: string; }) {
    const [temp, tempUnit] = formatTemperature(hour.temperature, units);
    const { icon, description } = mapWmoToWeather(hour.weather_code, hour.is_day);
    const timeLabel = new Date(hour.time * 1000).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false, 
      timeZone: timezone 
    });

    return (
        <div className="flex flex-col items-center justify-center text-center gap-1 p-2">
            <p className="font-semibold text-sm">{timeLabel}</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                    {/* Force SVG isolation with key prop and unique container */}
                    <div key={`${chartId}-hourly-${hour.time}`} className="weather-icon-container">
                        <CurrentWeatherIcon iconCode={icon} className="w-16 h-16" />
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="capitalize">{description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <p className="text-sm font-bold">{temp}{tempUnit}</p>
        </div>
    );
}

const chartConfig = {
  temperature: {
    label: "Temperature",
    color: "var(--muted-foreground)",
  },
  rain: {
    label: "Rain",
    color: "var(--chart-2)",
  },
  wind: {
    label: "Wind",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

interface ForecastViewProps {
  type: 'hourly' | 'daily';
  weatherData: WeatherData;
  units: string;
}

export default function ForecastView({ type, weatherData, units }: ForecastViewProps) {
  const [view, setView] = useState<'chart' | 'list'>('chart');
  const [displayModes, setDisplayModes] = useState<string[]>(['temperature']);

  // Generate unique ID for this component instance to prevent SVG conflicts
  const chartId = useMemo(() => `forecast-${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, [type]);

  // Prevent any form submissions or default behaviors
  const handleViewChange = useCallback((value: string) => {
    if (value && (value === 'chart' || value === 'list')) {
      setView(value);
    }
  }, []);

  const handleDisplayModesChange = useCallback((value: string[]) => {
    setDisplayModes(value.length > 0 ? value : ['temperature']);
  }, []);

  const config = useMemo(() => ({
    hourly: {
      title: 'Next 24 Hours',
      tickFormatter: (tick: number) => new Date(tick * 1000).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false 
      }),
    },
    daily: {
      title: 'Next 4 Days',
      tickFormatter: (tick: number) => new Date(tick * 1000).toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric' 
      }),
    },
  }), []);

  const chartData = useMemo(() => {
    if (!weatherData?.hourly?.time || !weatherData?.daily?.time?.[0]) return [];
    const { time, temperature_2m, precipitation_probability, wind_speed_10m } = weatherData.hourly;

    let startIndex;
    if (type === 'hourly') {
      const nowInSeconds = Math.floor(Date.now() / 1000);
      startIndex = time.findIndex(t => t >= nowInSeconds);
    } else { // daily
      const firstDayTimestamp = weatherData.daily.time[0];
      startIndex = time.findIndex(t => t >= firstDayTimestamp);
    }

    if (startIndex === -1) return [];

    const dataSlice = type === 'hourly' ? 24 : 96;

    return time.slice(startIndex, startIndex + dataSlice).map((t, i) => ({
      time: t,
      temperature: temperature_2m[startIndex + i],
      rain: precipitation_probability[startIndex + i],
      wind: wind_speed_10m[startIndex + i],
    }));
  }, [weatherData, type]);

  const hourlyTicks = useMemo(() => {
    if (type !== 'hourly' || !chartData.length) return undefined;
    const ticks = [];
    // Add a tick every 6 hours for a cleaner look
    for (let i = 0; i < chartData.length; i += 6) {
        ticks.push(chartData[i].time);
    }
    return ticks;
  }, [chartData, type]);

  const listData = useMemo(() => {
    if (type === 'daily') {
      return weatherData.daily.time.slice(0, 5).map((t, i) => ({
        time: t,
        temperature_2m_max: weatherData.daily.temperature_2m_max[i],
        temperature_2m_min: weatherData.daily.temperature_2m_min[i],
        weather_code: weatherData.daily.weather_code[i],
      }));
    } else { // hourly
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

            if (sunrise === undefined || sunset === undefined || temperature === undefined || weather_code === undefined) {
                continue;
            }

            const calculatedIsDay = (hourTimestamp >= sunrise && hourTimestamp < sunset) ? 1 : 0;

            result.push({
                time: hourTimestamp,
                temperature: temperature,
                weather_code: weather_code,
                is_day: calculatedIsDay,
            });
        }
        return result;
    }
  }, [weatherData, type]);

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
  
  const midnightTimestamps = weatherData.daily.time || [];

  return (
    <Card>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-muted-foreground">{config[type].title}</h3>
          <div className="flex items-center gap-2">
            {view === 'chart' && (
              <ToggleGroup 
                type="multiple" 
                variant="outline" 
                size="sm" 
                value={displayModes} 
                onValueChange={handleDisplayModesChange}
              >
                <TooltipProvider>
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
                    <TooltipContent><p>Temperature (Always Shown)</p></TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <ToggleGroupItem value="rain" aria-label="Rain" data-chart="rain">
                        <Droplets className="h-4 w-4" />
                      </ToggleGroupItem>
                    </TooltipTrigger>
                    <TooltipContent><p>Toggle Rain Probability</p></TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <ToggleGroupItem value="wind" aria-label="Wind" data-chart="wind">
                        <Wind className="h-4 w-4" />
                      </ToggleGroupItem>
                    </TooltipTrigger>
                    <TooltipContent><p>Toggle Wind Speed</p></TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </ToggleGroup>
            )}
            <ToggleGroup 
              type="single" 
              variant="outline" 
              size="sm" 
              value={view} 
              onValueChange={handleViewChange}
            >
              <ToggleGroupItem value="chart" aria-label="Chart view">
                <BarChart className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="list" aria-label="List view">
                <List className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
        
        {/* Render both views but hide one with CSS to prevent re-mounting and ensure icons are pre-loaded */}
        <div className="relative h-[150px] w-full">
          {/* Chart View with SVG isolation */}
          <div className={cn("w-full h-full svg-isolated-chart", { 'hidden': view !== 'chart' })}>
            {!chartData.length ? <Skeleton className="w-full h-full" /> : (
              <ChartContainer config={chartConfig} className="w-full h-full">
                <LineChart 
                  data={chartData} 
                  margin={{ top: 5, right: 20, left: -20, bottom: 0 }}
                  id={`${chartId}-chart`} // Unique ID for the chart
                >
                  <XAxis
                    dataKey="time"
                    type="number"
                    domain={['dataMin', 'dataMax']}
                    ticks={type === 'daily' ? midnightTimestamps.slice(1, -1) : hourlyTicks}
                    tickFormatter={config[type].tickFormatter}
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                  />
                  <YAxis
                    yAxisId="temp"
                    tickLine={true}
                    axisLine={true}
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
                        labelFormatter={(label) => new Date(Number(label) * 1000).toLocaleString(undefined, {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false
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

                  {midnightTimestamps.map((time, index) => (
                    <ReferenceLine
                      key={`${chartId}-ref-${index}`}
                      x={time}
                      yAxisId="temp"
                      stroke="hsl(var(--muted-foreground))"
                      strokeWidth={1}
                      strokeDasharray="4 4"
                    />
                  ))}
                  <ReferenceLine
                    y={tempMetrics.max}
                    yAxisId="temp"
                    stroke="hsl(var(--chart-1))"
                    strokeDasharray="2 10"
                    strokeOpacity={0.7}
                  />
                  <ReferenceLine
                    y={tempMetrics.min}
                    yAxisId="temp"
                    stroke="hsl(var(--chart-3))"
                    strokeDasharray="2 10"
                    strokeOpacity={0.7}
                  />

                  {displayModes.includes('temperature') && (
                    <Line
                      yAxisId="temp"
                      type="monotone"
                      dataKey="temperature"
                      stroke="var(--color-temperature)"
                      dot={false}
                      activeDot={{ r: 6 }}
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
                      activeDot={{ r: 6 }}
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
                      activeDot={{ r: 6 }}
                      strokeWidth={2}
                    />
                  )}
                </LineChart>
              </ChartContainer>
            )}
          </div>

          {/* List View with SVG isolation - force remount with key */}
          {view === 'list' && (
            <div key={`${chartId}-list-${view}`} className={cn(`grid ${type === 'daily' ? 'grid-cols-3 sm:grid-cols-5' : 'grid-cols-4 md:grid-cols-8'} gap-2 h-[150px] overflow-y-auto svg-isolated-list`)}>
              {type === 'daily'
                ? (listData as DailyDataPoint[]).map((day) => (
                    <DailyForecastItem key={day.time} day={day} units={units} chartId={chartId} />
                  ))
                : (listData as HourlyDataPoint[]).map((hour) => (
                    <HourlyForecastItem
                      key={hour.time}
                      hour={hour}
                      units={units}
                      timezone={weatherData.timezone}
                      chartId={chartId}
                    />
                  ))
              }
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}