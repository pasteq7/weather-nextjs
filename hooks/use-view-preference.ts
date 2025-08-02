import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export interface ViewPreferences {
  view: 'chart' | 'list';
  displayModes: string[];
}

// The key will now be passed as an argument to the hook
export const useViewPreference = (
  preferenceKey: string,
  defaultPrefs: ViewPreferences
) => {
  // Create a dynamic key for localStorage to store preferences separately
  const storageKey = `viewPreference_${preferenceKey}`;

  const [preferences, setPreferences] = useState<ViewPreferences>(() => {
    if (typeof window === 'undefined') {
      return defaultPrefs;
    }
    try {
      const storedPreference = localStorage.getItem(storageKey);
      if (storedPreference) {
        const parsed = JSON.parse(storedPreference);
        // Validate the parsed object to ensure it has the correct shape
        if (
          parsed &&
          (parsed.view === 'chart' || parsed.view === 'list') &&
          Array.isArray(parsed.displayModes)
        ) {
          return parsed;
        }
      }
    } catch (error) {
      console.error(`Could not read view preference for ${preferenceKey} from localStorage`, error);
    }
    return defaultPrefs;
  });

  const saveViewPreference = useCallback((newPrefs: Partial<ViewPreferences>) => {
    setPreferences(prevPrefs => {
      const updatedPrefs = { ...prevPrefs, ...newPrefs };
      try {
        localStorage.setItem(storageKey, JSON.stringify(updatedPrefs));
      } catch (error) {
        console.error(`Could not save view preference for ${preferenceKey} to localStorage`, error);
        toast.error('Could not save your view preferences.');
      }
      return updatedPrefs;
    });
  }, [storageKey, preferenceKey]);

  return { preferences, setPreferences: saveViewPreference };
};