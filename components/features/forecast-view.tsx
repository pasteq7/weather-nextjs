// C:\Dev\weather-v2\components\features\forecast-view.tsx

'use client';

import { useState, useMemo, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip as ChartTooltip, ReferenceLine } from 'recharts';
import { BarChart, List, Thermometer, Wind, Droplets } from 'lucide-react';
import { formatTemperature, mapWmoToWeather, formatWindSpeed } from '@/lib/utils';
import { WeatherData, DailyDataPoint, HourlyDataPoint } from '@/lib/types';
import CurrentWeatherIcon from '../icons/current-weather-icon';
import { Skeleton } from '../ui/skeleton';

// --- (Sub-components for List View and CustomTooltipContent remain the same) ---

function DailyForecastItem({ day, units }: { day: DailyDataPoint; units: string }) {
  const [maxTemp, maxTempUnit] = formatTemperature(day.temperature_2m_max, units);
  const [minTemp] = formatTemperature(day.temperature_2m_min, units);
  // Daily forecast always uses a day icon
  const { icon, description } = mapWmoToWeather(day.weather_code, 1);
  const date = new Date(day.time * 1000);
  const dayLabel = date.toLocaleDateString(undefined, { weekday: 'long' });

  return (
    <div className="flex flex-col items-center justify-center text-center gap-1 p-2">
      <p className="font-semibold text-sm">{dayLabel}</p>
      <TooltipProvider><Tooltip><TooltipTrigger>
        <CurrentWeatherIcon iconCode={icon} className="w-16 h-16" />
      </TooltipTrigger><TooltipContent><p className="capitalize">{description}</p></TooltipContent></Tooltip></TooltipProvider>
      <div className="text-sm">
        <span className="font-bold">{maxTemp}{maxTempUnit}</span>
        <span className="text-muted-foreground"> / {minTemp}{maxTempUnit}</span>
      </div>
    </div>
  );
}

function HourlyForecastItem({ hour, units, timezone }: { hour: HourlyDataPoint; units: string; timezone: string; }) {
    const [temp, tempUnit] = formatTemperature(hour.temperature, units);
    const { icon, description } = mapWmoToWeather(hour.weather_code, hour.is_day);
    const timeLabel = new Date(hour.time * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: timezone });

    return (
        <div className="flex flex-col items-center justify-center text-center gap-1 p-2">
            <p className="font-semibold text-sm">{timeLabel}</p>
            <TooltipProvider><Tooltip><TooltipTrigger>
                <CurrentWeatherIcon iconCode={icon} className="w-16 h-16" />
            </TooltipTrigger><TooltipContent><p className="capitalize">{description}</p></TooltipContent></Tooltip></TooltipProvider>
            <p className="text-sm font-bold">{temp}{tempUnit}</p>
        </div>
    );
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    color: string;
    dataKey: string;
    value: number;
  }>;
  label?: number;
  units: string;
}

const CustomTooltipContent = ({ active, payload, label, units }: CustomTooltipProps) => {
  if (active && payload && payload.length && label !== undefined) {
    const date = new Date(label * 1000);
  const formattedLabel = date.toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
    return (
      <div className="p-2 bg-background/80 backdrop-blur-sm border border-border rounded-lg shadow-lg">
        <p className="label text-sm font-bold text-foreground">{formattedLabel}</p>
        {payload.map((pld) => {
          let value, unit;
          if (pld.value === undefined) return null;

          if (pld.dataKey === 'temperature') {
            [value, unit] = formatTemperature(pld.value, units);
          } else if (pld.dataKey === 'wind') {
            [value, unit] = formatWindSpeed(pld.value, units);
          } else if (pld.dataKey === 'rain') {
            value = Math.round(pld.value);
            unit = '%';
          }
          return (
            <p key={pld.dataKey} style={{ color: pld.color }} className="text-xs capitalize">
              {`${pld.dataKey}: ${value}${unit}`}
            </p>
          );
        })}
      </div>
    );
  }
  return null;
};


