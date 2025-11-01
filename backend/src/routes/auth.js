import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { asyncHandler } from '../lib/asyncHandler.js';
import { verifyCredentials, toSafeUser } from '../services/userService.js';
import { unauthorized } from '../lib/httpErrors.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { username, password } = req.body || {};
    const user = await verifyCredentials(username, password);
    if (!user) {
      throw unauthorized('Invalid credentials');
    }
    const token = jwt.sign({ sub: user.userId, role: user.role }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ access_token: token, token_type: 'bearer', role: user.role, user: toSafeUser(user) });
  }),
);

export default router;
