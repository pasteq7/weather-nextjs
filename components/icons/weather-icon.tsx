import { FC, ComponentType } from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

interface IconProps {
  className?: string;
  style?: React.CSSProperties;
}

const iconMap: { [key: string]: ComponentType<IconProps> } = {
  humidity: dynamic(() => import('@/public/animated/humidity.svg')),
  pressure: dynamic(() => import('@/public/animated/pressure.svg')),
  sunrise: dynamic(() => import('@/public/animated/sunrise.svg')),
  sunset: dynamic(() => import('@/public/animated/sunset.svg')),
  visibility: dynamic(() => import('@/public/animated/visibility.svg')),
  wind: dynamic(() => import('@/public/animated/wind-speed.svg')),
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