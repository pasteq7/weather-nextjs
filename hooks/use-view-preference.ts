import { useState, useCallback } from 'react';

// The key will now be passed as an argument to the hook
export const useViewPreference = (preferenceKey: string, defaultView: 'chart' | 'list' = 'chart') => {
  // Create a dynamic key for localStorage to store preferences separately
  const storageKey = `viewPreference_${preferenceKey}`;

  const [view, setView] = useState<'chart' | 'list'>(() => {
    if (typeof window === 'undefined') {
      return defaultView;
    }
    try {
      const storedPreference = localStorage.getItem(storageKey);
      if (storedPreference === 'chart' || storedPreference === 'list') {
        return storedPreference;
      }
    } catch (error) {
      console.error(`Could not read view preference for ${preferenceKey} from localStorage`, error);
    }
    return defaultView;
  });

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