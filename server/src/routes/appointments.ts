import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { date, doctorId, status, from, to } = req.query;
    const where: Record<string, unknown> = {};

    if (date) {
      const d = new Date(String(date));
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      where.startTime = { gte: d, lt: next };
    } else if (from || to) {
      const range: Record<string, Date> = {};
      if (from) range.gte = new Date(String(from));
      if (to) { const t = new Date(String(to)); t.setDate(t.getDate() + 1); range.lt = t; }
      where.startTime = range;
    }
    if (doctorId) where.doctorId = Number(doctorId);
    if (status) where.status = String(status);

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        patient: { select: { id: true, firstName: true, lastName: true, phone: true, cardNo: true } },
        doctor: { select: { id: true, name: true, color: true, specialty: true } },
        treatmentLines: { include: { service: { select: { name: true, price: true } } } },
      },
      orderBy: { startTime: 'asc' },
    });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: String(err) });
  }
});

router.post('/', async (req, res) => {
  try {
    const { patientId, doctorId, chair, visitType, visitKind, startTime, endTime, date, time, duration, status, direction, source, comment } = req.body;

    // Support both ISO startTime/endTime and date+time+duration from NewVisitModal
    let start: Date;
    let end: Date;
    if (startTime) {
      start = new Date(startTime);
      end = endTime ? new Date(endTime) : new Date(start.getTime() + 30 * 60000);
    } else if (date && time) {
      start = new Date(`${date}T${time}:00`);
      end = new Date(start.getTime() + (Number(duration) || 30) * 60000);
    } else {
      return res.status(400).json({ error: 'startTime or date+time required' });
    }

    const appt = await prisma.appointment.create({
      data: { patientId: Number(patientId), doctorId: Number(doctorId), chair: chair || '1', visitType: visitType || 'treatment', visitKind: visitKind || 'regular', startTime: start, endTime: end, status: status || 'not_confirmed', direction, source, comment },
      include: { patient: true, doctor: true },
    });
    res.status(201).json(appt);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: String(err) });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { startTime, endTime, ...data } = req.body;
    const updateData: Record<string, unknown> = { ...data };
    if (startTime) updateData.startTime = new Date(startTime);
    if (endTime) updateData.endTime = new Date(endTime);
    const appt = await prisma.appointment.update({
      where: { id: Number(req.params.id) },
      data: updateData,
    });
    res.json(appt);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: String(err) });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.appointment.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: String(err) });
  }
});

router.post('/:id/treatment-lines', async (req, res) => {
  try {
    const { serviceId, doctorId, toothNo, qty, price, doctorPct } = req.body;
    const line = await prisma.treatmentLine.create({
      data: { appointmentId: Number(req.params.id), serviceId: Number(serviceId), doctorId: Number(doctorId), toothNo: toothNo ? Number(toothNo) : null, qty: Number(qty) || 1, price: Number(price), doctorPct: Number(doctorPct) || 30 },
      include: { service: true },
    });
    res.status(201).json(line);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: String(err) });
  }
});

export default router;
