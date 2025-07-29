export const FAVORITES_STORAGE_KEY = 'favoriteLocations';
export const WIND_CONVERSION_FACTOR_KMH = 3.6; // m/s to km/h
export const WIND_CONVERSION_FACTOR_MPH = 2.23694; // m/s to mph
export const WIND_UNIT_KMH = 'km/h';
export const WIND_UNIT_MPH = 'mph';
export const TEMPERATURE_UNIT_CELSIUS = '°C';
export const TEMPERATURE_UNIT_FAHRENHEIT = '°F';

export const WMO_CODES: { [key: number]: { desc: string; icon: string } } = {
  0: { desc: 'Clear sky', icon: '01' },
  1: { desc: 'Mainly clear', icon: '02' },
  2: { desc: 'Partly cloudy', icon: '02' },
  3: { desc: 'Overcast', icon: '04' },
  45: { desc: 'Fog', icon: '50' },
  48: { desc: 'Depositing rime fog', icon: '50' },
  51: { desc: 'Drizzle: Light intensity', icon: '09' },
  53: { desc: 'Drizzle: Moderate intensity', icon: '09' },
  55: { desc: 'Drizzle: Dense intensity', icon: '09' },
  56: { desc: 'Freezing Drizzle: Light intensity', icon: '09' },
  57: { desc: 'Freezing Drizzle: Dense intensity', icon: '09' },
  61: { desc: 'Rain: Slight intensity', icon: '10' },
  63: { desc: 'Rain: Moderate intensity', icon: '10' },
  65: { desc: 'Rain: Heavy intensity', icon: '10' },
  66: { desc: 'Freezing Rain: Light intensity', icon: '13' },
  67: { desc: 'Freezing Rain: Heavy intensity', icon: '13' },
  71: { desc: 'Snow fall: Slight intensity', icon: '13' },
  73: { desc: 'Snow fall: Moderate intensity', icon: '13' },
  75: { desc: 'Snow fall: Heavy intensity', icon: '13' },
  77: { desc: 'Snow grains', icon: '13' },
  80: { desc: 'Rain showers: Slight intensity', icon: '09' },
  81: { desc: 'Rain showers: Moderate intensity', icon: '09' },
  82: { desc: 'Rain showers: Violent intensity', icon: '09' },
  85: { desc: 'Snow showers: Slight intensity', icon: '13' },
  86: { desc: 'Snow showers: Heavy intensity', icon: '13' },
  95: { desc: 'Thunderstorm: Slight or moderate', icon: '11' },
  96: { desc: 'Thunderstorm with slight hail', icon: '11' },
  99: { desc: 'Thunderstorm with heavy hail', icon: '11' },
};