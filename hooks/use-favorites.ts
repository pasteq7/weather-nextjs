import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

const FAVORITES_STORAGE_KEY = 'favoriteLocations';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error("Could not parse favorites from localStorage", error);
      setFavorites([]);
    }
  }, []);

  const saveFavorites = (items: string[]) => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(items));
      setFavorites(items);
    } catch (error) {
      console.error("Could not save favorites to localStorage", error);
      toast.error('Could not save favorites.');
    }
  };

  const addFavorite = useCallback((location: string) => {
    if (location && !favorites.includes(location)) {
      const newFavorites = [...favorites, location];
      saveFavorites(newFavorites);
      toast.success(`'${location}' has been added to your favorites.`);
    } else {
      toast.info(`'${location}' is already in your favorites.`);
    }
  }, [favorites]);

  const removeFavorite = useCallback((location: string) => {
    const newFavorites = favorites.filter(fav => fav !== location);
    saveFavorites(newFavorites);
    toast.info(`'${location}' has been removed from your favorites.`);
  }, [favorites]);

  return { favorites, addFavorite, removeFavorite };
};