import { useEffect, useRef } from "react";

interface UseFormAutosaveOptions {
  formData: Record<string, any>;
  storageKey: string;
  debounceMs?: number;
  enabled?: boolean;
}

/**
 * Hook to auto-save form data to localStorage
 * Includes debouncing to avoid excessive writes
 */
export function useFormAutosave({
  formData,
  storageKey,
  debounceMs = 2000,
  enabled = true,
}: UseFormAutosaveOptions) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<string>("");

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined' || !enabled) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce the save
    timeoutRef.current = setTimeout(() => {
      const dataString = JSON.stringify(formData);
      
      // Only save if data has changed
      if (dataString !== lastSavedRef.current) {
        try {
          localStorage.setItem(storageKey, dataString);
          lastSavedRef.current = dataString;
          console.log("Form autosaved to localStorage");
        } catch (error) {
          console.error("Failed to autosave form:", error);
        }
      }
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [formData, storageKey, debounceMs, enabled]);

  /**
   * Load saved form data from localStorage
   */
  const loadSavedData = (): Record<string, any> | null => {
    // Only run on client side
    if (typeof window === 'undefined') return null;
    
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error("Failed to load saved form data:", error);
    }
    return null;
  };

  /**
   * Clear saved form data from localStorage
   */
  const clearSavedData = () => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(storageKey);
      lastSavedRef.current = "";
      console.log("Saved form data cleared");
    } catch (error) {
      console.error("Failed to clear saved form data:", error);
    }
  };

  return { loadSavedData, clearSavedData };
}

