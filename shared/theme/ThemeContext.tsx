import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

import { services } from '@shared/services';
import { STORAGE_KEYS } from '@shared/constants/storageKeys';

type ColorScheme = 'light' | 'dark';

interface ThemeContextValue {
  isDark: boolean;
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
  toggleColorScheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>(
    systemColorScheme === 'dark' ? 'dark' : 'light',
  );

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedScheme = await services.storage.get<ColorScheme>(STORAGE_KEYS.theme);
        if (savedScheme === 'light' || savedScheme === 'dark') {
          setColorSchemeState(savedScheme);
        }
      } catch {
        // Keep the system-derived default when persisted theme can't be read.
      }
    };
    void loadTheme();
  }, []);

  const setColorScheme = (scheme: ColorScheme) => {
    setColorSchemeState(scheme);
    void services.storage.set(STORAGE_KEYS.theme, scheme);
  };

  const toggleColorScheme = () => {
    const newScheme = colorScheme === 'light' ? 'dark' : 'light';
    setColorScheme(newScheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        isDark: colorScheme === 'dark',
        colorScheme,
        setColorScheme,
        toggleColorScheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
