# The White Dental Clinic — Management System

Full-stack dental practice management CRM built from the Claude Design handoff.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vite + React 18 + TypeScript, TanStack Query, React Router v6, Lucide icons |
| Backend | Node.js + Express + TypeScript, Prisma ORM, SQLite (dev) |
| Auth | JWT + bcryptjs |
| Styling | PT Sans / Inter fonts, CSS custom properties (design tokens) |

## Quick Start

### Prerequisites
- Node.js 18+

### 1. Install root devDependencies (optional, for `concurrently`)
```bash
npm install
```

### 2. Start the backend
```bash
cd server
npm install          # if not done yet
npm run dev          # starts on http://localhost:3001
```

### 3. Start the frontend (new terminal)
```bash
cd client
npm install          # if not done yet
npm run dev          # starts on http://localhost:5173
```

### Default login
- **Email**: `admin@whitedental.uz`
- **Password**: `admin123`

### Or run both together
```bash
npm install          # installs concurrently
npm run dev          # starts both servers
```

## Features

| Module | Description |
|---|---|
| Dashboard | KPIs, weekly revenue chart, today's appointments, CRM funnel, low-stock alerts |
| Calendar | Day-view scheduler with doctor columns, drag-to-create (09:00–22:00) |
| Patients | Searchable patient list with card#, status, visit count |
| Patient Card | FDI 32-tooth interactive dental chart, treatment plan, payments, files, feed |
| Visits | All appointments with status filter chips |
| Treatment | Service lines with live totals, discount, doctor share |
| Finance | Cashbox entries, P&L, debtors |
| CRM | Kanban board (5 stages), drag-and-drop leads, slide-in drawer |
| Inventory | Materials stock tracking, suppliers, warehouse documents |
| Marketing | Campaign manager, patient group segments |
| Reports | Revenue by doctor bar chart, 7 report types |
| Services | Service catalog with category filter chips |
| Staff | Doctor/admin list with roles |
| Settings | RBAC permission matrix, integrations, branches |

## Trilingual
Supports **Russian (RU)**, **Uzbek (UZ)**, **English (EN)** — switch in the top bar.

## Database
SQLite at `server/prisma/dev.db`. To reseed:
```bash
cd server && npx ts-node src/seed.ts
```

To open Prisma Studio:
```bash
cd server && npx prisma studio
```

## Project Structure
```
WhiteDentalCode/
├── client/          # Vite + React frontend
│   └── src/
│       ├── layouts/ # AppLayout (sidebar + topbar)
│       ├── pages/   # 14 screen components
│       ├── components/modals/  # 4 modal dialogs
│       ├── lib/     # API client, React Query hooks, auth
│       ├── styles/  # Design tokens + app CSS
│       └── i18n.ts  # RU/UZ/EN dictionary
├── server/          # Express backend
│   └── src/
│       ├── routes/  # 12 API route modules
│       ├── lib/     # Prisma client singleton
│       └── middleware/ # JWT auth
└── design_extracted/ # Original Claude Design handoff bundle
```
