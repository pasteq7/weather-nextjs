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
    <Card className="h-16 min-w-0 flex-row items-center gap-2 rounded-lg border-border/25 bg-card/45 px-3 py-2.5 shadow-none sm:h-[4.6rem] sm:gap-4 sm:px-4 sm:py-3 lg:h-[3.9rem] lg:px-3 lg:py-2">
      <div className={cn("h-8 w-8 shrink-0 opacity-85 sm:h-10 sm:w-10 lg:h-8 lg:w-8", getDataWeatherIconColor(iconType))}>
        <WeatherIcon type={iconType} />
      </div>
      <CardContent className="min-w-0 flex-grow p-0">
        <p className="truncate text-xs font-medium text-muted-foreground/65">{title}</p>
        {data === undefined || data === null ? (
          <Skeleton className="w-3/4 h-6 mt-1" />
        ) : (
          <div className="flex min-w-0 items-baseline">
            <p className="truncate text-xl font-bold leading-none text-card-foreground sm:text-2xl lg:text-xl">{data}</p>
            {unit && <p className="ml-1 text-xs font-semibold text-muted-foreground/70">{unit}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
