import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { Card, Button, Spinner, EmptyState, ConfirmDialog, useToast, Pagination } from '../components/ui';
import IncidentForm from '../components/features/incidents/IncidentForm';
import { fetchIncidents, createIncident } from '../api/incidentService';
import {
  setIncidents,
  addIncident,
  updateIncidentStatus,
  setIncidentsLoading,
  setIncidentsError,
  setIncidentFilters,
} from '../store/slices/incidentSlice';
import { useTranslation } from '../i18n/LanguageProvider';
import { formatDate } from '../lib/dateUtils';

export default function IncidentsPage() {
  const dispatch = useDispatch();
  const t = useTranslation();
  const toast = useToast();
  const { items, loading, error, filters } = useSelector((state) => state.incidents);
  const assets = useSelector((state) => state.assets.items);
  const visits = useSelector((state) => state.visits.items);
  const [resolveTarget, setResolveTarget] = useState(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;

  const loadIncidents = useCallback(async () => {
    dispatch(setIncidentsLoading(true));
    try {
      const data = await fetchIncidents();
      dispatch(setIncidents(data || []));
    } catch (err) {
      const message = err?.response?.data?.message || t('toast.fetchFailed');
      dispatch(setIncidentsError(message));
      toast.push({ variant: 'error', title: t('incidentsPage.title'), description: message });
    } finally {
      dispatch(setIncidentsLoading(false));
    }
  }, [dispatch, t, toast]);

  useEffect(() => {
    loadIncidents();
  }, [loadIncidents]);

  const handleSubmit = useCallback(
    async (payload) => {
      try {
        const result = await createIncident(payload);
        dispatch(addIncident(result));
        toast.push({ variant: 'success', title: t('incidentsPage.newIncident'), description: t('dashboard.incidentSuccess') });
      } catch (err) {
        const message = err?.response?.data?.message || t('toast.fetchFailed');
        toast.push({ variant: 'error', title: t('incidentsPage.newIncident'), description: message });
      }
    },
    [dispatch, t, toast],
  );

  const uniqueTypes = useMemo(() => {
    return Array.from(new Set(items.map((incident) => incident.type))).filter(Boolean);
  }, [items]);

  const filteredIncidents = useMemo(() => {
    return items.filter((incident) => {
      const statusLower = incident.statusLower || incident.status?.toLowerCase?.() || '';
      const statusMatch =
        filters.status === 'all'
          ? true
          : filters.status === 'resolved'
            ? statusLower === 'resolved'
            : statusLower !== 'resolved';
      const typeMatch = filters.type === 'all' ? true : incident.type === filters.type;
      return statusMatch && typeMatch;
    });
  }, [filters, items]);

  useEffect(() => {
    setPage(1);
  }, [filters.status, filters.type, filteredIncidents.length]);

  const paginatedIncidents = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredIncidents.slice(start, start + PAGE_SIZE);
  }, [filteredIncidents, page]);

  const confirmResolve = useCallback(() => {
    if (!resolveTarget) return;
    dispatch(updateIncidentStatus({ id: resolveTarget.id, status: 'Resolved' }));
    toast.push({ variant: 'success', title: t('incidentsPage.title'), description: t('incidentsPage.resolvedToast') });
    setResolveTarget(null);
  }, [dispatch, resolveTarget, t, toast]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{t('incidentsPage.title')}</h1>
        <p className="text-sm text-soft">{t('incidentsPage.subtitle')}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
        <Card className="space-y-6 border border-base bg-surface shadow-sm dark:bg-slate-900/60">
          <div>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{t('incidentsPage.newIncident')}</h2>
            <p className="mt-1 text-sm text-soft">{t('dashboard.incidentTitle')}</p>
          </div>
          <IncidentForm onSubmit={handleSubmit} assets={assets} visits={visits} submitting={loading} />
        </Card>

        <div className="space-y-4">
          <Card className="border border-base/80 bg-surface shadow-sm dark:bg-slate-900/60">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-soft">{t('incidentsPage.filters.status')}</span>
                <select
                  value={filters.status}
                  onChange={(event) => dispatch(setIncidentFilters({ status: event.target.value }))}
                  className="rounded border border-base bg-transparent px-2 py-1"
                >
                  <option value="all">{t('incidentsPage.status.all')}</option>
                  <option value="open">{t('incidentsPage.status.open')}</option>
                  <option value="resolved">{t('incidentsPage.status.resolved')}</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-soft">{t('incidentsPage.filters.type')}</span>
                <select
                  value={filters.type}
                  onChange={(event) => dispatch(setIncidentFilters({ type: event.target.value }))}
                  className="rounded border border-base bg-transparent px-2 py-1"
                >
                  <option value="all">{t('incidentsPage.status.all')}</option>
                  {uniqueTypes.map((type) => (
                    <option key={type} value={type}>
                      {t(`incident.typeOptions.${type}`) || type}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dispatch(setIncidentFilters({ status: 'all', type: 'all' }))}
              >
                {t('incidentsPage.filters.reset')}
              </Button>
              <div className="ms-auto text-xs text-soft">
                {t('common.updatedAt', { time: formatDate(new Date()) })}
              </div>
            </div>
          </Card>

          <Card className="border border-base/60 bg-surface shadow-sm dark:bg-slate-900/60">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Spinner />
              </div>
            ) : filteredIncidents.length === 0 ? (
              <EmptyState title={t('incidentsPage.table.empty')} />
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-base/80 text-sm">
                  <thead className="text-left text-xs uppercase tracking-wide text-soft">
                    <tr>
                      <th className="px-3 py-2">{t('incidentsPage.table.time')}</th>
                      <th className="px-3 py-2">{t('incidentsPage.table.type')}</th>
                      <th className="px-3 py-2">{t('incidentsPage.table.asset')}</th>
                      <th className="px-3 py-2">{t('incidentsPage.table.visit')}</th>
                      <th className="px-3 py-2">{t('incidentsPage.table.delay')}</th>
                      <th className="px-3 py-2">{t('incident.reason')}</th>
                      <th className="px-3 py-2">{t('incidentsPage.table.status')}</th>
                      <th className="px-3 py-2" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-base/80">
                    {paginatedIncidents.map((incident) => {
                      const statusLower = incident.statusLower || incident.status?.toLowerCase?.() || '';
                      const isResolved = statusLower === 'resolved';
                      return (
                        <tr key={incident.id} className="hover:bg-slate-100/60 dark:hover:bg-slate-800/40">
                        <td className="whitespace-nowrap px-3 py-3 text-sm text-soft">
                          {formatDate(incident.createdAt)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-sm font-medium text-slate-700 dark:text-slate-100">
                          {t(`incident.typeOptions.${incident.type}`) || incident.type}
                        </td>
                        <td className="px-3 py-3 text-sm text-soft">
                          {incident?.affected?.assetId ? `#${incident.affected.assetId}` : '—'}
                        </td>
                        <td className="px-3 py-3 text-sm text-soft">
                          {incident?.affected?.visitId ? `#${incident.affected.visitId}` : '—'}
                        </td>
                        <td className="px-3 py-3 text-sm text-soft">{incident.delayMinutes ?? '--'}</td>
                        <td className="px-3 py-3 text-xs text-soft">
                          {incident.reason || '—'}
                        </td>
                        <td className="px-3 py-3 text-sm">
                          <span
                            className={clsx(
                              'inline-flex rounded-full px-2 py-1 text-xs font-semibold uppercase tracking-wide',
                              isResolved ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700',
                            )}
                          >
                            {isResolved ? t('common.resolved') : t('common.open')}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-right">
                          {!isResolved && (
                            <Button size="sm" variant="ghost" onClick={() => setResolveTarget(incident)}>
                              {t('incidentsPage.resolve')}
                            </Button>
                          )}
                        </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="mt-4">
                  <Pagination page={page} pageSize={PAGE_SIZE} total={filteredIncidents.length} onChange={setPage} />
                </div>
              </div>
            )}
            {error && (
              <p className="mt-4 rounded border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
            )}
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(resolveTarget)}
        title={t('incidentsPage.resolve')}
        description={resolveTarget?.reason}
        confirmLabel={t('incidentsPage.resolve')}
        cancelLabel={t('incident.cancel')}
        onConfirm={confirmResolve}
        onCancel={() => setResolveTarget(null)}
      />
    </div>
  );
}
