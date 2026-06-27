import React, { createContext, useContext } from 'react';
import { useCustomization } from '../hooks/useCustomization';
import { BlogCustomization } from '../types/customization';

interface CustomizationContextType {
  customization: BlogCustomization;
  updateCustomization: (updates: Partial<BlogCustomization>) => void;
  resetCustomization: () => void;
  isLoading: boolean;
}

const CustomizationContext = createContext<CustomizationContextType | undefined>(undefined);

export function CustomizationProvider({ children }: { children: React.ReactNode }) {
  const customizationHook = useCustomization();

  return (
    <CustomizationContext.Provider value={customizationHook}>
      {children}
    </CustomizationContext.Provider>
  );
}

export function useCustomizationContext() {
  const context = useContext(CustomizationContext);
  if (context === undefined) {
    throw new Error('useCustomizationContext must be used within a CustomizationProvider');
  }
  return context;
}
