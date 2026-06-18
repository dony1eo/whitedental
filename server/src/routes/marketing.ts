import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

router.get('/campaigns', async (_req, res) => {
  try {
    const campaigns = await prisma.campaign.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: String(err) });
  }
});

router.post('/campaigns', async (req, res) => {
  try {
    const campaign = await prisma.campaign.create({ data: req.body });
    res.status(201).json(campaign);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: String(err) });
  }
});

router.get('/groups', async (_req, res) => {
  try {
    const groups = await prisma.patientGroup.findMany({ orderBy: { name: 'asc' } });
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: String(err) });
  }
});

router.post('/groups', async (req, res) => {
  try {
    const group = await prisma.patientGroup.create({ data: req.body });
    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: String(err) });
  }
});

router.get('/stats', async (_req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const [sent, groups] = await Promise.all([
      prisma.campaign.aggregate({ where: { sentAt: { gte: thirtyDaysAgo } }, _sum: { reach: true } }),
      prisma.patientGroup.count(),
    ]);
    res.json({ sent: sent._sum.reach || 0, groups, channels: 3, deliveredRate: 97.4 });
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: String(err) });
  }
});

export default router;
