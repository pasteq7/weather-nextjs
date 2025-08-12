export const FAVORITES_STORAGE_KEY = 'favoriteLocations';
export const WIND_CONVERSION_FACTOR_KMH = 3.6; // m/s to km/h
export const WIND_CONVERSION_FACTOR_MPH = 2.23694; // m/s to mph
export const WIND_UNIT_KMH = 'km/h';
export const WIND_UNIT_MPH = 'mph';
export const TEMPERATURE_UNIT_CELSIUS = '°C';
export const TEMPERATURE_UNIT_FAHRENHEIT = '°F';

export const WMO_CODES: { [key: number]: { icon: string } } = {
  0: { icon: '01' },
  1: { icon: '01' },
  2: { icon: '02' },
  3: { icon: '04' },
  45: { icon: '50' },
  48: { icon: '50' },
  51: { icon: '09' },
  53: { icon: '09' },
  55: { icon: '09' },
  56: { icon: '09' },
  57: { icon: '09' },
  61: { icon: '10' },
  63: { icon: '10' },
  65: { icon: '10' },
  66: { icon: '13' },
  67: { icon: '13' },
  71: { icon: '13' },
  73: { icon: '13' },
  75: { icon: '13' },
  77: { icon: '13' },
  80: { icon: '09' },
  81: { icon: '09' },
  82: { icon: '09' },
  85: { icon: '13' },
  86: { icon: '13' },
  95: { icon: '11' },
  96: { icon: '11' },
  99: { icon: '11' },
};