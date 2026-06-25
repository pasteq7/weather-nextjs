import { FC, ComponentType } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import HumidityIcon from '@/assets/animated/humidity.svg';
import PressureIcon from '@/assets/animated/pressure.svg';
import SunriseIcon from '@/assets/animated/sunrise.svg';
import SunsetIcon from '@/assets/animated/sunset.svg';
import VisibilityIcon from '@/assets/animated/visibility.svg';
import WindIcon from '@/assets/animated/wind-speed.svg';

interface IconProps {
  className?: string;
  style?: React.CSSProperties;
}

const iconMap: { [key: string]: ComponentType<IconProps> } = {
  humidity: HumidityIcon,
  pressure: PressureIcon,
  sunrise: SunriseIcon,
  sunset: SunsetIcon,
  visibility: VisibilityIcon,
  wind: WindIcon,
};

interface WeatherIconProps {
  type: string;
  className?: string;
}

const WeatherIcon: FC<WeatherIconProps> = ({ type, className }) => {
  const IconComponent = iconMap[type];

  if (!IconComponent) {
    return <Skeleton className={className} />;
  }

  return (
    <div className={className}>
      <IconComponent style={{ width: '100%', height: '100%', color: 'currentColor' }} />
    </div>
  );
};

export default WeatherIcon;
