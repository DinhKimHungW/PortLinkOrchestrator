import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '../data');

const FILE_DEFAULTS = {
  users: createSeedUsers,
  assets: createSeedAssets,
  visits: createSeedVisits,
  tasks: createSeedTasks,
  schedules: createSeedSchedules,
  logs: createSeedLogs,
  incidents: createSeedIncidents,
  meta: createSeedMeta,
};

const fileLocks = new Map();

class Mutex {
  constructor() {
    this.queue = [];
    this.locked = false;
  }

  lock() {
    return new Promise((resolve) => {
      if (!this.locked) {
        this.locked = true;
        resolve();
      } else {
        this.queue.push(resolve);
      }
    });
  }

  unlock() {
    if (this.queue.length > 0) {
      const next = this.queue.shift();
      next();
    } else {
      this.locked = false;
    }
  }

  async runExclusive(fn) {
    await this.lock();
    try {
      return await fn();
    } finally {
      this.unlock();
    }
  }
}

function getLock(name) {
  if (!fileLocks.has(name)) {
    fileLocks.set(name, new Mutex());
  }
  return fileLocks.get(name);
}

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const entries = await fs.readdir(DATA_DIR).catch(() => []);
  const now = new Date().toISOString();

  await Promise.all(
    Object.keys(FILE_DEFAULTS).map(async (name) => {
      const filename = path.join(DATA_DIR, `${name}.json`);
      if (!entries.includes(`${name}.json`)) {
        const defaultValue = FILE_DEFAULTS[name]({ now });
        await fs.writeFile(filename, JSON.stringify(defaultValue, null, 2), 'utf8');
      }
    }),
  );
}

function createSeedUsers({ now }) {
  const hash = (value) => crypto.createHash('sha256').update(value).digest('hex');
  return [
    { userId: 1, username: 'admin', passwordHash: hash('admin123'), role: 'Admin', createdAt: now },
    { userId: 2, username: 'ops01', passwordHash: hash('ops123'), role: 'OPS', createdAt: now },
    { userId: 3, username: 'driver01', passwordHash: hash('driver123'), role: 'Driver', createdAt: now },
  ];
}

function createSeedAssets() {
  return [
    { assetId: 1, name: 'Berth Alpha', type: 'Berth', status: 'Active' },
    { assetId: 2, name: 'Berth Bravo', type: 'Berth', status: 'Active' },
    { assetId: 3, name: 'Berth Charlie', type: 'Berth', status: 'Maintenance' },
    { assetId: 4, name: 'Gantry Crane Atlas', type: 'Crane', status: 'Active' },
    { assetId: 5, name: 'Gantry Crane Borealis', type: 'Crane', status: 'Active' },
    { assetId: 6, name: 'Gantry Crane Cygnus', type: 'Crane', status: 'Maintenance' },
    { assetId: 7, name: 'Yard Tractor 07', type: 'Vehicle', status: 'Active' },
    { assetId: 8, name: 'Yard Tractor 12', type: 'Vehicle', status: 'Active' },
    { assetId: 9, name: 'Yard Tractor 19', type: 'Vehicle', status: 'OutOfService' },
    { assetId: 10, name: 'Warehouse North Dock', type: 'Warehouse', status: 'Active' },
    { assetId: 11, name: 'Tugboat Titan', type: 'Support', status: 'Active' },
    { assetId: 12, name: 'Tugboat Orion', type: 'Support', status: 'Idle' },
    { assetId: 13, name: 'Reefer Rack East', type: 'Storage', status: 'Active' },
    { assetId: 14, name: 'Gate Complex 3', type: 'Gate', status: 'Active' },
  ];
}

