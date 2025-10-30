import React from 'react';
import { Card, Button } from '../../ui';
import { useTranslation } from '../../../i18n/LanguageProvider';
import { formatDate } from '../../../lib/dateUtils';

export default function NotificationCenter({ logs = [], loading, onRefresh, onExport }) {
  const t = useTranslation();

  return (
    <Card className="flex h-full flex-col">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{t('dashboard.notificationTitle')}</h2>
        <div className="flex items-center gap-2">
          {onExport && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  onExport();
                }
              }}
            >
              {t('notifications.export')}
            </Button>
          )}
          {onRefresh && (
            <Button type="button" variant="secondary" onClick={onRefresh}>
              {t('dashboard.refresh')}
            </Button>
          )}
        </div>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto pr-2">
        {loading ? (
          Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="animate-pulse space-y-2 rounded border border-gray-200 p-3">
              <div className="h-3 w-1/3 rounded bg-gray-200" />
              <div className="h-3 w-2/3 rounded bg-gray-200" />
            </div>
          ))
        ) : logs.length === 0 ? (
          <p className="text-sm text-gray-500">{t('dashboard.noNotifications')}</p>
        ) : (
          logs.map((log) => (
            <article key={log.logId || `${log.timestamp}-${log.description}`} className="rounded border border-gray-200 p-3 shadow-sm">
              <header className="mb-1 flex items-center justify-between text-xs text-gray-500">
                <span>{formatDate(log.timestamp)}</span>
                <span className="rounded bg-sky-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-sky-600">
                  {log.eventType || 'LOG'}
                </span>
              </header>
              <p className="text-sm text-gray-700">{log.description}</p>
            </article>
          ))
        )}
      </div>
    </Card>
  );
}
