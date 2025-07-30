import { useState, useEffect, useCallback } from 'react';

// The key will now be passed as an argument to the hook
export const useViewPreference = (preferenceKey: string, defaultView: 'chart' | 'list' = 'chart') => {
  // Create a dynamic key for localStorage to store preferences separately
  const storageKey = `viewPreference_${preferenceKey}`;

  const [view, setView] = useState<'chart' | 'list'>(defaultView);

  useEffect(() => {
    try {
      const storedPreference = localStorage.getItem(storageKey);
      if (storedPreference === 'chart' || storedPreference === 'list') {
        setView(storedPreference);
      }
    } catch (error) {
      console.error(`Could not read view preference for ${preferenceKey} from localStorage`, error);
      setView(defaultView);
    }
  }, [defaultView, storageKey, preferenceKey]);

  const saveViewPreference = useCallback((preference: 'chart' | 'list') => {
    try {
      localStorage.setItem(storageKey, preference);
      setView(preference);
    } catch (error) {
      console.error(`Could not save view preference for ${preferenceKey} to localStorage`, error);
    }
  }, [storageKey, preferenceKey]);

  return { view, setView: saveViewPreference };
};