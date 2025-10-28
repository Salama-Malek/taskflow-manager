import { useCallback, useEffect, useRef, useState } from "react";

type Serializer<T> = (value: T) => string;
type Deserializer<T> = (value: string) => T;

interface LocalStorageOptions<T> {
  serializer?: Serializer<T>;
  deserializer?: Deserializer<T>;
}

const isBrowser = typeof window !== "undefined";

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: LocalStorageOptions<T> = {}
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const { serializer = JSON.stringify, deserializer = JSON.parse } = options;
  const isFirstRender = useRef(true);

  const readValue = useCallback((): T => {
    if (!isBrowser) {
      return initialValue;
    }

    try {
      const storedValue = window.localStorage.getItem(key);
      return storedValue !== null ? (deserializer(storedValue) as T) : initialValue;
    } catch (error) {
      console.warn(`useLocalStorage: error reading key "${key}"`, error);
      return initialValue;
    }
  }, [key, deserializer, initialValue]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!isBrowser) {
      return;
    }

    try {
      const valueToStore = serializer(storedValue);
      window.localStorage.setItem(key, valueToStore);
    } catch (error) {
      console.warn(`useLocalStorage: error storing key "${key}"`, error);
    }
  }, [key, serializer, storedValue]);

  const updateValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => (value instanceof Function ? value(prev) : value));
    },
    []
  );

  const removeValue = useCallback(() => {
    if (!isBrowser) {
      return;
    }
    window.localStorage.removeItem(key);
    setStoredValue(initialValue);
  }, [initialValue, key]);

  useEffect(() => {
    if (!isBrowser) {
      return;
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key === key && event.newValue !== null) {
        setStoredValue(deserializer(event.newValue));
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [key, deserializer]);

  return [storedValue, updateValue, removeValue];
}
