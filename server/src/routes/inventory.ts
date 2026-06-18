import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

router.post('/materials', async (req, res) => {
  try {
    const { name, category, stock, minStock, unit, price, supplierId } = req.body;
    if (!name) return res.status(400).json({ error: 'name is required' });
    const material = await prisma.material.create({
      data: {
        name,
        category: category || 'Прочее',
        stock: Number(stock) || 0,
        minStock: Number(minStock) || 0,
        unit: unit || 'шт',
        price: Number(price) || 0,
        supplierId: supplierId ? Number(supplierId) : null,
      },
    });
    res.status(201).json(material);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: String(err) });
  }
});

router.get('/materials', async (req, res) => {
  try {
    const { category } = req.query;
    const where: Record<string, unknown> = {};
    if (category) where.category = String(category);

    const all = await prisma.material.findMany({ where, include: { supplier: { select: { name: true } } }, orderBy: { name: 'asc' } });
    const materials = all;
    const lowItems = all.filter(m => m.stock < m.minStock).length;

    const stats = {
      total: all.length,
      lowItems,
      totalValue: all.reduce((s, m) => s + m.stock * m.price, 0),
    };

    res.json({ items: materials, stats });
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: String(err) });
  }
});

router.put('/materials/:id', async (req, res) => {
  try {
    const material = await prisma.material.update({ where: { id: Number(req.params.id) }, data: req.body });
    res.json(material);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: String(err) });
  }
});

router.get('/suppliers', async (_req, res) => {
  try {
    const suppliers = await prisma.supplier.findMany({ include: { _count: { select: { warehouseDocs: true } } }, orderBy: { name: 'asc' } });
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: String(err) });
  }
});

router.get('/documents', async (_req, res) => {
  try {
    const docs = await prisma.warehouseDoc.findMany({
      include: { supplier: { select: { name: true } }, lines: { include: { material: { select: { name: true } } } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: String(err) });
  }
});

router.post('/documents', async (req, res) => {
  try {
    const { type, supplierId, party, lines } = req.body;
    const lastDoc = await prisma.warehouseDoc.findFirst({ orderBy: { id: 'desc' } });
    const docNo = `ПР-${String((lastDoc?.id || 1000) + 1)}`;

    const totalSum = (lines || []).reduce((s: number, l: { qty: number; price: number }) => s + l.qty * l.price, 0);
    const doc = await prisma.warehouseDoc.create({
      data: {
        docNo,
        type,
        supplierId: supplierId ? Number(supplierId) : null,
        party,
        totalSum,
        lines: { create: (lines || []).map((l: { materialId: number; qty: number; price: number }) => ({ materialId: Number(l.materialId), qty: Number(l.qty), price: Number(l.price) })) },
      },
      include: { lines: true },
    });

    if (type === 'receipt' || type === 'dIncome') {
      for (const l of lines || []) {
        await prisma.material.update({ where: { id: Number(l.materialId) }, data: { stock: { increment: Number(l.qty) } } });
      }
    }

    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: String(err) });
  }
});

export default router;
