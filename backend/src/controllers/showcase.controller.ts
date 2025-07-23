import { Router } from 'express';
import { ShowcaseService } from '../services/showcase.service';

const router = Router();
const showcaseService = new ShowcaseService();

// 获取所有玩家秀
router.get('/', async (req, res) => {
  try {
    const showcases = await showcaseService.getAll();
    res.json(showcases);
  } catch (error) {
    res.status(500).json({ error: '获取玩家秀失败' });
  }
});

// 创建玩家秀
router.post('/', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: '请先登录' });
  }

  try {
    const showcase = await showcaseService.create({
      ...req.body,
      userId: req.user.id
    });
    res.status(201).json(showcase);
  } catch (error) {
    res.status(400).json({ error: '创建玩家秀失败' });
  }
});

// 删除玩家秀
router.delete('/:id', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: '请先登录' });
  }

  try {
    const success = await showcaseService.delete(
      parseInt(req.params.id),
      req.user.id
    );
    
    if (!success) {
      return res.status(404).json({ error: '玩家秀不存在或无权删除' });
    }
    
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: '删除玩家秀失败' });
  }
});

export default router;