import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { services } from '@shared/services';
import { STORAGE_KEYS } from '@shared/constants/storageKeys';

import { i18n } from './i18n';

type Locale = 'es' | 'en';

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, options?: Record<string, unknown>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>((i18n.locale as Locale) ?? 'es');

  useEffect(() => {
    const loadPersistedLocale = async () => {
      try {
        const savedLocale = await services.storage.get<Locale>(STORAGE_KEYS.locale);
        if (savedLocale === 'es' || savedLocale === 'en') {
          i18n.locale = savedLocale;
          setLocaleState(savedLocale);
        }
      } catch {
        // Silently fall back to the default locale.
      }
    };
    void loadPersistedLocale();
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    i18n.locale = newLocale;
    setLocaleState(newLocale);
    void services.storage.set(STORAGE_KEYS.locale, newLocale);
  }, []);

  const t = useCallback(
    (key: string, options?: Record<string, unknown>) => i18n.t(key, options),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale],
  );

  const value = useMemo<I18nContextValue>(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
