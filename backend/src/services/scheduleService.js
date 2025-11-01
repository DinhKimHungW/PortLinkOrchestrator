import { getCollection, saveCollection, nextId } from '../lib/dataStore.js';
import { appendLog } from './logService.js';
import { notFound, badRequest } from '../lib/httpErrors.js';
import { decorateTasks, summarizeTaskSet, loadAssetVisitMaps } from './dataEnrichment.js';

function cloneTasks(tasks) {
  return tasks.map((task) => ({ ...task }));
}

function shiftIso(isoString, minutes) {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;
  date.setMinutes(date.getMinutes() + minutes);
  return date.toISOString();
}

export async function getSchedules() {
  return getCollection('schedules');
}

export async function getActiveSchedule() {
  let schedules = await getSchedules();
  let active = schedules.find((schedule) => schedule.isActive);
  if (!active) {
    const tasks = await getCollection('tasks');
    const now = new Date().toISOString();
    const scheduleId = await nextId('schedules');
    active = {
      scheduleId,
      version: 1,
      createdAt: now,
      isActive: true,
      tasks,
    };
    schedules = [...schedules, active];
    await saveCollection('schedules', schedules);
  }
  return active;
}

export async function getScheduleWindow({ from, to }) {
  const active = await getActiveSchedule();
  const fromTime = from ? new Date(from).getTime() : null;
  const toTime = to ? new Date(to).getTime() : null;
  const tasks = active.tasks.filter((task) => {
    const start = new Date(task.startTime).getTime();
    const end = new Date(task.endTime).getTime();
    if (fromTime && end < fromTime) return false;
    if (toTime && start > toTime) return false;
    return true;
  });
  return { scheduleId: active.scheduleId, version: active.version, tasks };
}

async function createScheduleVersion(tasks, user, reason) {
  const schedules = await getSchedules();
  const scheduleId = await nextId('schedules');
  const version = schedules.reduce((max, schedule) => Math.max(max, schedule.version || 0), 0) + 1;
  const now = new Date().toISOString();
  const newSchedule = {
    scheduleId,
    version,
    createdAt: now,
    isActive: false,
    tasks: cloneTasks(tasks),
  };
  await saveCollection('schedules', [...schedules, newSchedule]);
  await appendLog({
    userId: user?.userId ?? null,
    eventType: 'SCHEDULE_VERSION_CREATED',
    description: `Schedule version ${version} created${reason ? ` (${reason})` : ''}`,
  });
  return newSchedule;
}

export async function setActiveSchedule(scheduleId, user, { reason } = {}) {
  const schedules = await getSchedules();
  const index = schedules.findIndex((schedule) => schedule.scheduleId === Number(scheduleId));
  if (index === -1) {
    throw notFound('Schedule not found');
  }
  const updatedSchedules = schedules.map((schedule, idx) => ({
    ...schedule,
    isActive: idx === index,
  }));
  await saveCollection('schedules', updatedSchedules);
  await saveCollection('tasks', cloneTasks(updatedSchedules[index].tasks));
  await appendLog({
    userId: user?.userId ?? null,
    eventType: 'SCHEDULE_ACTIVATED',
    description: `Schedule version ${updatedSchedules[index].version} activated${reason ? ` (${reason})` : ''}`,
  });
  return updatedSchedules[index];
}

export async function activateSchedule(scheduleId, user) {
  return setActiveSchedule(scheduleId, user);
}

export async function recalculateSchedule({ from, assets, visitId, delayMinutes, reason }, user) {
  const currentTasks = await getCollection('tasks');
  let updatedTasks = cloneTasks(currentTasks);

  if (visitId && delayMinutes) {
    const delay = Number(delayMinutes);
    if (Number.isNaN(delay)) {
      throw badRequest('delayMinutes must be numeric');
    }
    updatedTasks = updatedTasks.map((task) => {
      if (task.visitId === Number(visitId)) {
        return {
          ...task,
          startTime: shiftIso(task.startTime, delay),
          endTime: shiftIso(task.endTime, delay),
        };
      }
      return task;
    });
  }

  if (from) {
    const boundary = new Date(from).getTime();
    if (Number.isNaN(boundary)) {
      throw badRequest('from must be a valid ISO datetime');
    }
    updatedTasks = updatedTasks.map((task) => {
      if (new Date(task.startTime).getTime() >= boundary) {
        return {
          ...task,
          startTime: shiftIso(task.startTime, 10),
          endTime: shiftIso(task.endTime, 10),
        };
      }
      return task;
    });
  }

  if (Array.isArray(assets) && assets.length > 0) {
    const numericAssets = assets.map((asset) => Number(asset));
    updatedTasks = updatedTasks.map((task) => {
      if (numericAssets.includes(task.assetId)) {
        return {
          ...task,
          startTime: shiftIso(task.startTime, 5),
          endTime: shiftIso(task.endTime, 5),
        };
      }
      return task;
    });
  }

  await saveCollection('tasks', updatedTasks);
  const newSchedule = await createScheduleVersion(updatedTasks, user, reason || 'Recalculation');
  const active = await setActiveSchedule(newSchedule.scheduleId, user, { reason: reason || 'Recalculation' });
  return active;
}

export async function enrichSchedule(schedule) {
  if (!schedule) {
    return schedule;
  }
  const maps = await loadAssetVisitMaps();
  const tasks = decorateTasks(schedule.tasks || [], maps);
  const summary = summarizeTaskSet(tasks);
  return {
    ...schedule,
    tasks,
    summary,
  };
}
