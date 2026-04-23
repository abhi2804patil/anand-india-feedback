import { Router } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@anandindia.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  if (email !== adminEmail || password !== adminPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign(
    { email, role: 'admin' },
    process.env.JWT_SECRET || 'dev-secret',
    { expiresIn: '7d' }
  );
  res.json({ token, user: { email, role: 'admin' } });
});

export default router;
