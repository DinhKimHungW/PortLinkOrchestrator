import React from 'react';
import { Card } from '../../ui';
import { useTranslation } from '../../../i18n/LanguageProvider';
import { formatDate } from '../../../lib/dateUtils';

export default function ScheduleOverview({ schedules = [], loading, version, updatedAt }) {
  const t = useTranslation();

  if (loading) {
    return (
      <Card>
        <p>{t('dashboard.loadingSchedules')}</p>
      </Card>
    );
  }

  if (!schedules.length) {
    return (
      <Card>
        <p>{t('dashboard.noSchedules')}</p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between text-xs text-gray-500">
        {version && <span>Version #{version}</span>}
        {updatedAt && <span>{formatDate(updatedAt)}</span>}
      </div>
      <ul className="space-y-2">
        {schedules.map((schedule) => (
          <li key={schedule.id || schedule.taskId} className="rounded border border-gray-200 p-3">
            <p className="font-semibold text-gray-800">{schedule.shipName || schedule.title || `Schedule ${schedule.id}`}</p>
            <div className="mt-1 flex flex-wrap gap-4 text-xs text-gray-500">
              {schedule.assetName && <span>{t('incident.affectedAsset')}: {schedule.assetName}</span>}
              {schedule.startTime && <span>{t('schedule.start')}: {formatDate(schedule.startTime)}</span>}
              {schedule.endTime && <span>{t('schedule.end')}: {formatDate(schedule.endTime)}</span>}
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
