import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { LanguageProvider } from './i18n/LanguageProvider';
import { ToastProvider } from './components/ui';
import { ThemeProvider } from './theme/ThemeProvider';

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
