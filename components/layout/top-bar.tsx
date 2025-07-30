'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useFavorites } from '@/hooks/use-favorites';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Sun, Moon, Star, Locate, ChevronDown, X } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { toast } from 'sonner';

interface TopBarProps {
  locationName: string;
}

// A simplified interface compatible with both Web and Capacitor Geolocation
interface SimplePosition {
  coords: {
    latitude: number;
    longitude: number;
  };
}

export default function TopBar({ locationName }: TopBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme, setTheme } = useTheme();
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  const [locationInput, setLocationInput] = useState(searchParams.get('q') || '');
  const [isGeolocating, setIsGeolocating] = useState(false);

  const isSearchableLocation = locationName && locationName !== 'Current Location' && locationName !== 'Unknown Location';

  useEffect(() => {
    // Don't geolocate if a location is already specified in the URL
    if (searchParams.has('q') || searchParams.has('lat') || searchParams.has('lon')) {
      return;
    }

    const geolocateOnLoad = () => {
      setIsGeolocating(true);
      const promise = () => new Promise<SimplePosition>(async (resolve, reject) => {
        try {
          if (Capacitor.isNativePlatform()) {
            await Geolocation.requestPermissions();
            const position = await Geolocation.getCurrentPosition({ timeout: 10000, enableHighAccuracy: false });
            resolve(position);
          } else if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (pos) => resolve(pos as SimplePosition),
              reject,
              { timeout: 10000, enableHighAccuracy: false }
            );
          } else {
            reject(new Error("Geolocation is not supported by your browser."));
          }
        } catch (e) {
          reject(e);
        }
      });

      toast.promise(promise(), {
        loading: 'Getting your location automatically...',
        success: (position) => {
          const params = new URLSearchParams(searchParams.toString());
          params.set('lat', position.coords.latitude.toString());
          params.set('lon', position.coords.longitude.toString());
          params.delete('q');
          router.push(`?${params.toString()}`);
          setIsGeolocating(false);
          return 'Location found!';
        },
        error: (err: Error) => {
          console.error("Initial geolocation failed:", err);
          setIsGeolocating(false);
          if (err.message.includes('denied')) {
            return 'Location access denied. You can search for a location manually.';
          }
          return "Could not determine your location automatically.";
        },
      });
    };

    geolocateOnLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLocationInput(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (locationInput.trim()) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('q', locationInput.trim());
      params.delete('lat');
      params.delete('lon');
      router.push(`?${params.toString()}`);
    }
  };

  const handleGeolocate = async () => {
    setIsGeolocating(true);
    const promise = () => new Promise<SimplePosition>(async (resolve, reject) => {
        try {
          if (Capacitor.isNativePlatform()) {
            await Geolocation.requestPermissions();
            const position = await Geolocation.getCurrentPosition({ timeout: 10000, enableHighAccuracy: false });
            resolve(position);
          } else if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (pos) => resolve(pos as SimplePosition),
              reject,
              { timeout: 10000, enableHighAccuracy: false }
            );
          } else {
            reject(new Error("Geolocation not supported."));
          }
        } catch (e) {
          reject(e);
        }
      });

    toast.promise(promise(), {
      loading: 'Getting your location...',
      success: (position) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('lat', position.coords.latitude.toString());
        params.set('lon', position.coords.longitude.toString());
        params.delete('q');
        router.push(`?${params.toString()}`);
        setIsGeolocating(false);
        return 'Location updated!';
      },
      error: (err: Error) => {
        console.error("Geolocation failed:", err);
        setIsGeolocating(false);
        if (err.message.includes('denied')) {
            return 'Location access denied. Please enable it in your browser settings.';
        }
        return "Could not get your location.";
      },
    });
  };

  const handleUnitsChange = (value: string) => {
    if (value) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('units', value);
      router.push(`?${params.toString()}`);
    }
  };

  const handleFavoriteSelect = (fav: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('q', fav);
    params.delete('lat');
    params.delete('lon');
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2 w-full">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={handleGeolocate}
              disabled={isGeolocating}
            >
              <Locate className={`h-4 w-4 ${isGeolocating ? 'animate-spin' : ''}`} />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>{isGeolocating ? 'Getting Location...' : 'My Location'}</p></TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon">
            <ChevronDown className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-60">
          <div className="grid gap-4">
            <h4 className="font-medium text-muted-foreground leading-none">Favorites</h4>
            {favorites.length > 0 ? (
              <ul className="grid gap-2">
                {favorites.map(fav => (
                  <li key={fav} className="flex items-center justify-between">
                    <Button variant="link" className="p-0 h-auto" onClick={() => handleFavoriteSelect(fav)}>
                      {fav}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFavorite(fav)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No favorites yet.</p>
            )}
          </div>
        </PopoverContent>
      </Popover>

      <form onSubmit={handleSearch} className="flex-grow">
        <Input
          placeholder="Search for a location..."
          value={locationInput}
          onChange={(e) => setLocationInput(e.target.value)}
        />
      </form>

      {isSearchableLocation && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={() => addFavorite(locationName)}>
                <Star className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Add to Favorites</p></TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>Toggle Theme</p></TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <ToggleGroup type="single" variant="outline" value={searchParams.get('units') || 'metric'} onValueChange={handleUnitsChange}>
        <ToggleGroupItem value="metric" aria-label="Metric">°C</ToggleGroupItem>
        <ToggleGroupItem value="imperial" aria-label="Imperial">°F</ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}