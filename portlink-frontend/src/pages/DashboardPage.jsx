import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActiveSchedule, submitIncident } from '../api/scheduleService';
import { fetchLogs, getLogsExportUrl } from '../api/logService';
import { fetchKpis } from '../api/kpiService';
import { fetchAssets } from '../api/assetService';
import { fetchVisits } from '../api/visitService';
import routes from '../constants/routes';
import ScheduleGantt from '../components/features/dashboard/ScheduleGantt';
import KpiGrid from '../components/features/dashboard/KpiGrid';
import NotificationCenter from '../components/features/dashboard/NotificationCenter';
import Dock3DScene from '../components/features/dashboard/Dock3DScene';
import IncidentForm from '../components/features/incidents/IncidentForm';
import ScheduleOverview from '../components/features/dashboard/ScheduleOverview';
import { Button, Card } from '../components/ui';
import { setSchedules, setLoading as setSchedulesLoading } from '../store/slices/scheduleSlice';
import { setLogs, setLogsLoading } from '../store/slices/logSlice';
import { setKpis, setKpisLoading } from '../store/slices/kpiSlice';
import { setAssets, setAssetsLoading } from '../store/slices/assetSlice';
import { setVisits, setVisitsLoading } from '../store/slices/visitSlice';
import useAuth from '../hooks/useAuth';
import { useTranslation } from '../i18n/LanguageProvider';
import { formatDate } from '../lib/dateUtils';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const t = useTranslation();

  const { items: schedules, loading: scheduleLoading, version, updatedAt } = useSelector((state) => state.schedules);
  const { items: logs, loading: logsLoading } = useSelector((state) => state.logs);
  const { metrics, loading: kpisLoading } = useSelector((state) => state.kpis);
  const { items: assets } = useSelector((state) => state.assets);
  const { items: visits } = useSelector((state) => state.visits);

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
            updatedAt: data.updatedAt || data.generatedAt || data.createdAt || null,
          }),
        );
      } else {
        dispatch(setSchedules({ items: [], version: null, updatedAt: null }));
      }
    } catch (error) {
      dispatch(setSchedules({ items: [], version: null, updatedAt: null }));
    } finally {
      dispatch(setSchedulesLoading(false));
    }
  }, [dispatch]);

  const loadLogs = useCallback(async () => {
    dispatch(setLogsLoading(true));
    try {
      const data = await fetchLogs({ limit: 10 });
      dispatch(setLogs(data || []));
    } catch (error) {
      dispatch(setLogs([]));
    } finally {
      dispatch(setLogsLoading(false));
    }
  }, [dispatch]);

  const loadKpis = useCallback(async () => {
    dispatch(setKpisLoading(true));
    try {
      const data = await fetchKpis();
      dispatch(setKpis(data || null));
    } catch (error) {
      dispatch(setKpis(null));
    } finally {
      dispatch(setKpisLoading(false));
    }
  }, [dispatch]);

  const loadAssets = useCallback(async () => {
    dispatch(setAssetsLoading(true));
    try {
      const data = await fetchAssets();
      dispatch(setAssets(data || []));
    } catch (error) {
      dispatch(setAssets([]));
    } finally {
      dispatch(setAssetsLoading(false));
    }
  }, [dispatch]);

  const loadVisits = useCallback(async () => {
    dispatch(setVisitsLoading(true));
    try {
      const data = await fetchVisits();
      dispatch(setVisits(data || []));
    } catch (error) {
      dispatch(setVisits([]));
    } finally {
      dispatch(setVisitsLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    loadSchedule();
    loadLogs();
    loadKpis();
    loadAssets();
    loadVisits();
  }, [loadAssets, loadKpis, loadLogs, loadSchedule, loadVisits]);

  const handleIncidentSubmit = useCallback(
    async (payload) => {
      setIncidentSubmitting(true);
      try {
        await submitIncident(payload);
        setIncidentStatus({ type: 'success', message: t('dashboard.incidentSuccess') });
        await Promise.all([loadSchedule(), loadLogs(), loadKpis()]);
      } catch (error) {
        const message = error?.response?.data?.message || t('dashboard.incidentError');
        setIncidentStatus({ type: 'error', message });
      } finally {
        setIncidentSubmitting(false);
      }
    },
    [loadKpis, loadLogs, loadSchedule, t],
  );

  useEffect(() => {
    if (!incidentStatus) return undefined;
    const timer = setTimeout(() => setIncidentStatus(null), 5000);
    return () => clearTimeout(timer);
  }, [incidentStatus]);

  const refreshedAt = useMemo(() => formatDate(updatedAt || new Date()), [updatedAt]);

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
