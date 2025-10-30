import React from 'react';
import clsx from 'clsx';
import { Card } from '../../ui';
import { useTranslation } from '../../../i18n/LanguageProvider';

const KPI_CONFIG = [
  { key: 'conflictRate', format: (value) => `${(value * 100).toFixed(1)}%`, accent: 'bg-rose-100 text-rose-600' },
  { key: 'avgWaitingMinutes', format: (value) => `${value.toFixed(0)} min`, accent: 'bg-amber-100 text-amber-600' },
  { key: 'berthUtilization', format: (value) => `${(value * 100).toFixed(0)}%`, accent: 'bg-emerald-100 text-emerald-600' },
];

export default function KpiGrid({ metrics, loading }) {
  const t = useTranslation();

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {KPI_CONFIG.map((item) => {
        const raw = metrics ? metrics[item.key] : null;
        const displayValue = raw == null ? '--' : item.format(Number(raw));
        return (
          <Card key={item.key} className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wide text-gray-500">{t(`kpi.${item.key}`)}</span>
            {loading ? (
              <span className="h-6 w-20 animate-pulse rounded bg-gray-200" />
            ) : (
              <span className={clsx('inline-flex w-fit rounded px-2 py-1 text-lg font-semibold', item.accent)}>
                {displayValue}
              </span>
            )}
          </Card>
        );
      })}
    </div>
  );
}
