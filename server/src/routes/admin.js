import { Router } from 'express';
import { repo } from '../repository.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// One-time seed endpoint — protected by a token from env. Hit it once from the browser,
// then remove SEED_TOKEN from env (or leave it — it's a no-op until called).
router.get('/seed', async (req, res) => {
  const token = process.env.SEED_TOKEN;
  if (!token || req.query.token !== token) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const existing = await repo.list();
  if (existing.length > 0) await repo.replaceAll([]);
  const { makeSeedRows } = await import('../seedData.js');
  const rows = makeSeedRows();
  for (const r of rows) await repo.create(r);
  res.json({ ok: true, inserted: rows.length });
});

router.get('/wipe', async (req, res) => {
  const token = process.env.SEED_TOKEN;
  if (!token || req.query.token !== token) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  await repo.replaceAll([]);
  res.json({ ok: true, message: 'All feedback cleared' });
});

router.use(requireAuth);

router.delete('/responses', async (_req, res) => {
  await repo.replaceAll([]);
  res.json({ ok: true, message: 'All feedback cleared' });
});

router.get('/responses', async (req, res) => {
  const { from, to, company } = req.query;
  const rows = await repo.list({ from, to, company });
  res.json(rows);
});

router.get('/stats', async (req, res) => {
  const { from, to, company } = req.query;
  const rows = await repo.list({ from, to, company });
  res.json(computeStats(rows));
});

router.get('/export.csv', async (req, res) => {
  const rows = await repo.list(req.query);
  const csv = toCsv(rows);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="feedback.csv"');
  res.send(csv);
});

function computeStats(rows) {
  const total = rows.length;
  const avgSat =
    total === 0
      ? 0
      : rows.reduce((a, r) => a + (r.satisfactionScore || 0), 0) / total;
  const yesRec = rows.filter((r) => r.wouldRecommend === 'Yes').length;
  const retention = rows.filter((r) => r.continuePlan === 'Yes').length;
  return {
    total,
    avgSatisfaction: Number(avgSat.toFixed(2)),
    recommendationRate: total ? Math.round((yesRec / total) * 100) : 0,
    retentionIntent: total ? Math.round((retention / total) * 100) : 0,
  };
}

function toCsv(rows) {
  if (!rows.length) return '';
  const keys = Object.keys(rows[0]).filter((k) => k !== '_id' && k !== '__v');
  const esc = (v) => {
    if (v === null || v === undefined) return '';
    const s = Array.isArray(v) ? v.join('; ') : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const header = keys.join(',');
  const body = rows.map((r) => keys.map((k) => esc(r[k])).join(',')).join('\n');
  return header + '\n' + body;
}

export default router;
