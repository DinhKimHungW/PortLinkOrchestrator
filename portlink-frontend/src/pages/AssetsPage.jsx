import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Button, Spinner, EmptyState, Modal } from '../components/ui';
import { fetchAssets } from '../api/assetService';
import { setAssets, setAssetsLoading, setAssetsError, setAssetFilters } from '../store/slices/assetSlice';
import { useTranslation } from '../i18n/LanguageProvider';
import { formatDate, formatDuration } from '../lib/dateUtils';

const HEALTH_THRESHOLD = {
  good: 0.66,
  warning: 0.33,
};

const UTILIZATION_WINDOW_MINUTES = 24 * 60;

export default function AssetsPage() {
  const dispatch = useDispatch();
  const t = useTranslation();
  const { items, loading, error, filters } = useSelector((state) => state.assets);
  const tasks = useSelector((state) => state.schedules.items);
  const visits = useSelector((state) => state.visits.items);
  const [selectedAsset, setSelectedAsset] = useState(null);

  const loadAssets = useCallback(async () => {
    dispatch(setAssetsLoading(true));
    try {
      const data = await fetchAssets();
      dispatch(setAssets(data || []));
    } catch (err) {
      const message = err?.response?.data?.message || t('toast.fetchFailed');
      dispatch(setAssetsError(message));
    } finally {
      dispatch(setAssetsLoading(false));
    }
  }, [dispatch, t]);

  useEffect(() => {
    loadAssets();
  }, [loadAssets]);

  const filteredAssets = useMemo(() => {
    const query = (filters.query || '').trim().toLowerCase();
    const type = filters.type || 'all';
    const status = filters.status || 'all';
    return items.filter((asset) => {
      const matchesQuery = !query || (asset.name || '').toLowerCase().includes(query);
      const matchesType = type === 'all' || asset.type === type;
      const matchesStatus = status === 'all' || asset.status === status;
      return matchesQuery && matchesType && matchesStatus;
    });
  }, [items, filters.query, filters.type, filters.status]);

  const typeOptions = useMemo(() => {
    return Array.from(new Set(items.map((asset) => asset.type).filter(Boolean))).sort();
  }, [items]);

  const statusOptions = useMemo(() => {
    return Array.from(new Set(items.map((asset) => asset.status).filter(Boolean))).sort();
  }, [items]);

  const assetMetrics = useMemo(() => {
    return filteredAssets.map((asset) => {
  const relatedTasks = tasks.filter((task) => task.assetId === asset.assetId);
  const sortedTasks = [...relatedTasks].sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
      const scheduledMinutes = relatedTasks.reduce((sum, task) => sum + (task.durationMinutes || 0), 0);
      const activeTasks = relatedTasks.filter((task) => task.lifecycle === 'InProgress').length;
      const utilization = Math.min(1, scheduledMinutes / UTILIZATION_WINDOW_MINUTES);
      let healthKey = 'good';
      if (['OutOfService'].includes(asset.status)) {
        healthKey = 'critical';
      } else if (['Maintenance', 'Idle'].includes(asset.status)) {
        healthKey = 'warning';
      } else if (utilization < HEALTH_THRESHOLD.warning) {
        healthKey = 'critical';
      } else if (utilization < HEALTH_THRESHOLD.good) {
        healthKey = 'warning';
      }
      const statusLabel = (asset.status || '').replace(/([a-z])([A-Z])/g, '$1 $2');
      const upcomingVisits = visits
        .filter((visit) => {
          const associatedIds = visit.assetIds || [];
          return associatedIds.includes(asset.assetId) || visit.primaryAssetId === asset.assetId;
        })
        .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
        .slice(0, 3);
      return {
        asset,
  relatedTasks: sortedTasks,
        activeTasks,
        utilization,
        scheduledMinutes,
        healthKey,
        upcomingVisits,
        statusLabel,
      };
    });
  }, [filteredAssets, tasks, visits]);

  const renderHealthBadge = (healthKey) => {
    const variants = {
      good: 'bg-emerald-100 text-emerald-700',
      warning: 'bg-amber-100 text-amber-700',
      critical: 'bg-rose-100 text-rose-700',
    };
    return (
      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold uppercase tracking-wide ${variants[healthKey]}`}>
        {t(`assetsPage.health.${healthKey}`)}
      </span>
    );
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{t('assetsPage.title')}</h1>
        <p className="text-sm text-soft">{t('assetsPage.subtitle')}</p>
      </header>

      <Card className="flex flex-col gap-4 border border-base bg-surface shadow-sm dark:bg-slate-900/60">
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="search"
            value={filters.query}
            onChange={(event) => dispatch(setAssetFilters({ query: event.target.value }))}
            placeholder={t('assetsPage.searchPlaceholder')}
            className="min-w-[200px] flex-1 rounded border border-base bg-transparent px-3 py-2 text-sm"
          />
          <select
            value={filters.type || 'all'}
            onChange={(event) => dispatch(setAssetFilters({ type: event.target.value }))}
            className="min-w-[160px] rounded border border-base bg-transparent px-3 py-2 text-sm"
          >
            <option value="all">{t('assetsPage.filters.allTypes')}</option>
            {typeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            value={filters.status || 'all'}
            onChange={(event) => dispatch(setAssetFilters({ status: event.target.value }))}
            className="min-w-[160px] rounded border border-base bg-transparent px-3 py-2 text-sm"
          >
            <option value="all">{t('assetsPage.filters.allStatuses')}</option>
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(setAssetFilters({ query: '', type: 'all', status: 'all' }))}
          >
            {t('incidentsPage.filters.reset')}
          </Button>
        </div>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner />
        </div>
      ) : filteredAssets.length === 0 ? (
        <EmptyState title={t('assetsPage.empty')} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {assetMetrics.map(({ asset, utilization, healthKey, relatedTasks, upcomingVisits, activeTasks, scheduledMinutes, statusLabel }) => (
            <Card
              key={asset.assetId || asset.name}
              className="flex flex-col gap-4 border border-base/60 bg-surface shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:bg-slate-900/60"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{asset.name}</h3>
                  <p className="text-xs uppercase tracking-wide text-soft">
                    #{asset.assetId} · {asset.type}
                  </p>
                  <p className="text-xs text-soft/80">{t('assetsPage.statusLabel', { status: statusLabel || asset.status || '—' })}</p>
                </div>
                {renderHealthBadge(healthKey)}
              </div>
              <dl className="grid grid-cols-2 gap-3 text-sm text-soft">
                <div>
                  <dt className="uppercase tracking-wide text-xs text-soft/80">Utilization</dt>
                  <dd className="text-base font-semibold text-slate-700 dark:text-slate-100">{Math.round(utilization * 100)}%</dd>
                </div>
                <div>
                  <dt className="uppercase tracking-wide text-xs text-soft/80">{t('assetsPage.activeTasksLabel')}</dt>
                  <dd className="text-base font-semibold text-slate-700 dark:text-slate-100">{activeTasks}</dd>
                </div>
                <div>
                  <dt className="uppercase tracking-wide text-xs text-soft/80">{t('assetsPage.minutesScheduledLabel')}</dt>
                  <dd className="text-base font-semibold text-slate-700 dark:text-slate-100">{scheduledMinutes} min</dd>
                </div>
              </dl>
              <div className="flex items-center justify-between text-xs text-soft">
                <span>{t('common.updatedAt', { time: formatDate(new Date()) })}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setSelectedAsset({
                      asset,
                      utilization,
                      healthKey,
                      relatedTasks,
                      upcomingVisits,
                      activeTasks,
                      scheduledMinutes,
                      statusLabel,
                    })
                  }
                >
                  Chi tiết
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={Boolean(selectedAsset)}
        onClose={() => setSelectedAsset(null)}
        title={t('assetsPage.detail.heading')}
      >
        {selectedAsset ? (
          <div className="space-y-4 text-sm text-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-semibold text-slate-800 dark:text-slate-100">
                  {selectedAsset.asset.name}
                </p>
                <p className="text-xs uppercase tracking-wide text-soft">
                  #{selectedAsset.asset.assetId} · {selectedAsset.asset.type}
                </p>
                <p className="text-xs text-soft/80">{t('assetsPage.statusLabel', { status: selectedAsset.statusLabel || selectedAsset.asset.status })}</p>
              </div>
              {renderHealthBadge(selectedAsset.healthKey)}
            </div>
            <dl className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <dt className="uppercase tracking-wide text-soft/80">{t('assetsPage.utilizationLabel')}</dt>
                <dd className="text-base font-semibold text-slate-700 dark:text-slate-100">
                  {Math.round(selectedAsset.utilization * 100)}%
                </dd>
              </div>
              <div>
                <dt className="uppercase tracking-wide text-soft/80">{t('assetsPage.minutesScheduledLabel')}</dt>
                <dd className="text-base font-semibold text-slate-700 dark:text-slate-100">
                  {selectedAsset.scheduledMinutes} min
                </dd>
              </div>
            </dl>
            <section>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-soft">{t('assetsPage.detail.upcomingVisits')}</h4>
              {selectedAsset.upcomingVisits.length ? (
                <ul className="mt-2 space-y-2">
                  {selectedAsset.upcomingVisits.map((visit) => (
                    <li key={visit.id} className="rounded border border-base px-3 py-2">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-100">{visit.shipName}</p>
                      <p className="text-xs text-soft">
                        {formatDate(visit.startTime)} → {formatDate(visit.endTime)}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-xs">{t('assetsPage.detail.noData')}</p>
              )}
            </section>
            <section>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-soft">{t('assetsPage.detail.recentTasks')}</h4>
              {selectedAsset.relatedTasks.length ? (
                <ul className="mt-2 space-y-2">
                  {selectedAsset.relatedTasks.slice(0, 5).map((task) => (
                    <li key={task.taskId} className="rounded border border-base px-3 py-2">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-100">
                        {task.type} · {task.shipName || t('assetsPage.detail.unknownVessel')}
                      </p>
                      <p className="text-xs text-soft">
                        {formatDate(task.startTime)} · {formatDuration(task.startTime, task.endTime)}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-xs">{t('assetsPage.detail.noData')}</p>
              )}
            </section>
          </div>
        ) : null}
      </Modal>

      {error && (
        <p className="rounded border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
      )}
    </div>
  );
}
