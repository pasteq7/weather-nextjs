import { FC, ComponentType } from 'react';
import dynamic from 'next/dynamic';

interface IconProps {
  className?: string;
  style?: React.CSSProperties;
}

const iconMap: { [key: string]: ComponentType<IconProps> } = {
  '01d': dynamic(() => import('@/public/animated/weather/01d.svg')),
  '01n': dynamic(() => import('@/public/animated/weather/01n.svg')),
  '02d': dynamic(() => import('@/public/animated/weather/02d.svg')),
  '02n': dynamic(() => import('@/public/animated/weather/02n.svg')),
  '03d': dynamic(() => import('@/public/animated/weather/03d.svg')),
  '03n': dynamic(() => import('@/public/animated/weather/03n.svg')),
  '04d': dynamic(() => import('@/public/animated/weather/04d.svg')),
  '04n': dynamic(() => import('@/public/animated/weather/04n.svg')),
  '09d': dynamic(() => import('@/public/animated/weather/09d.svg')),
  '09n': dynamic(() => import('@/public/animated/weather/09n.svg')),
  '10d': dynamic(() => import('@/public/animated/weather/10d.svg')),
  '10n': dynamic(() => import('@/public/animated/weather/10n.svg')),
  '11d': dynamic(() => import('@/public/animated/weather/11d.svg')),
  '11n': dynamic(() => import('@/public/animated/weather/11n.svg')),
  '13d': dynamic(() => import('@/public/animated/weather/13d.svg')),
  '13n': dynamic(() => import('@/public/animated/weather/13n.svg')),
  '50d': dynamic(() => import('@/public/animated/weather/50d.svg')),
  '50n': dynamic(() => import('@/public/animated/weather/50n.svg')),
};

interface CurrentWeatherIconProps {
  iconCode: string;
  className?: string;
}

const CurrentWeatherIcon: FC<CurrentWeatherIconProps> = ({ iconCode, className }) => {
  const IconComponent = iconMap[iconCode] || iconMap['01d']; // Fallback to clear day

  return (
    <div className={className}>
      <IconComponent style={{ width: '100%', height: '100%', color: 'currentColor' }} />
    </div>
  );
};

export default CurrentWeatherIcon;