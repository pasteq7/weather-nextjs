import { Card, CardContent} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import WeatherIcon from "@/components/icons/weather-icon";
import { cn } from "@/lib/utils";
import { getDataWeatherIconColor } from "@/lib/weather-icon-colors";

interface DataCardProps {
  iconType: string;
  title: string;
  data?: string | number;
  unit?: string;
}

export default function DataCard({ iconType, title, data, unit }: DataCardProps) {
  return (
    <Card className="flex-row items-center p-4 h-16">
      <div className={cn("w-12 h-12 mr-4", getDataWeatherIconColor(iconType))}>
        <WeatherIcon type={iconType} />
      </div>
      <CardContent className="p-0 flex-grow">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {data === undefined || data === null ? (
          <Skeleton className="w-3/4 h-6 mt-1" />
        ) : (
          <div className="flex items-baseline">
            <p className="text-lg font-bold text-card-foreground">{data}</p>
            {unit && <p className="text-sm text-muted-foreground ml-1">{unit}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
