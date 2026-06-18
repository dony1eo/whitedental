import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

router.get('/leads', async (_req, res) => {
  try {
    const leads = await prisma.lead.findMany({
      include: { curator: { select: { name: true, color: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: String(err) });
  }
});

router.post('/leads', async (req, res) => {
  try {
    const lead = await prisma.lead.create({ data: { ...req.body, curatorId: req.body.curatorId ? Number(req.body.curatorId) : null } });
    res.status(201).json(lead);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: String(err) });
  }
});

router.patch('/leads/:id/stage', async (req, res) => {
  try {
    const { stage } = req.body;
    const lead = await prisma.lead.update({ where: { id: Number(req.params.id) }, data: { stage: Number(stage) } });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: String(err) });
  }
});

router.get('/waitlist', async (_req, res) => {
  try {
    const waitlist = await prisma.waitlist.findMany({ orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }] });
    res.json(waitlist);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: String(err) });
  }
});

router.post('/waitlist', async (req, res) => {
  try {
    const entry = await prisma.waitlist.create({ data: req.body });
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: String(err) });
  }
});

router.get('/tasks', async (_req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      include: { assignee: { select: { name: true, color: true } } },
      orderBy: [{ done: 'asc' }, { createdAt: 'asc' }],
    });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: String(err) });
  }
});

router.patch('/tasks/:id/toggle', async (req, res) => {
  try {
    const task = await prisma.task.findUnique({ where: { id: Number(req.params.id) } });
    if (!task) return res.status(404).json({ error: 'Not found' });
    const updated = await prisma.task.update({ where: { id: task.id }, data: { done: !task.done } });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: String(err) });
  }
});

export default router;
