import { useState, useEffect, useCallback } from 'react';

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
    }
  };

  const addFavorite = useCallback((location: string) => {
    if (location && !favorites.includes(location)) {
      const newFavorites = [...favorites, location];
      saveFavorites(newFavorites);
    }
  }, [favorites]);

  const removeFavorite = useCallback((location: string) => {
    const newFavorites = favorites.filter(fav => fav !== location);
    saveFavorites(newFavorites);
  }, [favorites]);

  return { favorites, addFavorite, removeFavorite };
};