import type { CSSProperties } from "react";

import { Card, CardContent} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface DataCardProps {
  iconType: string;
  title: string;
  data?: string | number;
  unit?: string;
}

const dataIconPaths: Record<string, string> = {
  humidity: "/data/humidity.svg",
  wind: "/data/wind.svg",
  pressure: "/data/pressure.svg",
  visibility: "/data/visibility.svg",
  sunrise: "/data/sunrise.svg",
  sunset: "/data/sunset.svg",
};

export default function DataCard({ iconType, title, data, unit }: DataCardProps) {
  const iconPath = dataIconPaths[iconType] ?? dataIconPaths.mist;
  const iconStyle = {
    WebkitMaskImage: `url(${iconPath})`,
    maskImage: `url(${iconPath})`,
  } satisfies CSSProperties;

  return (
    <Card className="weather-data-card weather-surface min-h-[3.25rem] min-w-0 flex-row items-center gap-1.5 rounded-lg border-border/25 px-2 py-1.5 shadow-none sm:min-h-[3.5rem] sm:gap-2 sm:px-2.5 sm:py-1.5 min-[72rem]:min-h-[3.15rem] min-[72rem]:px-2.5 min-[72rem]:py-1.5">
      <div className="weather-data-card__icon h-8 w-8 shrink-0 text-card-foreground opacity-90 sm:h-9 sm:w-9 min-[72rem]:h-8 min-[72rem]:w-8">
        <span
          aria-hidden="true"
          className="block h-full w-full bg-current [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] [-webkit-mask-position:center] [-webkit-mask-repeat:no-repeat] [-webkit-mask-size:contain]"
          style={iconStyle}
        />
      </div>
      <CardContent className="flex min-w-0 flex-1 flex-col justify-center p-0">
        <p className="weather-data-card__title truncate text-[0.78rem] font-semibold leading-[1.05] text-muted-foreground/85">{title}</p>
        {data === undefined || data === null ? (
          <Skeleton className="w-3/4 h-6 mt-1" />
        ) : (
          <div className="flex min-w-0 items-baseline gap-0.5 sm:gap-1">
            <p className="weather-data-card__value whitespace-nowrap text-lg font-bold leading-none text-card-foreground sm:text-xl min-[72rem]:text-lg">{data}</p>
            {unit && <p className="weather-data-card__unit whitespace-nowrap text-[0.72rem] font-semibold leading-none text-muted-foreground/85 sm:text-xs">{unit}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
