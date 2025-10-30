import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { LanguageProvider } from './i18n/LanguageProvider';

export default function App() {
  return (
    <LanguageProvider>
      <AppRoutes />
    </LanguageProvider>
  );
}
