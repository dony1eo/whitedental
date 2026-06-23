# The White Dental Clinic — Management System

Full-stack dental practice management CRM built from the Claude Design handoff.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vite + React 18 + TypeScript, TanStack Query, React Router v6, Lucide icons |
| Backend | Laravel 13 (PHP 8.2+), Eloquent ORM, JWT (tymon/jwt-auth) |
| Database | PostgreSQL 15+ (UTF8) |
| Auth | JWT + bcrypt |
| Styling | PT Sans / Inter fonts, CSS custom properties (design tokens) |

## Quick Start

### Prerequisites
- PHP 8.2+ with `pdo_pgsql` extension
- Composer 2+
- PostgreSQL 15+ (or change `DB_CONNECTION` in `.env` to `sqlite` for local dev)
- Node.js 18+

### 1. Backend — Laravel API (port 8000)
```bash
cd laravel
cp .env.example .env             # then edit DB_* to match your PostgreSQL
composer install
php artisan key:generate
php artisan jwt:secret           # writes JWT_SECRET into .env
php artisan migrate --seed       # creates 23 tables + seeds demo data
php artisan serve --port=8000    # serves on http://127.0.0.1:8000
```

#### Configure `.env`
```
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=whitedental
DB_USERNAME=postgres
DB_PASSWORD=postgres
SESSION_DRIVER=database
QUEUE_CONNECTION=database
CACHE_STORE=database
JWT_SECRET=white-dental-jwt-secret-2026
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

#### Create the PostgreSQL database
```bash
psql -U postgres -h localhost -c "CREATE DATABASE whitedental;"
```

### 2. Frontend — Vite + React (port 5173)
```bash
cd client
npm install
npm run dev                      # serves on http://localhost:5173
```
The Vite dev server proxies `/api` and `/health` to `http://localhost:8000` (see `client/vite.config.ts`).

### Default logins
| Role | Email | Password |
|---|---|---|
| Admin | `admin@whitedental.uz` | `admin123` |
| Doctor | `feruza@whitedental.uz` | `password123` |
| Doctor | `sanzhar@whitedental.uz` | `password123` |
| Doctor | `nilufar@whitedental.uz` | `password123` |
| Doctor | `bekhzod@whitedental.uz` | `password123` |
| Doctor | `dilnoza@whitedental.uz` | `password123` |
| Admin | `doniyor@whitedental.uz` | (reset via admin UI) |

Reset all doctor passwords in one shot:
```bash
php artisan db:reset-doctor-passwords --password=password123
```

## Features

| Module | Description |
|---|---|
| Dashboard | KPIs, weekly revenue chart, today's appointments, CRM funnel, low-stock alerts |
| Calendar | Day-view scheduler with doctor columns, drag-to-create (09:00–22:00) |
| Patients | Searchable patient list with card#, status, visit count; add/edit modal |
| Patient Card | FDI 32-tooth interactive dental chart, treatment plan, payments, files, feed |
| Visits | All appointments with status filter chips, clickable patient search |
| Treatment | Service lines with live totals, discount, doctor share |
| Finance | Cashbox entries, P&L, debtors |
| CRM | Kanban board (5 stages), drag-and-drop leads, slide-in drawer |
| Inventory | Materials stock tracking, suppliers, warehouse documents, low-stock alerts |
| Marketing | Campaign manager, patient group segments |
| Reports | Revenue by doctor bar chart, 7 report types |
| Services | Service catalog with category filter chips |
| Staff | Doctor/admin list with roles, edit modal with password reset |
| Settings | RBAC permission matrix, integrations, branches |

## Trilingual
Supports **Russian (RU)**, **Uzbek (UZ)**, **English (EN)** — switch in the top bar.

## Database
PostgreSQL 15+ (UTF8). 23 migrations create the full schema; 15 seeders populate demo data:
```bash
php artisan migrate:fresh --seed    # wipe + recreate + seed
```

### Migrating from the legacy SQLite backend
The repo includes a one-shot migration tool for the original Express + Prisma + SQLite backend (`server/`):
```bash
php artisan db:migrate-legacy-sqlite            # copies all rows
php artisan db:migrate-legacy-sqlite --dry-run # preview without writing
```
It reads `laravel/database/database.sqlite` via the temporary `sqlite_legacy` connection (already wired in `config/database.php`) and inserts rows into the default PostgreSQL connection, resetting PK sequences with `setval(...)`.

### Helper Artisan commands
| Command | Description |
|---|---|
| `php artisan db:reset-doctor-passwords {--password=...}` | Reset password for every `role=doctor` user (default `password123`) |
| `php artisan db:migrate-legacy-sqlite {--dry-run}` | Copy rows from legacy `database.sqlite` into PostgreSQL |

## Project Structure
```
WhiteDentalCode/
├── client/                   # Vite + React frontend
│   └── src/
│       ├── layouts/          # AppLayout (sidebar + topbar)
│       ├── pages/            # Dashboard, Calendar, Patients, Visits, Treatment,
│       │                     #   Finance, CRM, Inventory, Marketing, Reports,
│       │                     #   Services, Staff, Settings, etc.
│       ├── components/modals/# Add patient, new visit, waitlist, staff, service…
│       ├── lib/              # API client, React Query hooks, auth helpers
│       ├── styles/           # Design tokens + app CSS
│       └── i18n.ts           # RU/UZ/EN dictionary
├── laravel/                  # Laravel 13 backend (PHP 8.2, Eloquent, JWT)
│   ├── app/
│   │   ├── Console/Commands/ # MigrateLegacySqlite, ResetDoctorPasswords
│   │   ├── Http/Controllers/Api/  # 12 API controllers
│   │   ├── Http/Middleware/  # JwtMiddleware
│   │   └── Models/           # 20 Eloquent models
│   ├── database/
│   │   ├── migrations/       # 23 migrations
│   │   └── seeders/          # 15 seeders
│   ├── routes/api.php        # all API routes (auth, patients, appointments,…)
│   └── .env.example
├── server/                   # Legacy Express + Prisma + TypeScript backend
│                              # (superseded by laravel/, kept for reference)
├── design_extracted/         # Original Claude Design handoff bundle
└── README.md
```

## API Overview
| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/me` | Current user |
| GET | `/api/dashboard/overview` | KPIs, today's appointments, low-stock, leads |
| CRUD | `/api/patients` | Patients list / create / update |
| CRUD | `/api/appointments` | Visits / treatment lines |
| CRUD | `/api/services` | Service catalog |
| CRUD | `/api/staff` | Doctors and staff (edit + password reset) |
| GET/POST | `/api/finance/cashbox`, `/api/finance/debtors`, `/api/finance/pnl` | Finance |
| GET/POST | `/api/inventory/materials`, `/api/inventory/suppliers`, `/api/inventory/documents` | Inventory |
| GET/POST | `/api/crm/leads`, `/api/crm/waitlist`, `/api/crm/tasks` | CRM |
| GET/POST | `/api/marketing/campaigns`, `/api/marketing/groups` | Marketing |
| GET | `/api/reports/by-doctor`, `/api/reports/by-service`, `/api/reports/patients` | Reports |
| GET/POST | `/api/settings/branches`, `/api/settings/rbac` | Settings |
| GET | `/health` | Laravel health check |

All `/api/*` routes except `/auth/login` and `/auth/me` require a `Authorization: Bearer <token>` header.