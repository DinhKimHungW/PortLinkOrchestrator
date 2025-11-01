import { getCollection, saveCollection, nextId } from '../lib/dataStore.js';
import { appendLog } from './logService.js';
import { badRequest, notFound, conflict } from '../lib/httpErrors.js';

const VALID_TYPES = ['Berth', 'Crane', 'Vehicle', 'Warehouse', 'Support', 'Storage', 'Gate'];
const VALID_STATUS = ['Active', 'Maintenance', 'Idle', 'OutOfService', 'Inactive'];

export async function listAssets({ type, status }) {
  const assets = await getCollection('assets');
  return assets.filter((asset) => {
    if (type && asset.type !== type) return false;
    if (status && asset.status !== status) return false;
    return true;
  });
}

export async function createAsset({ name, type, status = 'Active' }, user) {
  if (!name || !type) {
    throw badRequest('name and type are required');
  }
  if (!VALID_TYPES.includes(type)) {
    throw badRequest(`type must be one of ${VALID_TYPES.join(', ')}`);
  }
  if (!VALID_STATUS.includes(status)) {
    throw badRequest(`status must be one of ${VALID_STATUS.join(', ')}`);
  }
  const assets = await getCollection('assets');
  const exists = assets.find((asset) => asset.name.toLowerCase() === name.toLowerCase());
  if (exists) {
    throw conflict('Asset name already exists');
  }
  const assetId = await nextId('assets');
  const asset = { assetId, name, type, status };
  await saveCollection('assets', [...assets, asset]);
  await appendLog({
    userId: user?.userId ?? null,
    eventType: 'ASSET_CREATED',
    description: `Asset ${name} created`,
    affected_assetId: assetId,
  });
  return asset;
}
export async function updateAsset(assetId, updates, user) {
  const assets = await getCollection('assets');
  const index = assets.findIndex((asset) => asset.assetId === Number(assetId));
  if (index === -1) {
    throw notFound('Asset not found');
  }
  const current = assets[index];
  const next = { ...current };
  if (updates.name) next.name = updates.name;
  if (updates.type) {
    if (!VALID_TYPES.includes(updates.type)) {
      throw badRequest(`type must be one of ${VALID_TYPES.join(', ')}`);
    }
    next.type = updates.type;
  }
  if (updates.status) {
    if (!VALID_STATUS.includes(updates.status)) {
      throw badRequest(`status must be one of ${VALID_STATUS.join(', ')}`);
    }
    next.status = updates.status;
  }
  assets[index] = next;
  await saveCollection('assets', assets);
  await appendLog({
    userId: user?.userId ?? null,
    eventType: 'ASSET_UPDATED',
    description: `Asset ${current.name} updated`,
    affected_assetId: Number(assetId),
  });
  return next;
}