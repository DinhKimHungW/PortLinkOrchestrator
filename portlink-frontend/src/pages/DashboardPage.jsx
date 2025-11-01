import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActiveSchedule, submitIncident } from '../api/scheduleService';
import { fetchLogs, getLogsExportUrl } from '../api/logService';
import { fetchKpis } from '../api/kpiService';
import { fetchAssets } from '../api/assetService';
import { fetchVisits } from '../api/visitService';
import { fetchIncidents } from '../api/incidentService';
import routes from '../constants/routes';
import ScheduleGantt from '../components/features/dashboard/ScheduleGantt';
import KpiGrid from '../components/features/dashboard/KpiGrid';
import NotificationCenter from '../components/features/dashboard/NotificationCenter';
import Dock3DScene from '../components/features/dashboard/Dock3DScene';
import IncidentForm from '../components/features/incidents/IncidentForm';
import ScheduleOverview from '../components/features/dashboard/ScheduleOverview';
import { Button, Card, useToast } from '../components/ui';
import { setSchedules, setLoading as setSchedulesLoading, setSchedulesError } from '../store/slices/scheduleSlice';
import { setLogs, setLogsLoading, setLogsError } from '../store/slices/logSlice';
import { setKpis, setKpisLoading, setKpisError } from '../store/slices/kpiSlice';
import { setAssets, setAssetsLoading, setAssetsError } from '../store/slices/assetSlice';
import { setVisits, setVisitsLoading, setVisitsError } from '../store/slices/visitSlice';
import { setIncidents, setIncidentsLoading, setIncidentsError } from '../store/slices/incidentSlice';
import useAuth from '../hooks/useAuth';
import { useTranslation } from '../i18n/LanguageProvider';
import { formatDate } from '../lib/dateUtils';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const t = useTranslation();
  const toast = useToast();

  const { items: schedules, loading: scheduleLoading, version, updatedAt, summary } = useSelector((state) => state.schedules);
  const { items: logs, loading: logsLoading } = useSelector((state) => state.logs);
  const { metrics, loading: kpisLoading } = useSelector((state) => state.kpis);
  const { items: assets } = useSelector((state) => state.assets);
  const { items: visits } = useSelector((state) => state.visits);
  const { items: incidents } = useSelector((state) => state.incidents);

  const [incidentStatus, setIncidentStatus] = useState(null);
  const [incidentSubmitting, setIncidentSubmitting] = useState(false);

  const loadSchedule = useCallback(async () => {
    dispatch(setSchedulesLoading(true));
    try {
      const data = await fetchActiveSchedule();
      if (data) {
        dispatch(
          setSchedules({
            items: data.tasks || data.items || [],
            version: data.version ?? data.scheduleVersion ?? null,
            updatedAt: data.updatedAt ?? data.generatedAt ?? data.createdAt ?? null,
            summary: data.summary ?? null,
            scheduleId: data.scheduleId ?? null,
          }),
        );
      } else {
        dispatch(setSchedules({ items: [], version: null, updatedAt: null, summary: null, scheduleId: null }));
      }
      dispatch(setSchedulesError(null));
    } catch (error) {
      const message = error?.response?.data?.message || t('toast.fetchFailed');
  dispatch(setSchedules({ items: [], version: null, updatedAt: null, summary: null, scheduleId: null }));
      dispatch(setSchedulesError(message));
      toast.push({ variant: 'error', title: t('dashboard.title'), description: message });
    } finally {
      dispatch(setSchedulesLoading(false));
    }
  }, [dispatch, t, toast]);

  const loadLogs = useCallback(async () => {
    dispatch(setLogsLoading(true));
    try {
      const data = await fetchLogs({ limit: 10 });
      dispatch(setLogs(data || []));
      dispatch(setLogsError(null));
    } catch (error) {
      const message = error?.response?.data?.message || t('toast.fetchFailed');
      dispatch(setLogs([]));
      dispatch(setLogsError(message));
      toast.push({ variant: 'error', title: t('dashboard.notificationTitle'), description: message });
    } finally {
      dispatch(setLogsLoading(false));
    }
  }, [dispatch, t, toast]);

  const loadKpis = useCallback(async () => {
    dispatch(setKpisLoading(true));
    try {
      const data = await fetchKpis();
      dispatch(setKpis(data || null));
      dispatch(setKpisError(null));
    } catch (error) {
      const message = error?.response?.data?.message || t('toast.fetchFailed');
      dispatch(setKpis(null));
      dispatch(setKpisError(message));
      toast.push({ variant: 'error', title: t('dashboard.kpiTitle'), description: message });
    } finally {
      dispatch(setKpisLoading(false));
    }
  }, [dispatch, t, toast]);

  const loadAssets = useCallback(async () => {
    dispatch(setAssetsLoading(true));
    try {
      const data = await fetchAssets();
      dispatch(setAssets(data || []));
      dispatch(setAssetsError(null));
    } catch (error) {
      const message = error?.response?.data?.message || t('toast.fetchFailed');
      dispatch(setAssets([]));
      dispatch(setAssetsError(message));
      toast.push({ variant: 'error', title: t('assetsPage.title'), description: message });
    } finally {
      dispatch(setAssetsLoading(false));
    }
  }, [dispatch, t, toast]);

  const loadVisits = useCallback(async () => {
    dispatch(setVisitsLoading(true));
    try {
      const data = await fetchVisits();
      dispatch(setVisits(data || []));
      dispatch(setVisitsError(null));
    } catch (error) {
      const message = error?.response?.data?.message || t('toast.fetchFailed');
      dispatch(setVisits([]));
      dispatch(setVisitsError(message));
      toast.push({ variant: 'error', title: t('visitsPage.title'), description: message });
    } finally {
      dispatch(setVisitsLoading(false));
    }
  }, [dispatch, t, toast]);

  const loadIncidents = useCallback(async () => {
    dispatch(setIncidentsLoading(true));
    try {
      const data = await fetchIncidents();
      dispatch(setIncidents(data || []));
      dispatch(setIncidentsError(null));
    } catch (error) {
      const message = error?.response?.data?.message || t('toast.fetchFailed');
      dispatch(setIncidents([]));
      dispatch(setIncidentsError(message));
      toast.push({ variant: 'error', title: t('incidentsPage.title'), description: message });
    } finally {
      dispatch(setIncidentsLoading(false));
    }
  }, [dispatch, t, toast]);

  useEffect(() => {
    loadSchedule();
    loadLogs();
    loadKpis();
    loadAssets();
    loadVisits();
    loadIncidents();
  }, [loadAssets, loadIncidents, loadKpis, loadLogs, loadSchedule, loadVisits]);

  const handleIncidentSubmit = useCallback(
    async (payload) => {
      setIncidentSubmitting(true);
      try {
        await submitIncident(payload);
        setIncidentStatus({ type: 'success', message: t('dashboard.incidentSuccess') });
        await Promise.all([loadSchedule(), loadLogs(), loadKpis(), loadIncidents()]);
      } catch (error) {
        const message = error?.response?.data?.message || t('dashboard.incidentError');
        setIncidentStatus({ type: 'error', message });
      } finally {
        setIncidentSubmitting(false);
      }
    },
    [loadIncidents, loadKpis, loadLogs, loadSchedule, t],
  );

  useEffect(() => {
    if (!incidentStatus) return undefined;
    const timer = setTimeout(() => setIncidentStatus(null), 5000);
    return () => clearTimeout(timer);
  }, [incidentStatus]);

  const refreshedAt = useMemo(() => formatDate(updatedAt || new Date()), [updatedAt]);

  const incidentStats = useMemo(() => {
    const total = incidents.length;
    const open = incidents.filter((incident) => incident.statusLower !== 'resolved').length;
    const resolved = total - open;
    return { total, open, resolved };
  }, [incidents]);

  const assetStats = useMemo(() => {
    const total = assets.length;
    const active = assets.filter((asset) => asset.status === 'Active').length;
    const maintenance = assets.filter((asset) => ['Maintenance', 'OutOfService'].includes(asset.status)).length;
    const idle = Math.max(total - active - maintenance, 0);
    return { total, active, maintenance, idle };
  }, [assets]);

  const scheduleStats = useMemo(() => {
    const metricsTotals = metrics?.totals || {};
    const totalTasks = summary?.totalTasks ?? metricsTotals.tasks ?? schedules.length;
    const activeNow = summary?.activeNow ?? schedules.filter((task) => task.lifecycle === 'InProgress').length;
    const assetsInUse = summary?.assetsInUse ?? metricsTotals.assets ?? new Set(schedules.map((task) => task.assetId)).size;
    const visitsCovered = summary?.visitsCovered ?? metricsTotals.visits ?? new Set(schedules.map((task) => task.visitId)).size;
    return { totalTasks, activeNow, assetsInUse, visitsCovered };
  }, [metrics, summary, schedules]);

  const nextVisit = useMemo(() => {
    const now = Date.now();
    const upcoming = visits
      .filter((visit) => {
        const start = new Date(visit.startTime).getTime();
        return !Number.isNaN(start) && start >= now;
      })
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    return upcoming[0] || null;
  }, [visits]);

  const handleScrollToIncident = useCallback(() => {
    if (typeof document === 'undefined') return;
    document.getElementById('incident-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <div className="relative isolate min-h-full space-y-10 bg-slate-950 pb-16">
      <section className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 py-12 text-white">
        <div className="absolute inset-0 opacity-30" aria-hidden>
          <div className="absolute -left-32 top-16 h-64 w-64 rounded-full bg-sky-600/40 blur-3xl" />
          <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-cyan-400/30 blur-3xl" />
        </div>
        <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-sky-200">
              Portlink orchestration
            </div>
            <h1 className="text-3xl font-semibold md:text-4xl lg:text-5xl">{t('dashboard.title')}</h1>
            <p className="max-w-xl text-sm text-sky-100 md:text-base">{t('dashboard.subTitle')}</p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-sky-200">
              <span>{t('dashboard.updatedAt', { time: refreshedAt })}</span>
              {version && <span className="rounded-full border border-sky-500 px-3 py-1 text-[11px]">Version #{version}</span>}
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
            {user && (
              <Card className="border border-white/10 bg-white/5 text-white">
                <p className="text-sm">{t('dashboard.welcome', { name: user.name || user.username || 'Operator' })}</p>
              </Card>
            )}
            <div className="flex flex-col-reverse items-end gap-3 sm:flex-row">
              <Link to={routes.report} className="text-xs uppercase tracking-wide text-sky-200 underline-offset-4 hover:underline">
                {t('report.title')}
              </Link>
              <Button onClick={handleScrollToIncident} size="lg" className="shadow-lg shadow-sky-900/40">
                {t('report.start')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 md:px-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <div className="flex flex-col gap-6">
          <Card id="incident-form" className="space-y-4 border border-sky-100/40 bg-white shadow-xl shadow-slate-900/10">
            <header className="space-y-1">
              <h2 className="text-lg font-semibold text-slate-900">{t('dashboard.incidentTitle')}</h2>
              <p className="text-sm text-slate-500">{t('report.intro')}</p>
            </header>
            <IncidentForm onSubmit={handleIncidentSubmit} assets={assets} visits={visits} submitting={incidentSubmitting} />
            {incidentStatus && (
              <div
                className={`rounded border px-3 py-2 text-sm ${
                  incidentStatus.type === 'success'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : 'border-rose-200 bg-rose-50 text-rose-700'
                }`}
              >
                {incidentStatus.message}
              </div>
            )}
          </Card>

          <NotificationCenter
            logs={logs}
            loading={logsLoading}
            onRefresh={loadLogs}
            onExport={() => {
              if (typeof window !== 'undefined') {
                window.open(getLogsExportUrl(), '_blank');
              }
            }}
          />

          <Card className="space-y-4 border border-sky-100/40 bg-white shadow-sm">
            <header className="space-y-1">
              <h3 className="text-base font-semibold text-slate-900">{t('dashboard.operationsSummary.title')}</h3>
              <p className="text-sm text-slate-500">{t('dashboard.operationsSummary.subtitle')}</p>
            </header>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded border border-slate-200 bg-slate-50 px-3 py-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">{t('dashboard.operationsSummary.incidentsLabel')}</p>
                <p className="text-2xl font-semibold text-slate-900">{incidentStats.open}</p>
                <p className="text-xs text-slate-500">
                  {t('dashboard.operationsSummary.incidentsDescription', {
                    total: incidentStats.total,
                    resolved: incidentStats.resolved,
                  })}
                </p>
              </div>
              <div className="rounded border border-slate-200 bg-slate-50 px-3 py-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">{t('dashboard.operationsSummary.assetsLabel')}</p>
                <p className="text-2xl font-semibold text-slate-900">{assetStats.active}</p>
                <p className="text-xs text-slate-500">
                  {t('dashboard.operationsSummary.assetsDescription', {
                    total: assetStats.total,
                    idle: assetStats.idle,
                    active: assetStats.active,
                  })}
                </p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded border border-slate-200 bg-slate-50 px-3 py-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">{t('dashboard.operationsSummary.scheduleLabel')}</p>
                <p className="text-2xl font-semibold text-slate-900">{scheduleStats.activeNow}</p>
                <p className="text-xs text-slate-500">
                  {t('dashboard.operationsSummary.scheduleDescription', {
                    total: scheduleStats.totalTasks,
                    assets: scheduleStats.assetsInUse,
                    visits: scheduleStats.visitsCovered,
                  })}
                </p>
              </div>
              <div className="rounded border border-slate-200 bg-slate-50 px-3 py-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">{t('dashboard.operationsSummary.maintenanceLabel')}</p>
                <p className="text-2xl font-semibold text-slate-900">{assetStats.maintenance}</p>
                <p className="text-xs text-slate-500">{t('dashboard.operationsSummary.maintenanceDescription')}</p>
              </div>
            </div>
            <div className="rounded border border-slate-200 px-3 py-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">{t('dashboard.operationsSummary.nextVisitLabel')}</p>
              {nextVisit ? (
                <div className="mt-1 space-y-1">
                  <p className="text-sm font-semibold text-slate-900">{nextVisit.shipName}</p>
                  <p className="text-xs text-slate-500">
                    {t('dashboard.operationsSummary.nextVisitDescription', {
                      time: formatDate(nextVisit.startTime),
                      berth: nextVisit.assetName || '—',
                    })}
                  </p>
                </div>
              ) : (
                <p className="mt-1 text-xs text-slate-500">{t('dashboard.operationsSummary.nextVisitEmpty')}</p>
              )}
            </div>
          </Card>

          <KpiGrid metrics={metrics} loading={kpisLoading} />
        </div>

        <div className="flex flex-col gap-6">
          <ScheduleGantt
            tasks={schedules}
            loading={scheduleLoading}
            onRefresh={() => {
              loadSchedule();
              loadKpis();
            }}
            refreshedAt={refreshedAt}
          />
          <Dock3DScene />
          <ScheduleOverview schedules={schedules} loading={scheduleLoading} version={version} updatedAt={updatedAt} />
        </div>
      </section>
    </div>
  );
}
