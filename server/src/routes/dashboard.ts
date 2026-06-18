import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

router.get('/overview', async (_req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const [patientsToday, patientsYesterday, recentPayments, totalCash, appointments, allMaterials, leads, allPayments, doctors] = await Promise.all([
      prisma.patient.count({ where: { createdAt: { gte: today, lt: tomorrow } } }),
      prisma.patient.count({ where: { createdAt: { gte: yesterday, lt: today } } }),
      prisma.cashboxEntry.findMany({ where: { createdAt: { gte: today }, isIncome: true }, select: { amount: true } }),
      prisma.cashboxEntry.aggregate({ _sum: { amount: true } }),
      prisma.appointment.findMany({
        where: { startTime: { gte: today, lt: tomorrow } },
        include: { patient: { select: { firstName: true, lastName: true } }, doctor: { select: { name: true, color: true } } },
        orderBy: { startTime: 'asc' },
        take: 10,
      }),
      prisma.material.findMany({ orderBy: { stock: 'asc' }, take: 20 }),
      prisma.lead.groupBy({ by: ['stage'], _count: true }),
      prisma.payment.groupBy({ by: ['patientId'], _sum: { amount: true } }),
      prisma.user.findMany({ where: { role: 'doctor' }, select: { id: true, name: true, color: true }, take: 8 }),
    ]);

    const revenueToday = recentPayments.reduce((s, p) => s + p.amount, 0);
    const lowStock = allMaterials.filter(m => m.stock < m.minStock).slice(0, 5);
    const debtors = allPayments.filter(p => (p._sum.amount || 0) < 0).length;

    // Build doctor load from today's appointments
    const apptCountByDoctor: Record<number, number> = {};
    appointments.forEach((a: any) => {
      if (a.doctorId) apptCountByDoctor[a.doctorId] = (apptCountByDoctor[a.doctorId] || 0) + 1;
    });
    const maxAppts = Math.max(...Object.values(apptCountByDoctor), 1);
    const docLoad = doctors.map((d: any) => ({
      id: d.id, name: d.name, color: d.color,
      appts: apptCountByDoctor[d.id] || 0,
      load: Math.round(((apptCountByDoctor[d.id] || 0) / maxAppts) * 100),
    })).sort((a: any, b: any) => b.appts - a.appts);

    res.json({
      kpis: {
        revenueToday,
        cashbox: totalCash._sum.amount || 0,
        newPatients: patientsToday,
        newPatientsVsYesterday: patientsToday - patientsYesterday,
        debtors,
      },
      appointments,
      lowStock,
      leads,
      docLoad,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: String(err) });
  }
});

export default router;
