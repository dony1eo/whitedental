# White Dental — Laravel Migration Specification

## Tech Stack Target
- **Runtime:** PHP 8.5
- **Framework:** Laravel 13
- **ORM:** Eloquent (built-in)
- **Auth:** Passport + JWT (`tymon/jwt-auth` or Laravel Sanctum)
- **DB:** PostgreSQL 15+
- **Cache:** Redis 7+
- **Storage:** AWS S3 (v3 SDK)
- **CI/CD:** GitHub Actions + Docker
- **Monitoring:** Prometheus + Grafana, Sentry
- **Docs:** Swagger/OpenAPI 3.0 (L5-Swagger or Scribe)

---

## 1. DATABASE MODELS (21 models → Eloquent + Migrations)

### 1.1 users
| Column | Type | Default | Nullable |
|---|---|---|---|
| id | bigIncrements | auto | no |
| email | string(255) unique | — | no |
| name | string(255) | — | no |
| password | string(255) bcrypt | — | no |
| role | string('doctor') | doctor | no |
| specialty | string(255) | null | yes |
| phone | string(50) | null | yes |
| color | string(7) | '#0787c9' | no |
| last_login | timestamp | null | yes |
| timestamps | | | |

Relations: hasMany appointments, hasMany treatmentLines, hasMany leads (as curator), hasMany tasks (as assignee)

### 1.2 patients
| Column | Type | Default | Nullable |
|---|---|---|---|
| id | bigIncrements | auto | no |
| card_no | string(50) unique | auto | no |
| first_name | string(255) | — | no |
| last_name | string(255) | — | no |
| middle_name | string(255) | null | yes |
| gender | string('female') | female | no |
| date_of_birth | date | null | yes |
| phone | string(50) | null | yes |
| email | string(255) | null | yes |
| source | string(100) | null | yes |
| status | string('active') | active | no |
| notes | text | null | yes |
| timestamps | | | |

Relations: hasMany appointments, hasMany dentalTeeth, hasMany treatmentPlans, hasMany payments, hasMany documents, hasMany leads

### 1.3 dental_teeth
| Column | Type | Default | Nullable |
|---|---|---|---|
| id | bigIncrements | auto | no |
| patient_id | foreignId | — | no |
| tooth_no | integer | — | no |
| status | string('healthy') | healthy | no |
| notes | text | null | yes |
| updated_at | timestamp | | |

Unique: [patient_id, tooth_no]

### 1.4 services
| Column | Type | Default | Nullable |
|---|---|---|---|
| id | bigIncrements | auto | no |
| name | string(255) | — | no |
| category | string(100) | — | no |
| price | decimal(12,2) | — | no |
| doctor_pct | integer | 30 | no |
| duration | integer | 45 | no |
| is_active | boolean | true | no |
| timestamps | | | |

### 1.5 appointments
| Column | Type | Default | Nullable |
|---|---|---|---|
| id | bigIncrements | auto | no |
| patient_id | foreignId | — | no |
| doctor_id | foreignId | — | no |
| chair | string(10) | '1' | no |
| visit_type | string('treatment') | treatment | no |
| visit_kind | string('regular') | regular | no |
| start_time | timestamp | — | no |
| end_time | timestamp | — | no |
| status | string('not_confirmed') | not_confirmed | no |
| direction | string(100) | null | yes |
| source | string(100) | null | yes |
| comment | text | null | yes |
| timestamps | | | |

### 1.6 treatment_lines
| Column | Type | Default | Nullable |
|---|---|---|---|
| id | bigIncrements | auto | no |
| appointment_id | foreignId cascade | — | no |
| service_id | foreignId | — | no |
| doctor_id | foreignId | — | no |
| tooth_no | integer | null | yes |
| qty | integer | 1 | no |
| price | decimal(12,2) | — | no |
| doctor_pct | integer | 30 | no |
| timestamps | | | |

### 1.7 treatment_plans
| Column | Type |
|---|---|
| id, patient_id (FK), status (draft/active/completed), timestamps |

### 1.8 treatment_plan_items
| Column | Type |
|---|---|
| id, plan_id (FK cascade), service_id (FK), tooth_no?, status (planned/in_progress/done), price, timestamps |

### 1.9 payments
| Column | Type | Default |
|---|---|---|
| id, patient_id (FK), amount (decimal 12,2), method (cash/card/bank/payme/click) default 'cash', type default 'payment', description?, timestamps |

