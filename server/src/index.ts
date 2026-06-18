import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

import { authMiddleware } from './middleware/auth';
import authRoutes from './routes/auth';
import patientRoutes from './routes/patients';
import appointmentRoutes from './routes/appointments';
import serviceRoutes from './routes/services';
import staffRoutes from './routes/staff';
import financeRoutes from './routes/finance';
import inventoryRoutes from './routes/inventory';
import crmRoutes from './routes/crm';
import marketingRoutes from './routes/marketing';
import reportsRoutes from './routes/reports';
import settingsRoutes from './routes/settings';
import dashboardRoutes from './routes/dashboard';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => { res.json({ status: 'ok', timestamp: new Date().toISOString() }); });

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard',   authMiddleware, dashboardRoutes);
app.use('/api/patients',    authMiddleware, patientRoutes);
app.use('/api/appointments', authMiddleware, appointmentRoutes);
app.use('/api/services',    authMiddleware, serviceRoutes);
app.use('/api/staff',       authMiddleware, staffRoutes);
app.use('/api/finance',     authMiddleware, financeRoutes);
app.use('/api/inventory',   authMiddleware, inventoryRoutes);
app.use('/api/crm',         authMiddleware, crmRoutes);
app.use('/api/marketing',   authMiddleware, marketingRoutes);
app.use('/api/reports',     authMiddleware, reportsRoutes);
app.use('/api/settings',    authMiddleware, settingsRoutes);

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// Serve built frontend
app.use(express.static(path.join(__dirname, '../../client/dist')));

// SPA catch-all — serve index.html for non-API routes
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`🦷 White Dental running on http://localhost:${PORT}`);
});

export default app;
