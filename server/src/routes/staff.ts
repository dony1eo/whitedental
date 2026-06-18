import { Router } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { role } = req.query;
    const where: Record<string, unknown> = {};
    if (role) where.role = String(role);
    const staff = await prisma.user.findMany({
      where,
      select: { id: true, name: true, email: true, phone: true, role: true, specialty: true, lastLogin: true, color: true },
      orderBy: { name: 'asc' },
    });
    res.json(staff);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: String(err) });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, email, password, role, specialty, phone, color } = req.body;
    const hashed = await bcrypt.hash(password || 'changeme123', 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role: role || 'doctor', specialty, phone, color: color || '#0787c9' },
      select: { id: true, name: true, email: true, role: true, specialty: true, color: true },
    });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: String(err) });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { password, ...data } = req.body;
    if (password) data.password = await bcrypt.hash(password, 10);
    const user = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data,
      select: { id: true, name: true, email: true, role: true, specialty: true, color: true },
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: String(err) });
  }
});

export default router;