interface ForecastViewProps {
  type: 'hourly' | 'daily';
  weatherData: WeatherData;
  units: string;
}

export default function ForecastView({ type, weatherData, units }: ForecastViewProps) {
  const [view, setView] = useState('chart');
  const [displayModes, setDisplayModes] = useState(['temperature']);
  const { theme } = useTheme();
  const [chartColors, setChartColors] = useState<{ [key: string]: string } | null>(null);

  // Effect to get computed CSS variables for chart colors
  useEffect(() => {
    const rootStyle = getComputedStyle(document.documentElement);
    const getColor = (cssVar: string) => rootStyle.getPropertyValue(cssVar).trim();

    setChartColors({
      primary: getColor('--color-primary'),
      mutedForeground: getColor('--color-muted-foreground'),
      border: getColor('--color-border'),
      chart1: getColor('--color-chart-1'),
      chart2: getColor('--color-chart-2'),
      chart3: getColor('--color-chart-3'),
      chart4: getColor('--color-chart-4'),
      chart5: getColor('--color-chart-5'),
    });
  }, [theme]); // Rerun when theme changes

  const config = useMemo(() => ({
    hourly: {
      title: 'Next 24 Hours',
      tickFormatter: (tick: number) => new Date(tick * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
    },
    daily: {
      title: 'Next 5 Days',
      tickFormatter: (tick: number) => new Date(tick * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    },
  }), []);

  const chartData = useMemo(() => {
    if (!weatherData?.hourly?.time) return [];
    const { time, temperature_2m, precipitation_probability, wind_speed_10m } = weatherData.hourly;
    const nowInSeconds = Math.floor(Date.now() / 1000);
    const startIndex = time.findIndex(t => t >= nowInSeconds);
    const dataSlice = type === 'hourly' ? 24 : 96;
    
    return time.slice(startIndex, startIndex + dataSlice).map((t, i) => ({
      time: t,
      temperature: temperature_2m[startIndex + i],
      rain: precipitation_probability[startIndex + i],
      wind: wind_speed_10m[startIndex + i],
    }));
  }, [weatherData, type]);

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

        // Guard against missing or empty data arrays that are essential
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
        
        const nowInSeconds = Math.floor(Date.now() / 1000);
        const startIndex = hourly.time.findIndex(t => t >= nowInSeconds);

        if (startIndex === -1) {
            return [];
        }

        const result: HourlyDataPoint[] = [];
        for (let i = 0; i < 8; i++) {
            const hourlyIndex = startIndex + (i * 3);

            // Ensure the index is within the bounds of the hourly arrays
            if (hourlyIndex >= hourly.time.length) {
                break;
            }
            
            const hourTimestamp = hourly.time[hourlyIndex];

            // Find the corresponding day for this hour to get sunrise/sunset
            const dayIndex = daily.time.findLastIndex(dayStart => hourTimestamp >= dayStart);

            // If we can't find a corresponding day, we can't determine if it's day or night.
            // It's safer to skip this data point than to guess.
            if (dayIndex === -1) {
                continue;
            }

            const sunrise = daily.sunrise[dayIndex];
            const sunset = daily.sunset[dayIndex];
            
            // Also ensure the data for the specific hour is valid
            const temperature = hourly.temperature_2m[hourlyIndex];
            const weather_code = hourly.weather_code[hourlyIndex];

            // If any required data for this point is missing, skip it
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
    if (!chartData.length) return { domain: [0, 0], min: 0, max: 0 };
    const temps = chartData.map(d => d.temperature);
    const min = Math.min(...temps);
    const max = Math.max(...temps);
    const padding = (max - min) * 0.2 || 5;
    return {
        domain: [Math.floor(min - padding), Math.ceil(max + padding)],
        min: Math.round(min),
        max: Math.round(max)
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
              <ToggleGroup type="multiple" variant="outline" size="sm" value={displayModes} onValueChange={(value) => setDisplayModes(value.length > 0 ? value : ['temperature'])}>
                <TooltipProvider>
                  <Tooltip><TooltipTrigger asChild><ToggleGroupItem value="temperature" aria-label="Temperature" disabled><Thermometer className="h-4 w-4" /></ToggleGroupItem></TooltipTrigger><TooltipContent><p>Temperature (Always Shown)</p></TooltipContent></Tooltip>
                  <Tooltip><TooltipTrigger asChild><ToggleGroupItem value="rain" aria-label="Rain"><Droplets className="h-4 w-4" /></ToggleGroupItem></TooltipTrigger><TooltipContent><p>Toggle Rain Probability</p></TooltipContent></Tooltip>
                  <Tooltip><TooltipTrigger asChild><ToggleGroupItem value="wind" aria-label="Wind"><Wind className="h-4 w-4" /></ToggleGroupItem></TooltipTrigger><TooltipContent><p>Toggle Wind Speed</p></TooltipContent></Tooltip>
                </TooltipProvider>
              </ToggleGroup>
            )}
            <ToggleGroup type="single" variant="outline" size="sm" value={view} onValueChange={(value) => value && setView(value)}>
              <ToggleGroupItem value="chart" aria-label="Chart view"><BarChart className="h-4 w-4" /></ToggleGroupItem>
              <ToggleGroupItem value="list" aria-label="List view"><List className="h-4 w-4" /></ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
        
        {view === 'chart' ? (
          <div className="h-[150px] w-full">
            {!chartColors ? <Skeleton className="w-full h-full" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                  <XAxis dataKey="time" ticks={type === 'daily' ? midnightTimestamps : undefined} tickFormatter={config[type].tickFormatter} stroke={chartColors.mutedForeground} fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="temp" stroke={chartColors.mutedForeground} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}°`} domain={tempMetrics.domain} />
                  <YAxis yAxisId="rain" hide domain={[0, 105]} /><YAxis yAxisId="wind" hide domain={[0, 'dataMax + 10']} />
                  
                  <ChartTooltip content={<CustomTooltipContent units={units} />} />

                  {midnightTimestamps.map((time, index) => <ReferenceLine key={index} x={time} yAxisId="temp" stroke={chartColors.border} strokeDasharray="3 3" />)}
                  <ReferenceLine y={tempMetrics.max} yAxisId="temp" stroke={chartColors.chart1} strokeDasharray="2 10" strokeOpacity={0.7} />
                  <ReferenceLine y={tempMetrics.min} yAxisId="temp" stroke={chartColors.chart3} strokeDasharray="2 10" strokeOpacity={0.7} />

                  {displayModes.includes('temperature') && <Line yAxisId="temp" type="monotone" dataKey="temperature" stroke={chartColors.mutedForeground} dot={false} activeDot={{ r: 6 }} strokeWidth={2} />}
                  {displayModes.includes('rain') && <Line yAxisId="rain" type="monotone" dataKey="rain" stroke={chartColors.chart2} dot={false} activeDot={{ r: 6 }} strokeWidth={2} />}
                  {displayModes.includes('wind') && <Line yAxisId="wind" type="monotone" dataKey="wind" stroke={chartColors.chart4} dot={false} activeDot={{ r: 6 }} strokeWidth={2} />}
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        ) : (
          <div className={`grid ${type === 'daily' ? 'grid-cols-3 sm:grid-cols-5' : 'grid-cols-4 md:grid-cols-8'} gap-2 h-[150px] overflow-y-auto`}>
            {type === 'daily' 
              ? (listData as DailyDataPoint[]).map((day) => <DailyForecastItem key={day.time} day={day} units={units} />)
              : (listData as HourlyDataPoint[]).map((hour) => <HourlyForecastItem key={hour.time} hour={hour} units={units} timezone={weatherData.timezone} />)
            }
          </div>
        )}
      </CardContent>
    </Card>
  );
}