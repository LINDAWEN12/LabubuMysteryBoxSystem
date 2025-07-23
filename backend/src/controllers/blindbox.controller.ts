import { Router } from 'express';
import { BlindBoxService } from '../services/blindbox.service';

const router = Router();
const service = new BlindBoxService();

router.post('/:id/draw', async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  
  const result = await service.draw(
    parseInt(req.params.id),
    req.user.id
  );
  
  res.json(result);
});

export default router;