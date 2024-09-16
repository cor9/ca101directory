import { useEffect, useState } from 'react';   

// from: https://github.com/javayhu/lms-studio-antonio/blob/main/hooks/use-debounce.ts

// Only when a user stops typing for at least 500 ms then we will search
// against the database, this prevents us from making too many requests
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}