function createSeedVisits() {
  return [
    { visitId: 1, shipName: 'MV Horizon', eta_original: '2025-10-29T05:30:00Z', eta_actual: '2025-10-29T05:45:00Z', status: 'Docked' },
    { visitId: 2, shipName: 'MV Pacific Star', eta_original: '2025-10-29T08:15:00Z', eta_actual: '2025-10-29T08:20:00Z', status: 'Berthing' },
    { visitId: 3, shipName: 'MV Aurora', eta_original: '2025-10-29T11:00:00Z', eta_actual: null, status: 'Scheduled' },
    { visitId: 4, shipName: 'MV Baltic Wind', eta_original: '2025-10-29T13:00:00Z', eta_actual: '2025-10-29T13:45:00Z', status: 'Delayed' },
    { visitId: 5, shipName: 'MV Coral Reef', eta_original: '2025-10-29T14:10:00Z', eta_actual: '2025-10-29T14:05:00Z', status: 'Docked' },
    { visitId: 6, shipName: 'MV Delta Sky', eta_original: '2025-10-29T17:00:00Z', eta_actual: null, status: 'Approaching' },
    { visitId: 7, shipName: 'MV Emerald Dawn', eta_original: '2025-10-29T18:40:00Z', eta_actual: null, status: 'Scheduled' },
    { visitId: 8, shipName: 'MV Fjord Spirit', eta_original: '2025-10-29T20:10:00Z', eta_actual: null, status: 'Scheduled' },
    { visitId: 9, shipName: 'MV Glacial Bay', eta_original: '2025-10-29T22:00:00Z', eta_actual: null, status: 'Anchored' },
    { visitId: 10, shipName: 'MV Horizon II', eta_original: '2025-10-30T02:30:00Z', eta_actual: null, status: 'Planned' },
  ];
}

function createSeedTasks() {
  return [
    { taskId: 1, visitId: 1, assetId: 1, startTime: '2025-10-29T04:50:00Z', endTime: '2025-10-29T05:50:00Z', type: 'Berthing' },
    { taskId: 2, visitId: 1, assetId: 4, startTime: '2025-10-29T05:55:00Z', endTime: '2025-10-29T07:20:00Z', type: 'Unloading' },
    { taskId: 3, visitId: 1, assetId: 7, startTime: '2025-10-29T06:00:00Z', endTime: '2025-10-29T07:30:00Z', type: 'Loading' },
    { taskId: 4, visitId: 2, assetId: 2, startTime: '2025-10-29T07:45:00Z', endTime: '2025-10-29T08:45:00Z', type: 'Berthing' },
    { taskId: 5, visitId: 2, assetId: 5, startTime: '2025-10-29T08:50:00Z', endTime: '2025-10-29T10:20:00Z', type: 'Loading' },
    { taskId: 6, visitId: 2, assetId: 8, startTime: '2025-10-29T08:55:00Z', endTime: '2025-10-29T09:40:00Z', type: 'Loading' },
    { taskId: 7, visitId: 3, assetId: 1, startTime: '2025-10-29T10:30:00Z', endTime: '2025-10-29T11:30:00Z', type: 'Berthing' },
    { taskId: 8, visitId: 3, assetId: 4, startTime: '2025-10-29T11:35:00Z', endTime: '2025-10-29T13:00:00Z', type: 'Loading' },
    { taskId: 9, visitId: 3, assetId: 7, startTime: '2025-10-29T11:40:00Z', endTime: '2025-10-29T13:10:00Z', type: 'Unloading' },
    { taskId: 10, visitId: 4, assetId: 2, startTime: '2025-10-29T13:15:00Z', endTime: '2025-10-29T14:00:00Z', type: 'Berthing' },
    { taskId: 11, visitId: 4, assetId: 5, startTime: '2025-10-29T14:05:00Z', endTime: '2025-10-29T15:20:00Z', type: 'Unloading' },
    { taskId: 12, visitId: 4, assetId: 10, startTime: '2025-10-29T14:10:00Z', endTime: '2025-10-29T16:00:00Z', type: 'Loading' },
    { taskId: 13, visitId: 5, assetId: 1, startTime: '2025-10-29T14:30:00Z', endTime: '2025-10-29T15:10:00Z', type: 'Berthing' },
    { taskId: 14, visitId: 5, assetId: 4, startTime: '2025-10-29T15:15:00Z', endTime: '2025-10-29T17:00:00Z', type: 'Loading' },
    { taskId: 15, visitId: 5, assetId: 7, startTime: '2025-10-29T15:20:00Z', endTime: '2025-10-29T17:30:00Z', type: 'Unloading' },
    { taskId: 16, visitId: 6, assetId: 11, startTime: '2025-10-29T16:45:00Z', endTime: '2025-10-29T17:30:00Z', type: 'Berthing' },
    { taskId: 17, visitId: 6, assetId: 5, startTime: '2025-10-29T17:40:00Z', endTime: '2025-10-29T18:50:00Z', type: 'Loading' },
    { taskId: 18, visitId: 6, assetId: 8, startTime: '2025-10-29T17:50:00Z', endTime: '2025-10-29T19:10:00Z', type: 'Unloading' },
    { taskId: 19, visitId: 6, assetId: 14, startTime: '2025-10-29T18:05:00Z', endTime: '2025-10-29T18:40:00Z', type: 'Loading' },
    { taskId: 20, visitId: 7, assetId: 2, startTime: '2025-10-29T18:30:00Z', endTime: '2025-10-29T19:30:00Z', type: 'Berthing' },
    { taskId: 21, visitId: 7, assetId: 6, startTime: '2025-10-29T19:35:00Z', endTime: '2025-10-29T21:00:00Z', type: 'Loading' },
    { taskId: 22, visitId: 7, assetId: 3, startTime: '2025-10-29T21:05:00Z', endTime: '2025-10-29T21:40:00Z', type: 'Unloading' },
    { taskId: 23, visitId: 8, assetId: 1, startTime: '2025-10-29T20:15:00Z', endTime: '2025-10-29T21:30:00Z', type: 'Berthing' },
    { taskId: 24, visitId: 8, assetId: 4, startTime: '2025-10-29T21:40:00Z', endTime: '2025-10-29T23:10:00Z', type: 'Unloading' },
    { taskId: 25, visitId: 8, assetId: 7, startTime: '2025-10-29T21:50:00Z', endTime: '2025-10-29T23:40:00Z', type: 'Loading' },
    { taskId: 26, visitId: 9, assetId: 12, startTime: '2025-10-29T22:30:00Z', endTime: '2025-10-29T23:00:00Z', type: 'Berthing' },
    { taskId: 27, visitId: 9, assetId: 13, startTime: '2025-10-29T23:05:00Z', endTime: '2025-10-29T23:50:00Z', type: 'Loading' },
    { taskId: 28, visitId: 10, assetId: 1, startTime: '2025-10-30T02:00:00Z', endTime: '2025-10-30T03:15:00Z', type: 'Berthing' },
    { taskId: 29, visitId: 10, assetId: 4, startTime: '2025-10-30T03:20:00Z', endTime: '2025-10-30T05:00:00Z', type: 'Loading' },
    { taskId: 30, visitId: 10, assetId: 7, startTime: '2025-10-30T03:30:00Z', endTime: '2025-10-30T05:20:00Z', type: 'Unloading' },
  ];
}

