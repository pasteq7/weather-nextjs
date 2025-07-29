import DataCard from "./data-card";
import { WeatherData } from "@/lib/types";
import { 
  formatHumidity, 
  formatPressure, 
  formatVisibility, 
  formatWindSpeed,
  formatTime 
} from "@/lib/utils";

interface WeatherDataGridProps {
  weatherData: WeatherData;
  units: string;
}

export default function WeatherDataGrid({ weatherData, units }: WeatherDataGridProps) {
  const { current, daily, hourly, timezone } = weatherData;

  const humidity = formatHumidity(current.relative_humidity_2m);
  const pressure = formatPressure(current.pressure_msl, units);
  
  // Find the current hour's visibility from the hourly forecast
  const now = new Date();
  const currentHourIndex = hourly.time.findIndex(t => {
    const hourDate = new Date(t * 1000);
    return hourDate.getHours() === now.getHours() && hourDate.getDate() === now.getDate();
  });
  const visibilityValue = currentHourIndex !== -1 ? hourly.visibility[currentHourIndex] : hourly.visibility[0];
  const visibility = formatVisibility(visibilityValue, units);
  
  const sunrise = formatTime(new Date(daily.sunrise[0] * 1000), timezone);
  const sunset = formatTime(new Date(daily.sunset[0] * 1000), timezone);
  const wind = formatWindSpeed(current.wind_speed_10m, units);

  const cardData = [
    { iconType: 'humidity', title: 'Humidity', data: humidity[0], unit: humidity[1] },
    { iconType: 'wind', title: 'Wind Speed', data: wind[0], unit: wind[1] },
    { iconType: 'pressure', title: 'Pressure', data: pressure[0], unit: pressure[1] },
    { iconType: 'visibility', title: 'Visibility', data: visibility[0], unit: visibility[1] },
    { iconType: 'sunrise', title: 'Sunrise', data: sunrise },
    { iconType: 'sunset', title: 'Sunset', data: sunset },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {cardData.map((card) => (
        <DataCard key={card.title} {...card} />
      ))}
    </div>
  );
}