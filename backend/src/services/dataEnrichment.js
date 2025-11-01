import { getCollection } from '../lib/dataStore.js';

function minutesBetween(startIso, endIso) {
  const start = new Date(startIso).getTime();
  const end = new Date(endIso).getTime();
  if (Number.isNaN(start) || Number.isNaN(end)) {
    return null;
  }
  return Math.max(0, Math.round((end - start) / 60000));
}

export async function loadAssetVisitMaps({ includeUsers = false } = {}) {
  const promises = [getCollection('assets'), getCollection('visits')];
  if (includeUsers) {
    promises.push(getCollection('users'));
  }
  const results = await Promise.all(promises);
  const assets = results[0];
  const visits = results[1];
  const users = includeUsers ? results[2] : [];
  const assetMap = new Map(assets.map((asset) => [asset.assetId, asset]));
  const visitMap = new Map(visits.map((visit) => [visit.visitId, visit]));
  const userMap = includeUsers ? new Map(users.map((user) => [user.userId, user])) : new Map();
  return { assets, visits, users, assetMap, visitMap, userMap };
}

export function decorateTask(task, { assetMap, visitMap }) {
  const asset = assetMap.get(task.assetId) || null;
  const visit = visitMap.get(task.visitId) || null;
  const startMs = new Date(task.startTime).getTime();
  const endMs = new Date(task.endTime).getTime();
  const now = Date.now();
  const durationMinutes = minutesBetween(task.startTime, task.endTime);
  let lifecycle = 'Scheduled';
  if (!Number.isNaN(startMs) && !Number.isNaN(endMs)) {
    if (now < startMs) {
      lifecycle = 'Queued';
    } else if (now > endMs) {
      lifecycle = 'Completed';
    } else {
      lifecycle = 'InProgress';
    }
  }
  return {
    ...task,
    assetName: asset?.name ?? null,
    assetType: asset?.type ?? null,
    assetStatus: asset?.status ?? null,
    shipName: visit?.shipName ?? null,
    visitStatus: visit?.status ?? null,
    etaOriginal: visit?.eta_original ?? null,
    etaActual: visit?.eta_actual ?? null,
    durationMinutes,
    lifecycle,
    isActiveNow: lifecycle === 'InProgress',
  };
}

export function decorateTasks(tasks, maps) {
  return tasks.map((task) => decorateTask(task, maps));
}

export function summarizeTaskSet(tasks) {
  const now = Date.now();
  const assetIds = new Set();
  const visitIds = new Set();
  let totalMinutes = 0;
  let earliest = null;
  let latest = null;
  let activeNow = 0;

  tasks.forEach((task) => {
    const start = new Date(task.startTime).getTime();
    const end = new Date(task.endTime).getTime();
    if (!Number.isNaN(start) && !Number.isNaN(end)) {
      totalMinutes += Math.max(0, (end - start) / 60000);
      earliest = earliest === null ? start : Math.min(earliest, start);
      latest = latest === null ? end : Math.max(latest, end);
      if (start <= now && end >= now) {
        activeNow += 1;
      }
    }
    if (task.assetId !== undefined && task.assetId !== null) {
      assetIds.add(task.assetId);
    }
    if (task.visitId !== undefined && task.visitId !== null) {
      visitIds.add(task.visitId);
    }
  });

  return {
    totalTasks: tasks.length,
    assetsInUse: assetIds.size,
    visitsCovered: visitIds.size,
    totalScheduledMinutes: Math.round(totalMinutes),
    windowStart: earliest !== null ? new Date(earliest).toISOString() : null,
    windowEnd: latest !== null ? new Date(latest).toISOString() : null,
    activeNow,
    assetIds: Array.from(assetIds),
    visitIds: Array.from(visitIds),
  };
}

export function decorateVisit(visit, relatedTasks, { assetMap }) {
  const sortedTasks = [...relatedTasks].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
  );
  const startTask = sortedTasks[0] || null;
  const endTask = sortedTasks[sortedTasks.length - 1] || null;
  const startTime = startTask?.startTime ?? visit.eta_original ?? null;
  const endTime = endTask?.endTime ?? visit.eta_actual ?? visit.eta_original ?? null;
  const assetNames = [...new Set(sortedTasks.map((task) => task.assetName).filter(Boolean))];
  const primaryAssetId = startTask?.assetId ?? null;
  const primaryAsset = primaryAssetId ? assetMap.get(primaryAssetId) || null : null;
  const totalMinutes = sortedTasks.reduce((sum, task) => sum + (task.durationMinutes ?? 0), 0);
  const startMs = startTime ? new Date(startTime).getTime() : NaN;
  const endMs = endTime ? new Date(endTime).getTime() : NaN;
  const now = Date.now();
  let lifecycle = visit.status || 'Scheduled';
  if (!Number.isNaN(startMs) && !Number.isNaN(endMs)) {
    if (now < startMs) {
      lifecycle = 'Queued';
    } else if (now > endMs) {
      lifecycle = 'Completed';
    } else {
      lifecycle = 'InProgress';
    }
  }
  return {
    ...visit,
    id: visit.visitId,
    startTime,
    endTime,
    taskCount: relatedTasks.length,
    durationMinutes: totalMinutes || null,
    assetIds: Array.from(new Set(relatedTasks.map((task) => task.assetId).filter((value) => value !== undefined))),
    assetName: assetNames.join(', ') || null,
    primaryAssetId,
    primaryAssetName: primaryAsset?.name ?? null,
    lifecycle,
  };
}

export function decorateIncident(incident, { assetMap, visitMap, userMap }) {
  const asset = incident.affected?.assetId ? assetMap.get(incident.affected.assetId) || null : null;
  const visit = incident.affected?.visitId ? visitMap.get(incident.affected.visitId) || null : null;
  const reporter = incident.reportedBy ? userMap.get(incident.reportedBy) || null : null;
  return {
    ...incident,
    id: incident.incidentId,
    assetName: asset?.name ?? null,
    assetType: asset?.type ?? null,
    assetStatus: asset?.status ?? null,
    shipName: visit?.shipName ?? null,
    visitStatus: visit?.status ?? null,
    etaOriginal: visit?.eta_original ?? null,
    etaActual: visit?.eta_actual ?? null,
    reportedByName: reporter?.username ?? null,
    statusLower: (incident.status || '').toLowerCase(),
  };
}