### 1.10 patient_documents
| Column | Type |
|---|---|
| id, patient_id (FK), name, type, url?, timestamps |

### 1.11 materials
| Column | Type | Default |
|---|---|---|
| id, name, category, stock (decimal), min_stock (decimal), unit, price (decimal), supplier_id? (FK), timestamps |

### 1.12 suppliers
| Column | Type | Default |
|---|---|---|
| id, name, contact?, phone?, category?, balance (decimal) default 0, timestamps |

### 1.13 warehouse_docs
| Column | Type |
|---|---|
| id, doc_no (unique, auto "ПР-{id}"), type (receipt/expense/transfer/writeoff), supplier_id? (FK), party?, status default 'posted', total_sum (decimal) default 0, timestamps |

### 1.14 warehouse_doc_lines
| Column | Type |
|---|---|
| id, doc_id (FK cascade), material_id (FK), qty (decimal), price (decimal 0), timestamps |

### 1.15 cashbox_entries
| Column | Type |
|---|---|
| id, operation, method (cash/card/bank/payme/click), amount (decimal, always positive), is_income (bool), patient_id?, timestamps |

### 1.16 leads
| Column | Type | Default |
|---|---|---|
| id, name, phone?, source (online) default 'online', stage (int 0-4) default 0, potential (decimal) default 0, curator_id? (FK), patient_id? (FK), notes?, timestamps |

### 1.17 campaigns
| Column | Type | Default |
|---|---|---|
| id, name, channel (telegram/sms/whatsapp/instagram), group_name?, reach (int) default 0, status (draft/scheduled/sent) default 'draft', sent_at?, scheduled_at?, timestamps |

### 1.18 patient_groups
| Column | Type | Default |
|---|---|---|
| id, name, condition, color default '#0787c9', count default 0, timestamps |

### 1.19 tasks
| Column | Type | Default |
|---|---|---|
| id, title, assignee_id (FK to users), priority (high/normal/low) default 'normal', due (today/tomorrow/week) default 'today', done (bool) default false, timestamps |

### 1.20 waitlist
| Column | Type | Default |
|---|---|---|
| id, patient_name, phone?, desired_doctor?, date_window?, priority (high/normal/low) default 'normal', timestamps |

### 1.21 branches
| Column | Type | Default |
|---|---|---|
| id, name, address?, is_main (bool) default false, timestamps |

---

## 2. API ROUTE MAP (routes/api.php)

All routes except `/auth/*` require authentication via `auth:api` middleware.

### Auth
- `POST /api/auth/login` — `{ email, password }` → `{ token, user: { id, email, name, role, color } }`
- `GET /api/auth/me` — Returns authenticated user

### Dashboard
- `GET /api/dashboard/overview` — KPIs, today's appointments, low stock, leads, doctor load

### Patients
- `GET /api/patients` — List (paginated, searchable, filterable by doctor)
- `GET /api/patients/{id}` — Detail with nested appointments, teeth, plans, payments, documents
- `POST /api/patients` — Create (auto-generates card_no)
- `PUT /api/patients/{id}` — Update
- `PATCH /api/patients/{id}/dental-chart` — Upsert tooth status

### Appointments
- `GET /api/appointments` — List (filter by date, doctor, status, range)
- `POST /api/appointments` — Create (supports ISO or date+time+duration)
- `PUT /api/appointments/{id}` — Update
- `DELETE /api/appointments/{id}` — Delete
- `POST /api/appointments/{id}/treatment-lines` — Add treatment to visit

### Services
- `GET /api/services` — List (filter by category, search)
- `POST /api/services` — Create
- `PUT /api/services/{id}` — Update
- `DELETE /api/services/{id}` — Soft-delete (is_active=false)

### Staff
- `GET /api/staff` — List (filter by role)
- `POST /api/staff` — Create (hashes password)
- `PUT /api/staff/{id}` — Update (optional password change)

### Finance
- `GET /api/finance/cashbox?date=` — Day's entries with income/expense/balance
- `POST /api/finance/cashbox` — Create entry
- `GET /api/finance/debtors` — Patients with negative balance
- `GET /api/finance/pnl?month=&year=` — P&L report

### Inventory
- `GET /api/inventory/materials?category=` — List with stats
- `POST /api/inventory/materials` — Create
- `PUT /api/inventory/materials/{id}` — Update
- `GET /api/inventory/suppliers` — List
- `GET /api/inventory/documents` — List with lines
- `POST /api/inventory/documents` — Create (auto stock update on receipt)

