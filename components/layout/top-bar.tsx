// components/layout/top-bar.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { useFavorites } from '@/hooks/use-favorites';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Sun, Moon, Star, Locate, X, ChevronDown, Languages, Clock } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { useAppContext } from '@/app/context/AppContext';
import { Locale } from '@/i18n-config';
import { useLanguage } from '@/app/context/LanguageProvider';

interface SimplePosition {
  coords: {
    latitude: number;
    longitude: number;
  };
}

export default function TopBar() {
  const t = useTranslations();
  const { locale, setLocale } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const { 
    location, 
    units, 
    weatherData, // Added weatherData to access timezone
    setUnits, 
    setLocationByName, 
    setLocationByCoords, 
    refreshData,
    isInitializing,
    finishInitialization,
    setApiStatus
  } = useAppContext();

  const [locationInput, setLocationInput] = useState('');
  const [isGeolocating, setIsGeolocating] = useState(false);
  const [currentTime, setCurrentTime] = useState<string | null>(null);

  const isSearchableLocation = location.name && 
    location.name !== (t('Weather.currentLocation') || 'Current Location') && 
    location.name !== (t('Weather.unknownLocation') || 'Unknown Location');

  useEffect(() => {
    const interval = setInterval(() => {
      if (location.name || (location.lat && location.lon)) {
        refreshData();
      }
    }, 3600000);

    return () => clearInterval(interval);
  }, [location, refreshData]);

  // Effect to handle the clock logic based on location timezone
  useEffect(() => {
    if (!weatherData?.timezone) {
      setCurrentTime(null);
      return;
    }

    const updateTime = () => {
      try {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], {
          timeZone: weatherData.timezone,
          hour: '2-digit',
          minute: '2-digit',
          hour12: units === 'imperial'
        });
        setCurrentTime(timeString);
      } catch (error) {
        console.error("Error formatting time for timezone:", weatherData.timezone);
        setCurrentTime(null);
      }
    };

    updateTime(); // Initial update
    const timer = setInterval(updateTime, 1000); // Update every second

    return () => clearInterval(timer);
  }, [weatherData?.timezone, units]);

  const handleGeolocate = useCallback(async (isAuto = false) => {
    if (isGeolocating) return;
    
    setIsGeolocating(true);
    
    const promise = () => new Promise<SimplePosition>(async (resolve, reject) => {
      try {
        if (Capacitor.isNativePlatform()) {
          const permissions = await Geolocation.requestPermissions();
          if (permissions.location !== 'granted') {
            throw new Error('Location permission denied');
          }
          const position = await Geolocation.getCurrentPosition({ 
            timeout: 10000, 
            enableHighAccuracy: false 
          });
          resolve(position);
        } else if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve(pos as SimplePosition),
            (error) => {
              let message = 'Geolocation failed';
              if (error.code === error.PERMISSION_DENIED) message = 'Location permission denied';
              else if (error.code === error.POSITION_UNAVAILABLE) message = 'Location unavailable';
              else if (error.code === error.TIMEOUT) message = 'Location request timeout';
              reject(new Error(message));
            },
            { timeout: 10000, enableHighAccuracy: false }
          );
        } else {
          reject(new Error('Geolocation not supported'));
        }
      } catch (e) {
        reject(e);
      }
    });

    toast.promise(promise(), {
      loading: isAuto ? t('Toasts.gettingLocationAuto') : t('Toasts.gettingLocation'),
      success: (position) => {
        if (isAuto) finishInitialization();
        setApiStatus('geolocation', { status: 'operational' });
        setLocationByCoords(position.coords.latitude, position.coords.longitude);
        setIsGeolocating(false);
        return t('Toasts.locationFound');
      },
      error: (err: Error) => {
        if (isAuto) finishInitialization();
        setApiStatus('geolocation', { status: 'outage' });
        console.error("Geolocation failed:", err);
        setIsGeolocating(false);
        if (err.message.includes('denied') || err.message.includes('permission')) {
          return t('Toasts.locationDenied');
        }
        return isAuto ? t('Toasts.locationErrorAuto') : t('Toasts.locationError');
      },
    });
  }, [isGeolocating, finishInitialization, setLocationByCoords, t, setApiStatus]);

  useEffect(() => {
    if (isInitializing) {
      handleGeolocate(true);
    }
  }, [isInitializing, handleGeolocate]);

  useEffect(() => {
    setLocationInput(location.name || '');
  }, [location.name]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const searchTerm = locationInput.trim();
    if (searchTerm) {
      setLocationByName(searchTerm);
    }
  };

  const handleUnitsChange = (value: 'metric' | 'imperial') => {
    if (value) setUnits(value);
  };

  const handleLangChange = (value: string) => {
    const newLocale = value as Locale;
    if (newLocale && newLocale !== locale) {
      setLocale(newLocale);
    }
  };

  const handleFavoriteSelect = (fav: string) => {
    setLocationByName(fav);
  };

  return (
    <div className="flex items-center gap-2 w-full">

        {/* Current Time Display */}
        {currentTime && (
          <div className="hidden md:flex items-center gap-1.5 px-2 text-sm font-medium tabular-nums text-muted-foreground whitespace-nowrap bg-card border rounded-md h-9 shadow-sm">
            <Clock className="h-3.5 w-3.5" />
            {currentTime}
          </div>
        )}

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={() => handleGeolocate(false)} disabled={isGeolocating}>
              <Locate className={`h-4 w-4 ${isGeolocating ? 'animate-spin' : ''}`} />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>{isGeolocating ? t('TopBar.gettingLocationTooltip') : t('TopBar.myLocationTooltip')}</p></TooltipContent>
        </Tooltip>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" aria-label={t('TopBar.favoritesTooltip')}><ChevronDown className="h-4 w-4" /></Button>
          </PopoverTrigger>
          <PopoverContent className="w-60">
            <div className="grid gap-4">
              <h4 className="font-medium text-muted-foreground leading-none">{t('TopBar.favoritesTitle')}</h4>
              {favorites.length > 0 ? (
                <ul className="grid gap-2">
                  {favorites.map(fav => (
                    <li key={fav} className="flex items-center justify-between">
                      <Button variant="link" className="p-0 h-auto" onClick={() => handleFavoriteSelect(fav)}>{fav}</Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFavorite(fav)}><X className="h-4 w-4" /></Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">{t('TopBar.noFavorites')}</p>
              )}
            </div>
          </PopoverContent>
        </Popover>

        <form onSubmit={handleSearch} className="flex-grow">
          <Input placeholder={t('TopBar.searchPlaceholder')} value={locationInput} onChange={(e) => setLocationInput(e.target.value)} />
        </form>


        {isSearchableLocation && (
          <Tooltip>
            <TooltipTrigger asChild><Button variant="outline" size="icon" onClick={() => addFavorite(location.name!)}><Star className="h-4 w-4" /></Button></TooltipTrigger>
            <TooltipContent><p>{t('TopBar.addFavoriteTooltip')}</p></TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild><Button variant="outline" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}><Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" /><Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" /></Button></TooltipTrigger>
          <TooltipContent><p>{t('TopBar.toggleThemeTooltip')}</p></TooltipContent>
        </Tooltip>

        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild><DropdownMenuTrigger asChild><Button variant="outline" size="icon"><Languages className="h-4 w-4" /></Button></DropdownMenuTrigger></TooltipTrigger>
            <TooltipContent><p>{t('TopBar.changeLanguageTooltip')}</p></TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleLangChange('en')} disabled={locale === 'en'}>{t('TopBar.english')}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleLangChange('fr')} disabled={locale === 'fr'}>{t('TopBar.french')}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <ToggleGroup type="single" variant="outline" value={units} onValueChange={(v) => handleUnitsChange(v as 'metric' | 'imperial')}>
          <Tooltip>
            <TooltipTrigger asChild><ToggleGroupItem value="metric" aria-label="Metric">°C</ToggleGroupItem></TooltipTrigger>
            <TooltipContent><p>{t('TopBar.celsiusTooltip')}</p></TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild><ToggleGroupItem value="imperial" aria-label="Imperial">°F</ToggleGroupItem></TooltipTrigger>
            <TooltipContent><p>{t('TopBar.fahrenheitTooltip')}</p></TooltipContent>
          </Tooltip>
        </ToggleGroup>
      </TooltipProvider>
    </div>
  );
}