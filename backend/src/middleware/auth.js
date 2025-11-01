import jwt from 'jsonwebtoken';
import { unauthorized, forbidden } from '../lib/httpErrors.js';
import { getUserById } from '../services/userService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export async function authenticate(req, _res, next) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) {
    return next(unauthorized());
  }

  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await getUserById(Number(payload.sub));
    if (!user) {
      return next(unauthorized());
    }
    req.user = { userId: user.userId, username: user.username, role: user.role };
    return next();
  } catch (err) {
    return next(unauthorized());
  }
}

export function authorize(roles) {
  const allowed = Array.isArray(roles) ? roles : [roles];
  return (req, _res, next) => {
    if (!req.user) {
      return next(unauthorized());
    }
    if (allowed.length === 0 || allowed.includes(req.user.role)) {
      return next();
    }
    return next(forbidden());
  };
}
