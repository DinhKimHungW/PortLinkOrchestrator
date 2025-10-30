import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import translations, { availableLocales, defaultLocale } from './translations';

const LanguageContext = createContext({
  locale: defaultLocale,
  setLocale: () => {},
  t: (key, vars) => key,
  locales: availableLocales,
});

function interpolate(template, vars = {}) {
  return Object.keys(vars).reduce((acc, variable) => acc.replaceAll(`{{${variable}}}`, vars[variable]), template);
}

function resolvePath(locale, key) {
  const segments = key.split('.');
  let current = translations[locale];
  for (const segment of segments) {
    if (!current || typeof current[segment] === 'undefined') {
      return undefined;
    }
    current = current[segment];
  }
  return current;
}

export function LanguageProvider({ children }) {
  const [locale, setLocaleState] = useState(() => {
    if (typeof window === 'undefined') {
      return defaultLocale;
    }
    return localStorage.getItem('lang') || defaultLocale;
  });

  const setLocale = useCallback((nextLocale) => {
    setLocaleState(nextLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lang', nextLocale);
    }
  }, []);

  const translate = useCallback((key, vars) => {
    const raw = resolvePath(locale, key) ?? resolvePath(defaultLocale, key) ?? key;
    if (typeof raw === 'string') {
      return vars ? interpolate(raw, vars) : raw;
    }
    return raw;
  }, [locale]);

  const value = useMemo(() => ({
    locale,
    setLocale,
    t: translate,
    locales: availableLocales,
  }), [locale, setLocale, translate]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function useTranslation() {
  const { t } = useLanguage();
  return t;
}
