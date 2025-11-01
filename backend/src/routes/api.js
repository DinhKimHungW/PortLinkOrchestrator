import { Router } from 'express';
import { stringify } from 'csv-stringify/sync';
import { asyncHandler } from '../lib/asyncHandler.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { listAssets, createAsset, updateAsset } from '../services/assetService.js';
import { listVisits, createVisit } from '../services/visitService.js';
import { listTasks, createTask } from '../services/taskService.js';
import {
  getActiveSchedule,
  getScheduleWindow,
  activateSchedule,
  recalculateSchedule,
  enrichSchedule,
} from '../services/scheduleService.js';
import { listIncidents, createIncident } from '../services/incidentService.js';
import { getLogs, getAllLogs } from '../services/logService.js';
import { getKpis } from '../services/kpiService.js';
import { badRequest } from '../lib/httpErrors.js';

const router = Router();

router.use(authenticate);

router.get(
  '/me',
  asyncHandler(async (req, res) => {
    res.json(req.user);
  }),
);

router.get(
  '/assets',
  asyncHandler(async (req, res) => {
    const { type, status } = req.query;
    const assets = await listAssets({ type, status });
    res.json(assets);
  }),
);

router.post(
  '/assets',
  authorize(['Admin']),
  asyncHandler(async (req, res) => {
    const asset = await createAsset(req.body, req.user);
    res.status(201).json(asset);
  }),
);

router.put(
  '/assets/:assetId',
  authorize(['Admin']),
  asyncHandler(async (req, res) => {
    const updated = await updateAsset(req.params.assetId, req.body || {}, req.user);
    res.json(updated);
  }),
);

router.get(
  '/visits',
  asyncHandler(async (_req, res) => {
    const visits = await listVisits();
    res.json(visits);
  }),
);

router.post(
  '/visits',
  authorize(['Admin']),
  asyncHandler(async (req, res) => {
    const visit = await createVisit(req.body || {}, req.user);
    res.status(201).json(visit);
  }),
);

router.get(
  '/tasks',
  asyncHandler(async (req, res) => {
    const tasks = await listTasks(req.query || {});
    res.json(tasks);
  }),
);

router.post(
  '/tasks',
  authorize(['Admin', 'OPS']),
  asyncHandler(async (req, res) => {
    const task = await createTask(req.body || {}, req.user);
    res.status(201).json(task);
  }),
);

router.get(
  '/schedule/active',
  asyncHandler(async (_req, res) => {
    const schedule = await getActiveSchedule();
    const enriched = await enrichSchedule(schedule);
    res.json(enriched);
  }),
);

router.get(
  '/schedule',
  authorize(['Admin', 'OPS']),
  asyncHandler(async (req, res) => {
    const schedule = await getScheduleWindow({ from: req.query.from, to: req.query.to });
    const enriched = await enrichSchedule(schedule);
    res.json(enriched);
  }),
);

router.post(
  '/schedule/activate',
  authorize(['Admin', 'OPS']),
  asyncHandler(async (req, res) => {
    const { scheduleId } = req.body || {};
    if (!scheduleId) {
      throw badRequest('scheduleId is required');
    }
    const active = await activateSchedule(scheduleId, req.user);
    res.json({ ok: true, scheduleId: active.scheduleId, version: active.version });
  }),
);

router.post(
  '/engine/recalculate',
  authorize(['Admin', 'OPS']),
  asyncHandler(async (req, res) => {
    const schedule = await recalculateSchedule(req.body || {}, req.user);
    res.status(202).json({ started: true, scheduleId: schedule.scheduleId, version: schedule.version });
  }),
);

router.get(
  '/incidents',
  authorize(['Admin', 'OPS']),
  asyncHandler(async (_req, res) => {
    const incidents = await listIncidents();
    res.json(incidents);
  }),
);

router.post(
  '/incidents',
  authorize(['Admin', 'OPS', 'Driver']),
  asyncHandler(async (req, res) => {
    const { incident, schedule } = await createIncident(req.body || {}, req.user);
    res
      .status(202)
      .json({ accepted: true, incidentId: incident.incidentId, scheduleId: schedule.scheduleId, version: schedule.version });
  }),
);

router.get(
  '/kpis',
  authorize(['Admin', 'OPS']),
  asyncHandler(async (_req, res) => {
    const kpis = await getKpis();
    res.json(kpis);
  }),
);

router.get(
  '/logs',
  authorize(['Admin', 'OPS']),
  asyncHandler(async (req, res) => {
    const { limit, from, to, type } = req.query || {};
    const logs = await getLogs({ limit, from, to, type });
    res.json(logs);
  }),
);

router.get(
  '/logs/export.csv',
  authorize(['Admin', 'OPS']),
  asyncHandler(async (_req, res) => {
    const logs = await getAllLogs();
    const records = logs.map((log) => [
      log.logId,
      log.timestamp,
      log.userId ?? '',
      log.eventType,
      log.description,
      log.affected_assetId ?? '',
      log.affected_visitId ?? '',
    ]);
    const csv = stringify(records, {
      header: true,
      columns: ['logId', 'timestamp', 'userId', 'eventType', 'description', 'affected_assetId', 'affected_visitId'],
    });
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="logs.csv"');
    res.send(csv);
  }),
);

export default router;
