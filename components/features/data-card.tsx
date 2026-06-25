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
    <Card className="h-16 flex-row items-center gap-3 border-border/25 bg-card/45 p-4 shadow-none">
      <div className={cn("h-9 w-9 shrink-0 opacity-75", getDataWeatherIconColor(iconType))}>
        <WeatherIcon type={iconType} />
      </div>
      <CardContent className="p-0 flex-grow">
        <p className="text-xs font-medium text-muted-foreground/65">{title}</p>
        {data === undefined || data === null ? (
          <Skeleton className="w-3/4 h-6 mt-1" />
        ) : (
          <div className="flex items-baseline">
            <p className="text-xl font-bold text-card-foreground">{data}</p>
            {unit && <p className="ml-1 text-xs font-semibold text-muted-foreground/70">{unit}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
