import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

router.get('/cashbox', async (req, res) => {
  try {
    const { date } = req.query;
    const d = date ? new Date(String(date)) : new Date();
    d.setHours(0, 0, 0, 0);
    const next = new Date(d);
    next.setDate(next.getDate() + 1);

    const [entries, income, expense, balance] = await Promise.all([
      prisma.cashboxEntry.findMany({ where: { createdAt: { gte: d, lt: next } }, orderBy: { createdAt: 'asc' } }),
      prisma.cashboxEntry.aggregate({ where: { isIncome: true, createdAt: { gte: d, lt: next } }, _sum: { amount: true } }),
      prisma.cashboxEntry.aggregate({ where: { isIncome: false, createdAt: { gte: d, lt: next } }, _sum: { amount: true } }),
      prisma.cashboxEntry.aggregate({ where: { createdAt: { gte: d, lt: next } }, _sum: { amount: true } }),
    ]);

    res.json({ entries, income: income._sum.amount || 0, expense: expense._sum.amount || 0, balance: balance._sum.amount || 0 });
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: String(err) });
  }
});

router.post('/cashbox', async (req, res) => {
  try {
    const { operation, method, amount, isIncome, patientId } = req.body;
    const entry = await prisma.cashboxEntry.create({
      data: { operation, method, amount: Number(amount), isIncome: Boolean(isIncome), patientId: patientId ? Number(patientId) : null },
    });
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: String(err) });
  }
});

router.get('/debtors', async (_req, res) => {
  try {
    const payments = await prisma.payment.groupBy({
      by: ['patientId'],
      _sum: { amount: true },
    });
    const debtorIds = payments.filter(p => (p._sum.amount || 0) < 0).map(p => p.patientId);
    const patients = await prisma.patient.findMany({
      where: { id: { in: debtorIds } },
      select: { id: true, firstName: true, lastName: true, phone: true },
    });
    const debtors = patients.map(p => {
      const debt = payments.find(x => x.patientId === p.id)?._sum.amount || 0;
      return { ...p, debt: Math.abs(debt) };
    });
    res.json(debtors);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: String(err) });
  }
});

router.get('/pnl', async (req, res) => {
  try {
    const { month, year } = req.query;
    const m = month ? Number(month) - 1 : new Date().getMonth();
    const y = year ? Number(year) : new Date().getFullYear();
    const start = new Date(y, m, 1);
    const end = new Date(y, m + 1, 1);

    const [revenue, expenses] = await Promise.all([
      prisma.cashboxEntry.aggregate({ where: { isIncome: true, createdAt: { gte: start, lt: end } }, _sum: { amount: true } }),
      prisma.cashboxEntry.aggregate({ where: { isIncome: false, createdAt: { gte: start, lt: end } }, _sum: { amount: true } }),
    ]);

    const rev = revenue._sum.amount || 0;
    const exp = expenses._sum.amount || 0;
    const net = rev - exp;
    res.json({ revenue: rev, expenses: exp, netProfit: net, margin: rev > 0 ? Math.round(net / rev * 100) : 0 });
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: String(err) });
  }
});

export default router;
