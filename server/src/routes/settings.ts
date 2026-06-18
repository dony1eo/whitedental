import { Router } from 'express';
import prisma from '../lib/prisma';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const router = Router();

const DATA_DIR = join(__dirname, '../../data');
const RBAC_FILE = join(DATA_DIR, 'rbac.json');

function readRbac(): Record<string, unknown> | null {
  try {
    if (existsSync(RBAC_FILE)) return JSON.parse(readFileSync(RBAC_FILE, 'utf8'));
  } catch { /* ignore */ }
  return null;
}

function writeRbac(data: unknown): void {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(RBAC_FILE, JSON.stringify(data, null, 2), 'utf8');
}

router.get('/branches', async (_req, res) => {
  try {
    const branches = await prisma.branch.findMany({ orderBy: [{ isMain: 'desc' }, { name: 'asc' }] });
    res.json(branches);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: String(err) });
  }
});

router.post('/branches', async (req, res) => {
  try {
    const branch = await prisma.branch.create({ data: req.body });
    res.status(201).json(branch);
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: String(err) });
  }
});

router.get('/rbac', (_req, res) => {
  const data = readRbac();
  if (data) return res.json(data);
  res.json(null);
});

router.post('/rbac', (req, res) => {
  try {
    writeRbac(req.body);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: String(err) });
  }
});

router.get('/integrations', async (_req, res) => {
  const integrations = [
    { name: 'Telegram Bot API', icon: 'send', connected: true },
    { name: 'WhatsApp Business API', icon: 'message-circle', connected: true },
    { name: 'Eskiz / PlayMobile (SMS)', icon: 'message-square', connected: true },
    { name: 'Payme', icon: 'credit-card', connected: true },
    { name: 'Click', icon: 'credit-card', connected: false },
    { name: 'Uzcard', icon: 'credit-card', connected: false },
    { name: 'Фискальная касса (ОФД.uz)', icon: 'receipt', connected: true },
    { name: 'Zadarma (IP-телефония)', icon: 'phone', connected: false },
  ];
  res.json(integrations);
});

export default router;
