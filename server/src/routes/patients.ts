import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { page = '1', limit = '20', search = '', doctorId } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { firstName: { contains: String(search) } },
        { lastName: { contains: String(search) } },
        { phone: { contains: String(search) } },
        { cardNo: { contains: String(search) } },
      ];
    }
    if (doctorId) {
      where.appointments = { some: { doctorId: Number(doctorId) } };
    }

    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { appointments: true } } },
      }),
      prisma.patient.count({ where }),
    ]);

    res.json({ items: patients, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: String(err) });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const patient = await prisma.patient.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        appointments: {
          include: { doctor: { select: { name: true, color: true } }, treatmentLines: { include: { service: true } } },
          orderBy: { startTime: 'desc' },
        },
        dentalChart: true,
        treatmentPlans: { include: { items: { include: { service: true } } } },
        payments: { orderBy: { createdAt: 'desc' } },
        documents: true,
      },
    });
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: String(err) });
  }
});

router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, middleName, gender, dateOfBirth, phone, email, source, status, notes } = req.body;

    if (!firstName || !lastName) {
      return res.status(400).json({ error: 'firstName и lastName обязательны' });
    }

    const allPatients = await prisma.patient.findMany({ select: { cardNo: true } });
    const nums = allPatients
      .map(p => parseInt(p.cardNo, 10))
      .filter(n => !isNaN(n) && n >= 2000);
    const maxCardNo = nums.length > 0 ? Math.max(...nums) : 2229;
    const cardNo = String(maxCardNo + 1);

    const patient = await prisma.patient.create({
      data: {
        firstName, lastName,
        middleName: middleName || null,
        gender: gender || 'female',
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        phone: phone || null,
        email: email || null,
        source: source || null,
        status: status || 'active',
        notes: notes || null,
        cardNo,
      },
    });
    res.status(201).json(patient);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: String(err) });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const patient = await prisma.patient.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: String(err) });
  }
});

router.patch('/:id/dental-chart', async (req, res) => {
  try {
    const { toothNo, status } = req.body;
    const tooth = await prisma.dentalTooth.upsert({
      where: { patientId_toothNo: { patientId: Number(req.params.id), toothNo: Number(toothNo) } },
      update: { status },
      create: { patientId: Number(req.params.id), toothNo: Number(toothNo), status },
    });
    res.json(tooth);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: String(err) });
  }
});

export default router;
