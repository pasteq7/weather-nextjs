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

interface TopBarProps {
  locationName: string;
}

export default function TopBar({ locationName }: TopBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme, setTheme } = useTheme();
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  const [locationInput, setLocationInput] = useState(searchParams.get('q') || '');
  const [isGeolocating, setIsGeolocating] = useState(false);

  useEffect(() => {
    // Check if a location is already specified in the URL. If so, do nothing.
    if (searchParams.has('q') || searchParams.has('lat') || searchParams.has('lon')) {
      return;
    }

    const geolocateOnLoad = async () => {
      setIsGeolocating(true);
      try {
        let position;
        if (Capacitor.isNativePlatform()) {
          await Geolocation.requestPermissions();
          position = await Geolocation.getCurrentPosition();
        } else if (navigator.geolocation) {
          position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 10000,
              enableHighAccuracy: false
            });
          });
        } else {
          return; // Geolocation not supported.
        }

        const params = new URLSearchParams(searchParams.toString());
        params.set('lat', position.coords.latitude.toString());
        params.set('lon', position.coords.longitude.toString());
        params.delete('q');
        router.push(`?${params.toString()}`);
      } catch (error) {
        console.error("Initial geolocation failed:", error);
        // Optionally set a default location or show an error message
      } finally {
        setIsGeolocating(false);
      }
    };

    geolocateOnLoad();
  }, []); // Empty dependency array ensures this runs only once on mount

  useEffect(() => {
    // Sync input with URL query param 'q' if it exists
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
    try {
      let position;
      if (Capacitor.isNativePlatform()) {
        await Geolocation.requestPermissions();
        position = await Geolocation.getCurrentPosition();
      } else {
        position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 10000,
            enableHighAccuracy: false
          });
        });
      }
      const params = new URLSearchParams(searchParams.toString());
      params.set('lat', position.coords.latitude.toString());
      params.set('lon', position.coords.longitude.toString());
      params.delete('q');
      router.push(`?${params.toString()}`);
    } catch (error) {
      console.error("Geolocation failed:", error);
      alert("Could not get your location.");
    } finally {
      setIsGeolocating(false);
    }
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
            <h4 className="font-medium leading-none">Favorites</h4>
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

      {/* Only show favorite button if we have a location name */}
      {locationName && (
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