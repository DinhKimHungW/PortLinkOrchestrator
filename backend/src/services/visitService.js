import { getCollection, saveCollection, nextId } from '../lib/dataStore.js';
import { appendLog } from './logService.js';
import { badRequest } from '../lib/httpErrors.js';
import { decorateVisit, decorateTasks, loadAssetVisitMaps } from './dataEnrichment.js';

export async function listVisits() {
  const [visits, tasks] = await Promise.all([getCollection('visits'), getCollection('tasks')]);
  const maps = await loadAssetVisitMaps();
  const decoratedTasks = decorateTasks(tasks, maps);
  const tasksByVisit = new Map();
  decoratedTasks.forEach((task) => {
    if (!tasksByVisit.has(task.visitId)) {
      tasksByVisit.set(task.visitId, []);
    }
    tasksByVisit.get(task.visitId).push(task);
  });
  return visits
    .map((visit) => {
      const relatedTasks = tasksByVisit.get(visit.visitId) || [];
      return decorateVisit(visit, relatedTasks, maps);
    })
    .sort((a, b) => {
      const aTime = new Date(a.startTime || 0).getTime();
      const bTime = new Date(b.startTime || 0).getTime();
      if (Number.isNaN(aTime) && Number.isNaN(bTime)) return 0;
      if (Number.isNaN(aTime)) return 1;
      if (Number.isNaN(bTime)) return -1;
      return aTime - bTime;
    });
}

export async function createVisit({ shipName, eta_original }, user) {
  if (!shipName || !eta_original) {
    throw badRequest('shipName and eta_original are required');
  }
  const eta = new Date(eta_original);
  if (Number.isNaN(eta.getTime())) {
    throw badRequest('eta_original must be a valid ISO datetime');
  }
  const visits = await getCollection('visits');
  const visitId = await nextId('visits');
  const visit = {
    visitId,
    shipName,
    eta_original: eta.toISOString(),
    eta_actual: null,
    status: 'Scheduled',
  };
  await saveCollection('visits', [...visits, visit]);
  await appendLog({
    userId: user?.userId ?? null,
    eventType: 'VISIT_CREATED',
    description: `Visit for ${shipName} scheduled`,
    affected_visitId: visitId,
  });
  const maps = await loadAssetVisitMaps();
  return decorateVisit(visit, [], maps);
}
