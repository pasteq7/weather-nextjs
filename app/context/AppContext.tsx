// app/context/AppContext.tsx
'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback, useRef } from 'react';
import { WeatherData } from '@/lib/types';
import { fetchWeatherByCity, fetchWeatherData, getCityNameFromCoordinates } from '@/lib/api';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

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
  setUnits: (units: 'metric' | 'imperial') => void;
  setLocationByName: (name: string) => void;
  setLocationByCoords: (lat: number, lon: number) => void;
  refreshData: () => void;
  finishInitialization: () => void;
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
  
  // Track if we've ever completed initialization to prevent re-running auto-geolocation
  const hasInitializedRef = useRef(false);
  const isFirstRender = useRef(true);

  const finishInitialization = useCallback(() => {
    setIsInitializing(false);
    hasInitializedRef.current = true;
  }, []);

  // Check if this is truly the first initialization or just a language switch
  const shouldAutoGeolocate = isInitializing && 
    !hasInitializedRef.current && 
    isFirstRender.current &&
    !location.name && 
    (!location.lat || !location.lon);

  useEffect(() => {
    isFirstRender.current = false;
  }, []);

  const fetchAndSetWeather = useCallback(async (currentLocation: Location, currentUnits: 'metric' | 'imperial') => {
    // Don't fetch if no location is set
    if (!currentLocation.name && (!currentLocation.lat || !currentLocation.lon)) {
      setIsLoading(false);
      setError(null);
      setWeatherData(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let data: WeatherData;
      let name = currentLocation.name;
      let lat = currentLocation.lat;
      let lon = currentLocation.lon;

      if (lat && lon) {
        // Fetch by coordinates
        data = await fetchWeatherData(lat, lon, currentUnits);
        
        if (!name) {
          const cityName = await getCityNameFromCoordinates(lat, lon);
          name = cityName || t('Weather.currentLocation');
        }
      } else if (name) {
        // Fetch by city name
        const result = await fetchWeatherByCity(name, currentUnits);
        data = result;
        name = result.name || name; // Use the resolved name
        lat = result.latitude;
        lon = result.longitude;
      } else {
        throw new Error('No valid location data');
      }
      
      // Combine all data into one object before setting state
      const completeWeatherData = { ...data, name, latitude: lat ?? undefined, longitude: lon ?? undefined };
      setWeatherData(completeWeatherData);

    } catch (e) {
      console.error('Weather fetch error:', e);
      const errorMessage = e instanceof Error && e.message.startsWith('ERROR_')
        ? t(`Errors.${e.message as 'ERROR_CITY_NOT_FOUND'}`)
        : t('Errors.ERROR_UNKNOWN') || 'Failed to fetch weather data';
      
      setError(errorMessage);
      toast.error(errorMessage);
      setWeatherData(null);
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  // Effect to fetch weather when location or units change
  useEffect(() => {
    if (location.name || (location.lat && location.lon)) {
      fetchAndSetWeather(location, units);
    }
  }, [location, units, fetchAndSetWeather]);

  // Auto-finish initialization if we already have location data (language switch scenario)
  useEffect(() => {
    if (isInitializing && hasInitializedRef.current && (location.name || (location.lat && location.lon))) {
      // This is likely a language switch, just finish initialization without geolocation
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
      isInitializing: shouldAutoGeolocate, // Only show as initializing if we should auto-geolocate
      setUnits, 
      setLocationByName, 
      setLocationByCoords, 
      refreshData,
      finishInitialization
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