import { useState, useEffect, useCallback } from 'react';
import { safeLocalStorage } from '../stores/safeStorage';

/**
 * useLocalStorage
 * - SSR safe
 * - SafeLocalStorage adapter backed with error boundaries & fallbacks
 * - Cross-window storage event sync
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  validator?: (val: unknown) => val is T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    return safeLocalStorage.getItem<T>(key, initialValue, validator);
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const valueToStore = value instanceof Function ? value(prev) : value;
        safeLocalStorage.setItem(key, valueToStore);
        return valueToStore;
      });
    },
    [key]
  );

  const removeValue = useCallback(() => {
    safeLocalStorage.removeItem(key);
    setStoredValue(initialValue);
  }, [key, initialValue]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `mypath365_${key}`) {
        const updated = safeLocalStorage.getItem<T>(key, initialValue, validator);
        setStoredValue(updated);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, initialValue, validator]);

  return [storedValue, setValue, removeValue];
}
