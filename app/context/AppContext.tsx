// app/context/AppContext.tsx
'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback, useRef } from 'react';
import { WeatherData, ApiIssueKey } from '@/lib/types';
import { fetchWeatherByCity, fetchWeatherData, getCityNameFromCoordinates } from '@/lib/api';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

export type ApiStatusValue = 'operational' | 'partial' | 'outage' | 'pending';

export interface ApiStatus {
  status: ApiStatusValue;
  issues?: ApiIssueKey[];
}

interface ApiStatuses {
  openMeteo: ApiStatus;
  reverseGeo: ApiStatus;
  geolocation: ApiStatus;
}

interface Location {
  lat: number | null;
  lon: number | null;
  name: string | null;
}

interface AppContextType {
  location: Location;
  units: 'metric' | 'imperial';
  weatherData: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  isInitializing: boolean;
  apiStatus: ApiStatuses;
  setUnits: (units: 'metric' | 'imperial') => void;
  setLocationByName: (name: string) => void;
  setLocationByCoords: (lat: number, lon: number) => void;
  refreshData: () => void;
  finishInitialization: () => void;
  setApiStatus: (service: keyof ApiStatuses, status: ApiStatus) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const t = useTranslations();
  const [location, setLocation] = useState<Location>({ lat: null, lon: null, name: null });
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [apiStatus, setApiStatusState] = useState<ApiStatuses>({
    openMeteo: { status: 'operational' },
    reverseGeo: { status: 'operational' },
    geolocation: { status: 'pending' }, // <-- FIX: Initial state is now 'pending'
  });
  
  const hasInitializedRef = useRef(false);
  const isFirstRender = useRef(true);

  const setApiStatus = useCallback((service: keyof ApiStatuses, status: ApiStatus) => {
    setApiStatusState(prev => ({ ...prev, [service]: status }));
  }, []);

  const finishInitialization = useCallback(() => {
    setIsInitializing(false);
    hasInitializedRef.current = true;
  }, []);

  const shouldAutoGeolocate = isInitializing && !hasInitializedRef.current && isFirstRender.current && !location.name && (!location.lat || !location.lon);

  useEffect(() => {
    isFirstRender.current = false;
  }, []);

  const fetchAndSetWeather = useCallback(async (currentLocation: Location, currentUnits: 'metric' | 'imperial') => {
    if (!currentLocation.name && (!currentLocation.lat || !currentLocation.lon)) {
      setIsLoading(false);
      setError(null);
      setWeatherData(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const clientTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'auto';
      let data: WeatherData;
      let name = currentLocation.name;
      let lat = currentLocation.lat;
      let lon = currentLocation.lon;

      if (lat && lon) {
        data = await fetchWeatherData(lat, lon, currentUnits, clientTimezone);
        
        if (!name) {
          const geoResult = await getCityNameFromCoordinates(lat, lon);
          setApiStatus('reverseGeo', { status: geoResult.ok ? 'operational' : 'outage' });
          name = geoResult.name || t('Weather.currentLocation');
        }
      } else if (name) {
        const result = await fetchWeatherByCity(name, currentUnits, clientTimezone);
        data = result;
        name = result.name || name;
        lat = result.latitude;
        lon = result.longitude;
      } else {
        throw new Error('No valid location data');
      }
      
      const completeWeatherData = { ...data, name, latitude: lat ?? undefined, longitude: lon ?? undefined };
      setWeatherData(completeWeatherData);

      setApiStatus('openMeteo', { status: 'operational' });

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'ERROR_UNKNOWN';
      if (errorMessage.startsWith('ERROR_')) {
        setApiStatus('openMeteo', { status: 'outage' });
      }
      
      console.error('Weather fetch error:', e);
      const translatedError = errorMessage.startsWith('ERROR_')
        ? t(`Errors.${errorMessage as 'ERROR_CITY_NOT_FOUND'}`)
        : t('Errors.ERROR_UNKNOWN') || 'Failed to fetch weather data';
      
      setError(translatedError);
      toast.error(translatedError);
      setWeatherData(null);
    } finally {
      setIsLoading(false);
    }
  }, [t, setApiStatus]);

  useEffect(() => {
    if (location.name || (location.lat && location.lon)) {
      fetchAndSetWeather(location, units);
    }
  }, [location, units, fetchAndSetWeather]);

  useEffect(() => {
    if (isInitializing && hasInitializedRef.current && (location.name || (location.lat && location.lon))) {
      finishInitialization();
    }
  }, [isInitializing, location, finishInitialization]);
  
  const setLocationByName = useCallback((name: string) => {
    if (name && name.trim()) {
      setLocation({ name: name.trim(), lat: null, lon: null });
      setError(null);
    }
  }, []);

  const setLocationByCoords = useCallback((lat: number, lon: number) => {
    if (lat && lon) {
      setLocation({ lat, lon, name: null });
      setError(null);
    }
  }, []);

  const refreshData = useCallback(() => {
    if (location.name || (location.lat && location.lon)) {
      toast.info(t('Toasts.refreshingData') || 'Refreshing data...');
      fetchAndSetWeather(location, units);
    }
  }, [location, units, fetchAndSetWeather, t]);

  return (
    <AppContext.Provider value={{ 
      location, 
      units, 
      weatherData, 
      isLoading, 
      error, 
      isInitializing: shouldAutoGeolocate,
      apiStatus,
      setUnits, 
      setLocationByName, 
      setLocationByCoords, 
      refreshData,
      finishInitialization,
      setApiStatus
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};