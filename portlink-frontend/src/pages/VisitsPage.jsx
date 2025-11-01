import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Button, Spinner, EmptyState } from '../components/ui';
import { fetchVisits } from '../api/visitService';
import { setVisits, setVisitsLoading, setVisitsError, setVisitFilters } from '../store/slices/visitSlice';
import { useTranslation } from '../i18n/LanguageProvider';
import { formatDate, formatDuration } from '../lib/dateUtils';

export default function VisitsPage() {
  const dispatch = useDispatch();
  const t = useTranslation();
  const { items, loading, error, filters } = useSelector((state) => state.visits);

  const loadVisits = useCallback(async () => {
    dispatch(setVisitsLoading(true));
    try {
      const data = await fetchVisits();
      dispatch(setVisits(data || []));
    } catch (err) {
      const message = err?.response?.data?.message || t('toast.fetchFailed');
      dispatch(setVisitsError(message));
    } finally {
      dispatch(setVisitsLoading(false));
    }
  }, [dispatch, t]);

  useEffect(() => {
    loadVisits();
  }, [loadVisits]);

  const sortedVisits = useMemo(() => {
    return [...items].sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  }, [items]);

  const groupedByDate = useMemo(() => {
    const groups = new Map();
    sortedVisits.forEach((visit) => {
      const dateKey = new Date(visit.startTime).toDateString();
      if (!groups.has(dateKey)) {
        groups.set(dateKey, []);
      }
      groups.get(dateKey).push(visit);
    });
    return groups;
  }, [sortedVisits]);

  const view = filters.view || 'list';

  const renderStatusBadge = (status) => {
    if (!status) return null;
    const normalized = status.toLowerCase();
    const label = status.replace(/([a-z])([A-Z])/g, '$1 $2');
    const variant =
      normalized === 'completed'
        ? 'bg-emerald-100 text-emerald-700'
        : normalized === 'inprogress'
        ? 'bg-sky-100 text-sky-700'
        : normalized === 'queued' || normalized === 'scheduled'
        ? 'bg-amber-100 text-amber-700'
        : normalized === 'delayed'
        ? 'bg-rose-100 text-rose-700'
        : 'bg-slate-200 text-slate-700';
    return (
      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold uppercase tracking-wide ${variant}`}>
        {label}
      </span>
    );
  };

  const renderList = () => {
    if (sortedVisits.length === 0) {
      return <EmptyState title={t('visitsPage.empty')} />;
    }
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-base/80 text-sm">
          <thead className="bg-surface text-left text-xs uppercase tracking-wide text-soft">
            <tr>
              <th className="px-3 py-2">{t('visitsPage.table.ship')}</th>
              <th className="px-3 py-2">{t('visitsPage.table.asset')}</th>
              <th className="px-3 py-2">{t('visitsPage.table.eta')}</th>
              <th className="px-3 py-2">{t('visitsPage.table.etd')}</th>
              <th className="px-3 py-2">{t('visitsPage.table.duration')}</th>
              <th className="px-3 py-2">{t('common.status')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base/80">
            {sortedVisits.map((visit) => (
              <tr key={visit.id} className="hover:bg-slate-100/60 dark:hover:bg-slate-800/60">
                <td className="whitespace-nowrap px-3 py-3 text-sm font-medium text-slate-700 dark:text-slate-100">
                  {visit.shipName || visit.name}
                </td>
                <td className="px-3 py-3 text-sm text-soft">{visit.assetName || '—'}</td>
                <td className="px-3 py-3 text-sm text-soft">{formatDate(visit.startTime)}</td>
                <td className="px-3 py-3 text-sm text-soft">{formatDate(visit.endTime)}</td>
                <td className="px-3 py-3 text-sm text-soft">{formatDuration(visit.startTime, visit.endTime)}</td>
                <td className="px-3 py-3 text-sm text-soft">{renderStatusBadge(visit.lifecycle || visit.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderCalendar = () => {
    if (sortedVisits.length === 0) {
      return <EmptyState title={t('visitsPage.empty')} />;
    }
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {[...groupedByDate.entries()].map(([dateKey, visitsForDay]) => (
          <Card key={dateKey} className="space-y-3 border border-base bg-surface shadow-sm dark:bg-slate-900/60">
            <div>
              <p className="text-xs uppercase tracking-wide text-soft">{new Date(dateKey).toLocaleDateString()}</p>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {visitsForDay.length} {visitsForDay.length > 1 ? 'calls' : 'call'}
              </p>
            </div>
            <ul className="space-y-2 text-sm">
              {visitsForDay.map((visit) => (
                <li
                  key={visit.id}
                  className="rounded border border-base px-3 py-2 shadow-sm dark:border-slate-800"
                >
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{visit.shipName}</p>
                  <p className="text-xs text-soft">
                    {formatDate(visit.startTime)} → {formatDate(visit.endTime)}
                  </p>
                  <div className="flex items-center justify-between text-xs text-soft">
                    <span>{visit.assetName || '—'}</span>
                    {renderStatusBadge(visit.lifecycle || visit.status)}
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{t('visitsPage.title')}</h1>
        <p className="text-sm text-soft">{t('visitsPage.subtitle')}</p>
      </header>

      <Card className="flex flex-wrap items-center gap-3 border border-base bg-surface shadow-sm dark:bg-slate-900/60">
        <span className="text-sm text-soft">{t('common.view')}</span>
        <div className="flex rounded-full border border-base">
          <button
            type="button"
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wide ${
              view === 'list' ? 'bg-sky-600 text-white' : 'text-soft'
            }`}
            onClick={() => dispatch(setVisitFilters({ view: 'list' }))}
          >
            {t('common.listView')}
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wide ${
              view === 'calendar' ? 'bg-sky-600 text-white' : 'text-soft'
            }`}
            onClick={() => dispatch(setVisitFilters({ view: 'calendar' }))}
          >
            {t('common.calendarView')}
          </button>
        </div>
        <Button variant="ghost" size="sm" onClick={loadVisits}>
          {t('common.refresh')}
        </Button>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner />
        </div>
      ) : view === 'list' ? (
        renderList()
      ) : (
        renderCalendar()
      )}

      {error && (
        <p className="rounded border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
      )}
    </div>
  );
}
