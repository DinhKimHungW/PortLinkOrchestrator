import React from 'react';
import clsx from 'clsx';
import { useLanguage, useTranslation } from '../../i18n/LanguageProvider';

export default function LanguageSwitcher({ className = '', labelClassName = '', selectClassName = '' }) {
  const { locale, setLocale, locales } = useLanguage();
  const t = useTranslation();

  return (
    <div className={clsx('flex items-center gap-2 text-sm', className)}>
      <span className={clsx('text-gray-500', labelClassName)}>{t('auth.language')}</span>
      <select
        className={clsx(
          'rounded border border-gray-300 bg-white px-2 py-1 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500',
          selectClassName,
        )}
        value={locale}
        onChange={(event) => setLocale(event.target.value)}
      >
        {locales.map((item) => (
          <option key={item.code} value={item.code}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
}
