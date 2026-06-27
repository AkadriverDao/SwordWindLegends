import { useCallback, useEffect, useState } from "react";
import {
  type BlogCustomization,
  DEFAULT_CUSTOMIZATION,
} from "../types/customization";
import { useInternetIdentity } from "./useInternetIdentity";

const STORAGE_KEY_PREFIX = "blog_customization_";

export function useCustomization() {
  const { identity } = useInternetIdentity();
  const [customization, setCustomization] = useState<BlogCustomization>(
    DEFAULT_CUSTOMIZATION,
  );
  const [isLoading, setIsLoading] = useState(true);

  // Get storage key for current user
  const getStorageKey = useCallback(() => {
    if (!identity) return null;
    return `${STORAGE_KEY_PREFIX}${identity.getPrincipal().toString()}`;
  }, [identity]);

  // Load customization from localStorage
  const loadCustomization = useCallback(() => {
    const storageKey = getStorageKey();
    if (!storageKey) {
      setCustomization(DEFAULT_CUSTOMIZATION);
      setIsLoading(false);
      return;
    }

    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as BlogCustomization;
        setCustomization({ ...DEFAULT_CUSTOMIZATION, ...parsed });
      } else {
        setCustomization(DEFAULT_CUSTOMIZATION);
      }
    } catch (error) {
      console.error("Error loading customization:", error);
      setCustomization(DEFAULT_CUSTOMIZATION);
    }
    setIsLoading(false);
  }, [getStorageKey]);

  // Save customization to localStorage
  const saveCustomization = useCallback(
    (newCustomization: BlogCustomization) => {
      const storageKey = getStorageKey();
      if (!storageKey) return;

      try {
        localStorage.setItem(storageKey, JSON.stringify(newCustomization));
        setCustomization(newCustomization);
      } catch (error) {
        console.error("Error saving customization:", error);
      }
    },
    [getStorageKey],
  );

  // Update specific customization property
  const updateCustomization = useCallback(
    (updates: Partial<BlogCustomization>) => {
      const newCustomization = { ...customization, ...updates };
      saveCustomization(newCustomization);
    },
    [customization, saveCustomization],
  );

  // Reset to default
  const resetCustomization = useCallback(() => {
    saveCustomization(DEFAULT_CUSTOMIZATION);
  }, [saveCustomization]);

  // Load customization when identity changes
  useEffect(() => {
    loadCustomization();
  }, [loadCustomization]);

  return {
    customization,
    updateCustomization,
    resetCustomization,
    isLoading,
  };
}