function createSeedSchedules({ now }) {
  const tasks = createSeedTasks();
  const copyTasks = (items) => items.map((task) => ({ ...task }));
  return [
    {
      scheduleId: 1,
      version: 1,
      createdAt: '2025-10-28T06:00:00Z',
      isActive: false,
      tasks: copyTasks(tasks.slice(0, 15)),
    },
    {
      scheduleId: 2,
      version: 2,
      createdAt: '2025-10-29T04:00:00Z',
      isActive: false,
      tasks: copyTasks(tasks.slice(0, 27)),
    },
    {
      scheduleId: 3,
      version: 3,
      createdAt: now,
      isActive: true,
      tasks: copyTasks(tasks),
    },
  ];
}

function createSeedLogs({ now }) {
  return [
    { logId: 1, timestamp: '2025-10-28T05:00:00Z', userId: null, eventType: 'SYSTEM_INIT', description: 'Seed data created', affected_assetId: null, affected_visitId: null },
    { logId: 2, timestamp: '2025-10-29T08:25:00Z', userId: 1, eventType: 'INCIDENT_RESOLVED', description: 'Incident 5 resolved', affected_assetId: null, affected_visitId: 2 },
    { logId: 3, timestamp: '2025-10-29T12:20:00Z', userId: 1, eventType: 'TASK_CREATED', description: 'Task 11 created for visit 4', affected_assetId: 5, affected_visitId: 4 },
    { logId: 4, timestamp: '2025-10-29T14:55:00Z', userId: 1, eventType: 'INCIDENT_REPORTED', description: 'Incident 1 reported (ShipDelay)', affected_assetId: 1, affected_visitId: 4 },
    { logId: 5, timestamp: '2025-10-29T17:05:00Z', userId: 2, eventType: 'TASK_CREATED', description: 'Task 17 created for visit 6', affected_assetId: 5, affected_visitId: 6 },
    { logId: 6, timestamp: '2025-10-29T18:15:00Z', userId: 2, eventType: 'TASK_CREATED', description: 'Task 19 created for visit 6', affected_assetId: 14, affected_visitId: 6 },
    { logId: 7, timestamp: '2025-10-29T18:55:00Z', userId: 2, eventType: 'TASK_CREATED', description: 'Task 20 created for visit 7', affected_assetId: 2, affected_visitId: 7 },
    { logId: 8, timestamp: '2025-10-29T19:05:00Z', userId: 2, eventType: 'TASK_CREATED', description: 'Task 21 created for visit 7', affected_assetId: 6, affected_visitId: 7 },
    { logId: 9, timestamp: '2025-10-29T20:45:00Z', userId: 1, eventType: 'SCHEDULE_VERSION_CREATED', description: 'Schedule version 2 created (Manual adjustment)', affected_assetId: null, affected_visitId: null },
    { logId: 10, timestamp: '2025-10-29T21:15:00Z', userId: 2, eventType: 'USER_LOGIN', description: 'ops01 logged in', affected_assetId: null, affected_visitId: null },
    { logId: 11, timestamp: '2025-10-29T21:48:00Z', userId: 2, eventType: 'INCIDENT_REPORTED', description: 'Incident 2 reported (CraneDown)', affected_assetId: 6, affected_visitId: null },
    { logId: 12, timestamp: '2025-10-29T22:20:00Z', userId: 1, eventType: 'INCIDENT_RESOLVED', description: 'Incident 6 resolved', affected_assetId: 4, affected_visitId: null },
    { logId: 13, timestamp: '2025-10-29T23:10:00Z', userId: 2, eventType: 'TASK_CREATED', description: 'Task 26 created for visit 9', affected_assetId: 12, affected_visitId: 9 },
    { logId: 14, timestamp: '2025-10-29T23:55:00Z', userId: 2, eventType: 'TASK_CREATED', description: 'Task 27 created for visit 9', affected_assetId: 13, affected_visitId: 9 },
    { logId: 15, timestamp: '2025-10-30T04:30:00Z', userId: 1, eventType: 'TASK_CREATED', description: 'Task 28 created for visit 10', affected_assetId: 1, affected_visitId: 10 },
    { logId: 16, timestamp: '2025-10-30T04:35:00Z', userId: 1, eventType: 'TASK_CREATED', description: 'Task 29 created for visit 10', affected_assetId: 4, affected_visitId: 10 },
    { logId: 17, timestamp: '2025-10-30T04:40:00Z', userId: 1, eventType: 'TASK_CREATED', description: 'Task 30 created for visit 10', affected_assetId: 7, affected_visitId: 10 },
    { logId: 18, timestamp: '2025-10-30T04:58:00Z', userId: 2, eventType: 'INCIDENT_REPORTED', description: 'Incident 4 reported (Weather)', affected_assetId: null, affected_visitId: 8 },
    { logId: 19, timestamp: '2025-10-30T05:10:00Z', userId: 1, eventType: 'SCHEDULE_VERSION_CREATED', description: 'Schedule version 3 created (Recalculation)', affected_assetId: null, affected_visitId: null },
    { logId: 20, timestamp: '2025-10-30T05:12:00Z', userId: 1, eventType: 'SCHEDULE_ACTIVATED', description: 'Schedule version 3 activated (Recalculation)', affected_assetId: null, affected_visitId: null },
  ].map((log) => ({ ...log, timestamp: log.timestamp === '2025-10-30T05:12:00Z' ? now : log.timestamp }));
}

