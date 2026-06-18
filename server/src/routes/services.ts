import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    const where: Record<string, unknown> = { isActive: true };
    if (category) where.category = String(category);
    if (search) where.name = { contains: String(search) };
    const services = await prisma.service.findMany({ where, orderBy: { category: 'asc' } });
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: String(err) });
  }
});

router.post('/', async (req, res) => {
  try {
    const service = await prisma.service.create({ data: req.body });
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: String(err) });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const service = await prisma.service.update({ where: { id: Number(req.params.id) }, data: req.body });
    res.json(service);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: String(err) });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.service.update({ where: { id: Number(req.params.id) }, data: { isActive: false } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: String(err) });
  }
});

export default router;
