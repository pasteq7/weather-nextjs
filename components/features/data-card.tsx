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
    <Card className="weather-data-card min-h-[3.45rem] min-w-0 flex-row items-center gap-1.5 rounded-lg border-border/25 bg-card/45 px-2 py-1.5 shadow-none sm:min-h-[3.75rem] sm:gap-2 sm:px-2.5 sm:py-2 min-[72rem]:min-h-[3.35rem] min-[72rem]:px-2.5 min-[72rem]:py-1.5">
      <div className={cn("weather-data-card__icon h-8 w-8 shrink-0 opacity-85 sm:h-10 sm:w-10 min-[72rem]:h-9 min-[72rem]:w-9", getDataWeatherIconColor(iconType))}>
        <WeatherIcon type={iconType} className="h-full w-full" />
      </div>
      <CardContent className="flex min-w-0 flex-1 flex-col justify-center p-0">
        <p className="weather-data-card__title truncate text-[0.78rem] font-medium leading-[1.05] text-muted-foreground/65">{title}</p>
        {data === undefined || data === null ? (
          <Skeleton className="w-3/4 h-6 mt-1" />
        ) : (
          <div className="flex min-w-0 items-baseline gap-0.5 sm:gap-1">
            <p className="weather-data-card__value whitespace-nowrap text-lg font-bold leading-none text-card-foreground sm:text-xl min-[72rem]:text-lg">{data}</p>
            {unit && <p className="weather-data-card__unit whitespace-nowrap text-[0.72rem] font-semibold leading-none text-muted-foreground/70 sm:text-xs">{unit}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
