import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitIncident, fetchActiveSchedule } from '../api/scheduleService';
import { fetchAssets } from '../api/assetService';
import { fetchVisits } from '../api/visitService';
import IncidentForm from '../components/features/incidents/IncidentForm';
import NotificationCenter from '../components/features/dashboard/NotificationCenter';
import { Card } from '../components/ui';
import useAuth from '../hooks/useAuth';
import { useTranslation } from '../i18n/LanguageProvider';
import { setAssets, setAssetsLoading } from '../store/slices/assetSlice';
import { setVisits, setVisitsLoading } from '../store/slices/visitSlice';
import { setLogs, setLogsLoading } from '../store/slices/logSlice';
import { fetchLogs } from '../api/logService';
import { setSchedules, setLoading as setSchedulesLoading } from '../store/slices/scheduleSlice';

export default function ReportPage() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const t = useTranslation();
  const { items: assets, loading: assetsLoading } = useSelector((state) => state.assets);
  const { items: visits, loading: visitsLoading } = useSelector((state) => state.visits);
  const { items: logs, loading: logsLoading } = useSelector((state) => state.logs);
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const ensureAssets = useCallback(async () => {
    if (assets.length) return;
    dispatch(setAssetsLoading(true));
    try {
      const data = await fetchAssets();
      dispatch(setAssets(data || []));
    } catch (error) {
      dispatch(setAssets([]));
    } finally {
      dispatch(setAssetsLoading(false));
    }
  }, [assets.length, dispatch]);

  const ensureVisits = useCallback(async () => {
    if (visits.length) return;
    dispatch(setVisitsLoading(true));
    try {
      const data = await fetchVisits();
      dispatch(setVisits(data || []));
    } catch (error) {
      dispatch(setVisits([]));
    } finally {
      dispatch(setVisitsLoading(false));
    }
  }, [dispatch, visits.length]);

  const refreshLogs = useCallback(async () => {
    dispatch(setLogsLoading(true));
    try {
      const data = await fetchLogs({ limit: 5 });
      dispatch(setLogs(data || []));
    } catch (error) {
      dispatch(setLogs([]));
    } finally {
      dispatch(setLogsLoading(false));
    }
  }, [dispatch]);

  const refreshSchedule = useCallback(async () => {
    dispatch(setSchedulesLoading(true));
    try {
      const data = await fetchActiveSchedule();
      dispatch(
        setSchedules({
          items: data?.tasks || [],
          version: data?.version,
          updatedAt: data?.createdAt,
        }),
      );
    } catch (error) {
      dispatch(setSchedules([]));
    } finally {
      dispatch(setSchedulesLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    ensureAssets();
    ensureVisits();
    refreshLogs();
  }, [ensureAssets, ensureVisits, refreshLogs]);

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setStatus(null);
    try {
      await submitIncident(payload);
      setStatus({ type: 'success', message: t('dashboard.incidentSuccess') });
      refreshLogs();
      refreshSchedule();
    } catch (error) {
      const message = error?.response?.data?.message || t('dashboard.incidentError');
      setStatus({ type: 'error', message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-full flex-col bg-slate-950 text-white">
      <div className="absolute inset-0 opacity-30" aria-hidden>
        <div className="absolute -left-16 top-24 h-72 w-72 rounded-full bg-sky-500/30 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-teal-400/30 blur-3xl" />
      </div>
      <header className="relative z-10 flex flex-col gap-4 px-6 pt-12 pb-8 text-center">
        <span className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-sky-200">
          {t('report.badge')}
        </span>
        <h1 className="text-3xl font-semibold">{t('report.title')}</h1>
        <p className="text-sm text-sky-100">{t('report.intro')}</p>
        {user && (
          <p className="text-xs text-sky-200">
            {t('dashboard.welcome', { name: user.name || user.username || 'Driver' })}
          </p>
        )}
      </header>

      <main className="relative z-10 flex-1 space-y-6 px-6 pb-12">
        <Card className="space-y-5 border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur">
          <IncidentForm
            onSubmit={handleSubmit}
            assets={assets}
            visits={visits}
            submitting={submitting || assetsLoading || visitsLoading}
          />
          {status && (
            <div
              className={`rounded border px-3 py-2 text-sm ${
                status.type === 'success'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-rose-200 bg-rose-50 text-rose-700'
              }`}
            >
              {status.message}
            </div>
          )}
        </Card>

        <NotificationCenter logs={logs} loading={logsLoading} onRefresh={refreshLogs} />
      </main>
    </div>
  );
}