function createSeedIncidents() {
  return [
    {
      incidentId: 1,
      type: 'ShipDelay',
      affected: { visitId: 4, assetId: 1 },
      delayMinutes: 30,
      reason: 'Heavy fog at channel entrance',
      status: 'Resolved',
      createdAt: '2025-10-29T07:10:00Z',
      updatedAt: '2025-10-29T09:45:00Z',
      reportedBy: 2,
    },
    {
      incidentId: 2,
      type: 'CraneDown',
      affected: { assetId: 6 },
      delayMinutes: 45,
      reason: 'Hydraulic leak detected on boom cylinder',
      status: 'InProgress',
      createdAt: '2025-10-29T12:05:00Z',
      updatedAt: '2025-10-29T12:45:00Z',
      reportedBy: 2,
    },
    {
      incidentId: 3,
      type: 'BerthMaintenance',
      affected: { assetId: 3 },
      delayMinutes: 0,
      reason: 'Planned fender inspection',
      status: 'Open',
      createdAt: '2025-10-27T18:30:00Z',
      updatedAt: '2025-10-27T18:30:00Z',
      reportedBy: 1,
    },
    {
      incidentId: 4,
      type: 'Weather',
      affected: { visitId: 8 },
      delayMinutes: 60,
      reason: 'High winds keeping pilot boats on standby',
      status: 'Open',
      createdAt: '2025-10-29T19:20:00Z',
      updatedAt: '2025-10-29T19:20:00Z',
      reportedBy: 2,
    },
    {
      incidentId: 5,
      type: 'ShipDelay',
      affected: { visitId: 2 },
      delayMinutes: 15,
      reason: 'Pilot boarding late due to traffic',
      status: 'Resolved',
      createdAt: '2025-10-29T08:05:00Z',
      updatedAt: '2025-10-29T08:50:00Z',
      reportedBy: 1,
    },
    {
      incidentId: 6,
      type: 'CraneDown',
      affected: { assetId: 4 },
      delayMinutes: 20,
      reason: 'Sensor calibration triggered emergency stop',
      status: 'Resolved',
      createdAt: '2025-10-28T10:15:00Z',
      updatedAt: '2025-10-28T11:45:00Z',
      reportedBy: 2,
    },
  ];
}

