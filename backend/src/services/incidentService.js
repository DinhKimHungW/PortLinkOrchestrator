import { getCollection, saveCollection, nextId } from '../lib/dataStore.js';
import { appendLog } from './logService.js';
import { recalculateSchedule } from './scheduleService.js';
import { badRequest } from '../lib/httpErrors.js';
import { decorateIncident, loadAssetVisitMaps } from './dataEnrichment.js';

const VALID_INCIDENT_TYPES = ['ShipDelay', 'Weather', 'CraneDown', 'BerthMaintenance'];

export async function listIncidents() {
  const incidents = await getCollection('incidents');
  const maps = await loadAssetVisitMaps({ includeUsers: true });
  return [...incidents]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((incident) => decorateIncident(incident, maps));
}

export async function createIncident({ type, affected = {}, delayMinutes = 0, reason }, user) {
  if (!type || !VALID_INCIDENT_TYPES.includes(type)) {
    throw badRequest(`type must be one of ${VALID_INCIDENT_TYPES.join(', ')}`);
  }
  if (affected.visitId && Number.isNaN(Number(affected.visitId))) {
    throw badRequest('affected.visitId must be numeric when provided');
  }
  if (affected.assetId && Number.isNaN(Number(affected.assetId))) {
    throw badRequest('affected.assetId must be numeric when provided');
  }
  if (delayMinutes && Number.isNaN(Number(delayMinutes))) {
    throw badRequest('delayMinutes must be numeric when provided');
  }

  const incidents = await getCollection('incidents');
  const incidentId = await nextId('incidents');
  const now = new Date().toISOString();
  const incident = {
    incidentId,
    type,
    affected: {
      visitId: affected.visitId ? Number(affected.visitId) : undefined,
      assetId: affected.assetId ? Number(affected.assetId) : undefined,
    },
    delayMinutes: delayMinutes ? Number(delayMinutes) : 0,
    reason: reason || null,
    status: 'Open',
    createdAt: now,
    updatedAt: now,
    reportedBy: user?.userId ?? null,
  };

  await saveCollection('incidents', [incident, ...incidents]);

  await appendLog({
    userId: user?.userId ?? null,
    eventType: 'INCIDENT_REPORTED',
    description: `Incident ${incidentId} reported (${type})`,
    affected_assetId: incident.affected.assetId ?? null,
    affected_visitId: incident.affected.visitId ?? null,
  });

  let schedule = null;
  try {
    schedule = await recalculateSchedule(
      {
        from: null,
        assets: incident.affected.assetId ? [incident.affected.assetId] : undefined,
        visitId: incident.affected.visitId,
        delayMinutes: incident.delayMinutes,
        reason: reason || `Incident ${incidentId}`,
      },
      user,
    );
  } catch (err) {
    // If recalculation fails we still accept the incident, but we rethrow after logging
    await appendLog({
      userId: user?.userId ?? null,
      eventType: 'INCIDENT_PROCESSING_FAILED',
      description: `Incident ${incidentId} processing failed: ${err.message}`,
      affected_assetId: incident.affected.assetId ?? null,
      affected_visitId: incident.affected.visitId ?? null,
    });
    throw err;
  }

  return { incident, schedule };
}
