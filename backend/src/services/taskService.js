import { getCollection, saveCollection, nextId } from '../lib/dataStore.js';
import { appendLog } from './logService.js';
import { badRequest, conflict, notFound } from '../lib/httpErrors.js';
import { decorateTasks, loadAssetVisitMaps } from './dataEnrichment.js';

const VALID_TYPES = ['Loading', 'Unloading', 'Berthing'];

function parseDate(value, fieldName) {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) {
    throw badRequest(`${fieldName} must be a valid ISO datetime`);
  }
  return date;
}

function toIso(date) {
  return date.toISOString();
}

function overlaps(a, b) {
  const startA = new Date(a.startTime).getTime();
  const endA = new Date(a.endTime).getTime();
  const startB = new Date(b.startTime).getTime();
  const endB = new Date(b.endTime).getTime();
  return startA < endB && endA > startB;
}

export async function listTasks({ assetId, visitId, from, to }) {
  const tasks = await getCollection('tasks');
  const filtered = tasks.filter((task) => {
    if (assetId && task.assetId !== Number(assetId)) return false;
    if (visitId && task.visitId !== Number(visitId)) return false;
    if (from && new Date(task.endTime).getTime() < new Date(from).getTime()) return false;
    if (to && new Date(task.startTime).getTime() > new Date(to).getTime()) return false;
    return true;
  });
  const maps = await loadAssetVisitMaps();
  return decorateTasks(filtered, maps);
}

export async function createTask({ visitId, assetId, startTime, endTime, type }, user) {
  if (!visitId || !assetId || !startTime || !endTime || !type) {
    throw badRequest('visitId, assetId, startTime, endTime and type are required');
  }
  if (!VALID_TYPES.includes(type)) {
    throw badRequest(`type must be one of ${VALID_TYPES.join(', ')}`);
  }
  const visits = await getCollection('visits');
  const visit = visits.find((v) => v.visitId === Number(visitId));
  if (!visit) {
    throw notFound('Visit not found');
  }
  const assets = await getCollection('assets');
  const asset = assets.find((a) => a.assetId === Number(assetId));
  if (!asset) {
    throw notFound('Asset not found');
  }

  const start = parseDate(startTime, 'startTime');
  const end = parseDate(endTime, 'endTime');
  if (end.getTime() <= start.getTime()) {
    throw badRequest('endTime must be after startTime');
  }

  const tasks = await getCollection('tasks');
  const newTask = {
    taskId: await nextId('tasks'),
    visitId: Number(visitId),
    assetId: Number(assetId),
    startTime: toIso(start),
    endTime: toIso(end),
    type,
  };

  const conflicts = tasks.filter((task) => task.assetId === newTask.assetId && overlaps(task, newTask));
  if (conflicts.length > 0) {
    throw conflict('Task overlaps with existing assignment for the same asset');
  }

  await saveCollection('tasks', [...tasks, newTask]);
  await appendLog({
    userId: user?.userId ?? null,
    eventType: 'TASK_CREATED',
    description: `Task ${newTask.taskId} created for visit ${newTask.visitId}`,
    affected_assetId: newTask.assetId,
    affected_visitId: newTask.visitId,
  });
  return newTask;
}