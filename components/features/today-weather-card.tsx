'use client';

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import CurrentWeatherIcon from "@/components/icons/current-weather-icon";
import { formatTemperature, mapWmoToWeather } from "@/lib/utils";
import { WeatherData } from "@/lib/types";

interface TodayWeatherCardProps {
  weatherData: WeatherData;
  units: string;
}

export default function TodayWeatherCard({ weatherData, units }: TodayWeatherCardProps) {
  const [formattedTime, setFormattedTime] = useState('');

  useEffect(() => {
    // This effect will now re-run whenever the `weatherData` prop changes,
    // ensuring the timestamp is updated on new fetches.
    const time = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: units === 'imperial',
      timeZone: weatherData?.timezone,
    });
    setFormattedTime(time);
  }, [weatherData, units]); // Add weatherData and units to the dependency array

  if (!weatherData) {
    return (
      <Card className="flex flex-col items-center justify-center p-2 flex-grow">
        <Skeleton className="w-32 h-32 rounded-full" />
        <Skeleton className="w-3/4 h-10 mt-4" />
        <Skeleton className="w-1/2 h-6 mt-2" />
        <Skeleton className="w-1/3 h-4 mt-2" />
      </Card>
    );
  }

  const { current } = weatherData;
  const { description, icon } = mapWmoToWeather(current.weather_code, current.is_day);
  const [temp, tempUnit] = formatTemperature(current.temperature_2m, units);

  return (
    <Card className="flex flex-col items-center justify-between p-2 flex-grow">
      <div className="w-40 h-40">
        <CurrentWeatherIcon iconCode={icon} />
      </div>
      <div className="text-center">
        <p className="text-5xl mb-2">
          {temp}
          <span className="text-2xl text-muted-foreground align-top">{tempUnit}</span>
        </p>
        <p className="text-lg text-muted-foreground capitalize mb-1">
          {description}
        </p>
        <p className="text-xs text-muted-foreground/50 mb-2">
          {/* Display the time from the state, which is now correctly updated */}
          Last updated: {formattedTime}
        </p>
      </div>
    </Card>
  );
}