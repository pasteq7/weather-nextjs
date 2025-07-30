// C:\Dev\weather-v2\components\icons\current-weather-icon.tsx

import { FC, ComponentType } from 'react';
// REMOVE: import dynamic from 'next/dynamic'; // No longer needed

// --- START: New Imports ---
// Import all the icons directly at the top of the file.
import Icon01d from '@/public/animated/weather/01d.svg';
import Icon01n from '@/public/animated/weather/01n.svg';
import Icon02d from '@/public/animated/weather/02d.svg';
import Icon02n from '@/public/animated/weather/02n.svg';
import Icon03d from '@/public/animated/weather/03d.svg';
import Icon03n from '@/public/animated/weather/03n.svg';
import Icon04d from '@/public/animated/weather/04d.svg';
import Icon04n from '@/public/animated/weather/04n.svg';
import Icon09d from '@/public/animated/weather/09d.svg';
import Icon09n from '@/public/animated/weather/09n.svg';
import Icon10d from '@/public/animated/weather/10d.svg';
import Icon10n from '@/public/animated/weather/10n.svg';
import Icon11d from '@/public/animated/weather/11d.svg';
import Icon11n from '@/public/animated/weather/11n.svg';
import Icon13d from '@/public/animated/weather/13d.svg';
import Icon13n from '@/public/animated/weather/13n.svg';
import Icon50d from '@/public/animated/weather/50d.svg';
import Icon50n from '@/public/animated/weather/50n.svg';
// --- END: New Imports ---


interface IconProps {
  className?: string;
  style?: React.CSSProperties;
}

// --- START: Modified iconMap ---
// Replace the dynamic imports with direct references to the imported components.
const iconMap: { [key: string]: ComponentType<IconProps> } = {
  '01d': Icon01d,
  '01n': Icon01n,
  '02d': Icon02d,
  '02n': Icon02n,
  '03d': Icon03d,
  '03n': Icon03n,
  '04d': Icon04d,
  '04n': Icon04n,
  '09d': Icon09d,
  '09n': Icon09n,
  '10d': Icon10d,
  '10n': Icon10n,
  '11d': Icon11d,
  '11n': Icon11n,
  '13d': Icon13d,
  '13n': Icon13n,
  '50d': Icon50d,
  '50n': Icon50n,
};
// --- END: Modified iconMap ---

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