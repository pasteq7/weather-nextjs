import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

const FAVORITES_STORAGE_KEY = 'favoriteLocations';

export const useFavorites = () => {
  const t = useTranslations('Toasts');
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

  const saveFavorites = useCallback((items: string[]) => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(items));
      setFavorites(items);
    } catch (error) {
      console.error("Could not save favorites to localStorage", error);
      toast.error(t('saveFavoriteError'));
    }
  }, [t]);

  const addFavorite = useCallback((location: string) => {
    if (location && !favorites.includes(location)) {
      const newFavorites = [...favorites, location];
      saveFavorites(newFavorites);
      toast.success(t('addFavoriteSuccess', { location }));
    } else {
      toast.info(t('addFavoriteInfo', { location }));
    }
  }, [favorites, saveFavorites, t]);

  const removeFavorite = useCallback((location: string) => {
    const newFavorites = favorites.filter(fav => fav !== location);
    saveFavorites(newFavorites);
    toast.info(t('removeFavoriteInfo', { location }));
  }, [favorites, saveFavorites, t]);

  return { favorites, addFavorite, removeFavorite };
};