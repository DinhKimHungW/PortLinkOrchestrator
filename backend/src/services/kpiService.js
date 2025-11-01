import { getCollection } from '../lib/dataStore.js';

function minutesBetween(start, end) {
  return (new Date(end).getTime() - new Date(start).getTime()) / 60000;
}

export async function getKpis() {
  const tasks = await getCollection('tasks');
  const assets = await getCollection('assets');

  const assetMap = new Map(assets.map((asset) => [asset.assetId, asset]));

  let conflictCount = 0;
  let totalAssignments = 0;

  const tasksByAsset = tasks.reduce((map, task) => {
    if (!map.has(task.assetId)) {
      map.set(task.assetId, []);
    }
    map.get(task.assetId).push(task);
    return map;
  }, new Map());

  tasksByAsset.forEach((assetTasks) => {
    assetTasks.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    for (let i = 0; i < assetTasks.length; i += 1) {
      totalAssignments += 1;
      const current = assetTasks[i];
      const currentEnd = new Date(current.endTime).getTime();
      const next = assetTasks[i + 1];
      if (next) {
        const nextStart = new Date(next.startTime).getTime();
        if (currentEnd > nextStart) {
          conflictCount += 1;
        }
      }
    }
  });

  const conflictRate = totalAssignments === 0 ? 0 : conflictCount / totalAssignments;

  const visits = await getCollection('visits');
  const tasksByVisit = tasks.reduce((map, task) => {
    if (!map.has(task.visitId)) {
      map.set(task.visitId, []);
    }
    map.get(task.visitId).push(task);
    return map;
  }, new Map());

  let waitingSum = 0;
  let waitingCount = 0;

  tasksByVisit.forEach((visitTasks) => {
    visitTasks.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    for (let i = 1; i < visitTasks.length; i += 1) {
      const prev = visitTasks[i - 1];
      const current = visitTasks[i];
      const gap = minutesBetween(prev.endTime, current.startTime);
      if (gap > 0) {
        waitingSum += gap;
        waitingCount += 1;
      }
    }
  });

  const avgWaitingMinutes = waitingCount === 0 ? 0 : waitingSum / waitingCount;

  const berthAssetIds = assets.filter((asset) => asset.type === 'Berth').map((asset) => asset.assetId);
  const dailyWindowMinutes = 24 * 60;
  const utilizationMinutes = tasks
    .filter((task) => berthAssetIds.includes(task.assetId))
    .reduce((sum, task) => sum + Math.max(0, minutesBetween(task.startTime, task.endTime)), 0);
  const berthUtilization = dailyWindowMinutes === 0 ? 0 : Math.min(1, utilizationMinutes / dailyWindowMinutes);

  return {
    conflictRate: Number(conflictRate.toFixed(2)),
    avgWaitingMinutes: Number(avgWaitingMinutes.toFixed(2)),
    berthUtilization: Number(berthUtilization.toFixed(2)),
    totals: {
      visits: visits.length,
      tasks: tasks.length,
      assets: assets.length,
    },
  };
}
