import { Router } from 'express';
import { feedbackSchema } from '../validation/feedbackSchema.js';
import { repo } from '../repository.js';

const router = Router();

router.post('/', async (req, res) => {
  const parsed = feedbackSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Validation failed', issues: parsed.error.issues });
  }
  try {
    const saved = await repo.create(parsed.data);
    res.status(201).json({
      submissionId: saved.submissionId,
      message: 'Thank you — your feedback was recorded.',
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Could not save feedback' });
  }
});

router.get('/:submissionId', async (req, res) => {
  const doc = await repo.findBySubmissionId(req.params.submissionId);
  if (!doc) return res.status(404).json({ error: 'Not found' });
  res.json(doc);
});

export default router;