function createSeedMeta({ now }) {
  return {
    counters: {
      users: 3,
      assets: 14,
      visits: 10,
      tasks: 30,
      schedules: 3,
      logs: 20,
      incidents: 6,
    },
    createdAt: now,
    updatedAt: now,
  };
}

async function readJson(name) {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, `${name}.json`);
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw);
}

async function writeJson(name, data) {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, `${name}.json`);
  const lock = getLock(name);
  await lock.runExclusive(async () => {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    if (name !== 'meta') {
      const meta = await readMeta();
      await writeMeta(meta);
    }
  });
}

async function readMeta() {
  return readJson('meta');
}

async function writeMeta(meta) {
  const lock = getLock('meta');
  await lock.runExclusive(async () => {
    meta.updatedAt = new Date().toISOString();
    await fs.writeFile(path.join(DATA_DIR, 'meta.json'), JSON.stringify(meta, null, 2), 'utf8');
  });
}

export async function nextId(counter) {
  const lock = getLock('meta');
  return lock.runExclusive(async () => {
    await ensureDataDir();
    const metaPath = path.join(DATA_DIR, 'meta.json');
    const raw = await fs.readFile(metaPath, 'utf8');
    const meta = JSON.parse(raw);

    if (!meta.counters) {
      meta.counters = {};
    }
    if (!Number.isInteger(meta.counters[counter])) {
      meta.counters[counter] = 0;
    }

    meta.counters[counter] += 1;
    meta.updatedAt = new Date().toISOString();

    await fs.writeFile(metaPath, JSON.stringify(meta, null, 2), 'utf8');
    return meta.counters[counter];
  });
}

export async function getCollection(name) {
  return readJson(name);
}

export async function saveCollection(name, items) {
  await writeJson(name, items);
}

export async function ensureInitialized() {
  await ensureDataDir();
}

export function dataDir() {
  return DATA_DIR;
}
