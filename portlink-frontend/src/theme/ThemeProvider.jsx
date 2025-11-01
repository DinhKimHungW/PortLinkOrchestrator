import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {}, setTheme: () => {} });
const THEME_STORAGE_KEY = 'app-theme';
const prefersDark = () => (typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)').matches : false);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    return window.localStorage.getItem(THEME_STORAGE_KEY) || (prefersDark() ? 'dark' : 'light');
  });

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    window.localStorage?.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (event) => {
      if (!window.localStorage.getItem(THEME_STORAGE_KEY)) {
        setTheme(event.matches ? 'dark' : 'light');
      }
    };
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme: () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')),
      isDark: theme === 'dark',
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
