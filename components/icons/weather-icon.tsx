import { FC } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppContext } from '@/app/context/AppContext';
import { dataWeatherIconNames, getMeteocon } from '@/lib/meteocons';

interface WeatherIconProps {
  type: string;
  className?: string;
}

const WeatherIcon: FC<WeatherIconProps> = ({ type, className }) => {
  const { iconStyle } = useAppContext();
  const iconName = dataWeatherIconNames[type];

  if (!iconName) {
    return <Skeleton className={className} />;
  }

  const IconComponent = getMeteocon(iconStyle, iconName);

  return (
    <div className={className}>
      <IconComponent className="h-full w-full" aria-hidden="true" focusable="false" />
    </div>
  );
};

export default WeatherIcon;