### CRM
- `GET /api/crm/leads` — List
- `POST /api/crm/leads` — Create
- `PATCH /api/crm/leads/{id}/stage` — Update stage
- `GET /api/crm/waitlist` — List
- `POST /api/crm/waitlist` — Create
- `GET /api/crm/tasks` — List
- `PATCH /api/crm/tasks/{id}/toggle` — Toggle done

### Marketing
- `GET /api/marketing/campaigns` — List
- `POST /api/marketing/campaigns` — Create
- `GET /api/marketing/groups` — List
- `POST /api/marketing/groups` — Create
- `GET /api/marketing/stats` — Stats

### Reports
- `GET /api/reports/by-doctor?month=&year=` — Revenue by doctor
- `GET /api/reports/by-service` — Revenue by service
- `GET /api/reports/patients?month=&year=` — New vs returning

### Settings
- `GET /api/settings/branches` — List
- `POST /api/settings/branches` — Create
- `GET /api/settings/rbac` — Get RBAC config
- `POST /api/settings/rbac` — Save RBAC config
- `GET /api/settings/integrations` — List (hardcoded)

### Other
- `GET /health` — `{ status: 'ok', timestamp }`

---

## 3. AUTH IMPLEMENTATION

### JWT Strategy (tymon/jwt-auth or Sanctum)
- Token payload: `{ sub: user_id, email, role, name }`
- Expiry: 7 days
- Password: `Hash::make()` with bcrypt
- Middleware: `auth:api` on all `/api/*` routes except `/api/auth/login`

### Client Contract
- Client sends `Authorization: Bearer <token>`
- Login response: `{ token, user: { id, email, name, role, color } }`
- 401 response triggers client logout + redirect to /login

---

## 4. FRONTEND API CONTRACT (Unchanged)

The React frontend expects the exact same JSON shapes as described above. The Laravel API must produce identical response structures (snake_case in DB → camelCase in JSON via Laravel resources or transformers).

### Key Formatting
- Currency: `uzs(n, dec)` → `"1 500 000 сум"` format
- Dates: ISO 8601 strings
- Nested includes: Must match current Prisma include shapes exactly
- Pagination: `{ items, total, page, limit }` format
- i18n: Russian (default), Uzbek, English

---

## 5. KEY BUSINESS LOGIC

### Patient card number auto-generation
- Find all `card_no` values, parse integers >= 2000
- Take `max + 1`, start from 2230 if none exist

### Warehouse document stock update
- On `type === 'receipt'`, increment each material's `stock` by line `qty`

### Cashbox balance
- Daily balance: sum of income - sum of expenses for that day only
- P&L: revenue/expense/profit per month with margin %

### Debtors
- Group payments by patient_id, filter those with negative sum

### CRM lead stages
- 0: Новый, 1: Позвонили, 2: Записан, 3: Пришёл, 4: Лечение

---

## 6. SEED DATA

Seed the following initial data:
- **6 users** (1 admin + 5 doctors with Cyrillic names)
- **14 services** (50,000–8,000,000 сум range)
- **7 patients** (card_no: 2230–2236)
- **9 dental teeth** for first patient
- **5 appointments** for today
- **5 suppliers** with balances
- **8 materials** with stock
- **9 CRM leads** across stages 0–4
- **10 cashbox entries**
- **5 tasks**
- **4 waitlist entries**
- **5 marketing campaigns**
- **6 patient groups**
- **3 branches**

---

## 7. LARAVEL PROJECT STRUCTURE

```
laravel/
├── app/
│   ├── Models/          (21 Eloquent models)
│   ├── Http/
│   │   ├── Controllers/Api/  (AuthController, DashboardController, PatientController...)
│   │   ├── Middleware/        (JwtMiddleware, RoleMiddleware)
│   │   ├── Requests/          (FormRequest validation classes)
│   │   └── Resources/         (JsonResource for camelCase transformation)
│   ├── Services/              (Business logic: CardNumberGenerator, StockService)
│   └── Enums/                 (Status, Role, Stage enums)
├── database/
│   ├── migrations/       (21 migration files)
│   └── seeders/          (DatabaseSeeder)
├── routes/
│   └── api.php           (All API routes)
├── config/
│   └── jwt.php           (JWT config)
└── .env                  (DB, JWT_SECRET, CORS, etc.)
```
