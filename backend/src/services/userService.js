import { getCollection } from '../lib/dataStore.js';
import { verifyPassword } from '../lib/hash.js';

export async function getUsers() {
  return getCollection('users');
}

export async function getUserById(userId) {
  const users = await getUsers();
  return users.find((user) => user.userId === Number(userId)) || null;
}

export async function getUserByUsername(username) {
  const users = await getUsers();
  return users.find((user) => user.username === username) || null;
}

export async function verifyCredentials(username, password) {
  const user = await getUserByUsername(username);
  if (!user) return null;
  if (!verifyPassword(password, user.passwordHash)) return null;
  return user;
}

export function toSafeUser(user) {
  if (!user) return null;
  const { passwordHash, ...safe } = user;
  return safe;
}
