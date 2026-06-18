import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

router.get('/by-doctor', async (req, res) => {
  try {
    const { month, year } = req.query;
    const m = month ? Number(month) - 1 : new Date().getMonth();
    const y = year ? Number(year) : new Date().getFullYear();
    const start = new Date(y, m, 1);
    const end = new Date(y, m + 1, 1);

    const lines = await prisma.treatmentLine.groupBy({
      by: ['doctorId'],
      where: { createdAt: { gte: start, lt: end } },
      _sum: { price: true },
    });

    const doctors = await prisma.user.findMany({
      where: { id: { in: lines.map(l => l.doctorId) } },
      select: { id: true, name: true, color: true },
    });

    const result = doctors.map(d => ({
      ...d,
      revenue: lines.find(l => l.doctorId === d.id)?._sum.price || 0,
    })).sort((a, b) => b.revenue - a.revenue);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: String(err) });
  }
});

router.get('/by-service', async (req, res) => {
  try {
    const lines = await prisma.treatmentLine.groupBy({
      by: ['serviceId'],
      _sum: { price: true },
      orderBy: { _sum: { price: 'desc' } },
      take: 10,
    });
    const services = await prisma.service.findMany({
      where: { id: { in: lines.map(l => l.serviceId) } },
      select: { id: true, name: true, category: true },
    });
    const result = services.map(s => ({
      ...s,
      revenue: lines.find(l => l.serviceId === s.id)?._sum.price || 0,
    })).sort((a, b) => b.revenue - a.revenue);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: String(err) });
  }
});

router.get('/patients', async (req, res) => {
  try {
    const { month, year } = req.query;
    const m = month ? Number(month) - 1 : new Date().getMonth();
    const y = year ? Number(year) : new Date().getFullYear();
    const start = new Date(y, m, 1);
    const end = new Date(y, m + 1, 1);
    const [newPatients, returning] = await Promise.all([
      prisma.patient.count({ where: { createdAt: { gte: start, lt: end } } }),
      prisma.appointment.groupBy({
        by: ['patientId'],
        where: { startTime: { gte: start, lt: end } },
        having: { patientId: { _count: { gt: 1 } } },
      }),
    ]);
    res.json({ newPatients, returning: returning.length });
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: String(err) });
  }
});

export default router;
