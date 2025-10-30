import React, { useMemo } from 'react';
import Plotly from 'plotly.js-dist-min';
import createPlotlyComponent from 'react-plotly.js/factory';
import { Button, Card } from '../../ui';
import { useTranslation } from '../../../i18n/LanguageProvider';
import { formatDate } from '../../../lib/dateUtils';

const Plot = createPlotlyComponent(Plotly);

function getDurationMs(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diff = endDate.getTime() - startDate.getTime();
  return Math.max(diff, 0);
}

export default function ScheduleGantt({ tasks = [], loading, onRefresh, refreshedAt }) {
  const t = useTranslation();

  const plotData = useMemo(() => {
    if (!tasks.length) {
      return [];
    }
    const colors = ['#0ea5e9', '#6366f1', '#22c55e', '#f97316', '#f43f5e'];
    return [
      {
    type: 'bar',
    orientation: 'h',
    x: tasks.map((task) => getDurationMs(task.startTime, task.endTime)),
    base: tasks.map((task) => new Date(task.startTime)),
        y: tasks.map((task) => task.assetName || task.asset || 'Asset'),
        text: tasks.map((task) => {
          const name = task.shipName || task.title || task.taskName || 'Task';
          const asset = task.assetName || task.asset || 'Asset';
          const start = formatDate(task.startTime);
          const end = formatDate(task.endTime);
          return `${name}<br>${t('incident.affectedAsset')}: ${asset}<br>${start} - ${end}`;
        }),
        hoverinfo: 'text',
        hovertemplate: '%{text}<extra></extra>',
        marker: {
          color: tasks.map((_, idx) => colors[idx % colors.length]),
          opacity: 0.85,
        },
      },
    ];
  }, [tasks, t]);

  const layout = useMemo(
    () => ({
      barmode: 'stack',
      bargap: 0.2,
      showlegend: false,
      margin: { l: 160, r: 40, t: 20, b: 60 },
      xaxis: {
        type: 'date',
        tickformat: '%H:%M',
        title: '',
      },
      yaxis: {
        automargin: true,
      },
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent',
    }),
    [],
  );

  return (
    <Card className="h-full">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{t('dashboard.ganttTitle')}</h2>
          {refreshedAt && (
            <p className="text-xs text-gray-500">{t('dashboard.updatedAt', { time: refreshedAt })}</p>
          )}
        </div>
        {onRefresh && (
          <Button variant="secondary" size="sm" onClick={onRefresh}>
            {t('dashboard.refresh')}
          </Button>
        )}
      </div>
      {loading ? (
        <div className="flex h-72 items-center justify-center text-sm text-gray-500">
          {t('dashboard.loadingSchedules')}
        </div>
      ) : tasks.length === 0 ? (
        <div className="flex h-72 items-center justify-center text-sm text-gray-500">
          {t('dashboard.noSchedules')}
        </div>
      ) : (
        <Plot data={plotData} layout={layout} style={{ width: '100%', height: 420 }} config={{ displayModeBar: false }} />
      )}
    </Card>
  );
}
