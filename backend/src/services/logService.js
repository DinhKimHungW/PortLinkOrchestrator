import { getCollection, saveCollection, nextId } from '../lib/dataStore.js';

const MAX_LOGS = 2000;

export async function appendLog({ userId = null, eventType, description, affected_assetId = null, affected_visitId = null }) {
  const logs = await getCollection('logs');
  const logId = await nextId('logs');
  const record = {
    logId,
    timestamp: new Date().toISOString(),
    userId,
    eventType,
    description,
    affected_assetId,
    affected_visitId,
  };
  const updated = [record, ...logs];
  await saveCollection('logs', updated.slice(0, MAX_LOGS));
  return record;
}

export async function getLogs({ limit = 50, from, to, type }) {
  const logs = await getCollection('logs');
  let filtered = logs;
  if (from) {
    const fromDate = new Date(from).getTime();
    filtered = filtered.filter((log) => new Date(log.timestamp).getTime() >= fromDate);
  }
  if (to) {
    const toDate = new Date(to).getTime();
    filtered = filtered.filter((log) => new Date(log.timestamp).getTime() <= toDate);
  }
  if (type) {
    filtered = filtered.filter((log) => log.eventType === type);
  }
  return filtered.slice(0, Math.max(1, Math.min(200, Number(limit) || 50)));
}

export async function getAllLogs() {
  return getCollection('logs');
}
