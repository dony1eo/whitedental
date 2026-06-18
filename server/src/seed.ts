import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Users (staff)
  const pass = await bcrypt.hash('admin123', 10);
  const [admin, dr1, dr2, dr3, dr4, dr5] = await Promise.all([
    prisma.user.upsert({ where: { email: 'admin@whitedental.uz' }, update: {}, create: { email: 'admin@whitedental.uz', name: 'Администратор', password: pass, role: 'admin', color: '#6c757d' } }),
    prisma.user.upsert({ where: { email: 'solieva@whitedental.uz' }, update: {}, create: { email: 'solieva@whitedental.uz', name: 'Солиева Феруза', password: pass, role: 'doctor', specialty: 'Терапевт', phone: '+998901234567', color: '#0787c9' } }),
    prisma.user.upsert({ where: { email: 'rakhimov@whitedental.uz' }, update: {}, create: { email: 'rakhimov@whitedental.uz', name: 'Рахимов Санжар', password: pass, role: 'doctor', specialty: 'Хирург', phone: '+998901234568', color: '#e74c3c' } }),
    prisma.user.upsert({ where: { email: 'yusupova@whitedental.uz' }, update: {}, create: { email: 'yusupova@whitedental.uz', name: 'Юсупова Нилуфар', password: pass, role: 'doctor', specialty: 'Ортодонт', phone: '+998901234569', color: '#27ae60' } }),
    prisma.user.upsert({ where: { email: 'karimov@whitedental.uz' }, update: {}, create: { email: 'karimov@whitedental.uz', name: 'Каримов Бехзод', password: pass, role: 'doctor', specialty: 'Терапевт', phone: '+998901234570', color: '#8e44ad' } }),
    prisma.user.upsert({ where: { email: 'nazarova@whitedental.uz' }, update: {}, create: { email: 'nazarova@whitedental.uz', name: 'Назарова Дилноза', password: pass, role: 'doctor', specialty: 'Пародонтолог', phone: '+998901234571', color: '#f39c12' } }),
  ]);

  // Services
  const services = await Promise.all([
    prisma.service.upsert({ where: { id: 1 }, update: {}, create: { name: 'Консультация врача', category: 'Консультация', price: 50000, doctorPct: 30, duration: 30 } }),
    prisma.service.upsert({ where: { id: 2 }, update: {}, create: { name: 'Лечение кариеса (1 поверхность)', category: 'Терапия', price: 280000, doctorPct: 35, duration: 45 } }),
    prisma.service.upsert({ where: { id: 3 }, update: {}, create: { name: 'Лечение кариеса (2 поверхности)', category: 'Терапия', price: 380000, doctorPct: 35, duration: 60 } }),
    prisma.service.upsert({ where: { id: 4 }, update: {}, create: { name: 'Эндодонтическое лечение (1 канал)', category: 'Терапия', price: 450000, doctorPct: 35, duration: 60 } }),
    prisma.service.upsert({ where: { id: 5 }, update: {}, create: { name: 'Эндодонтическое лечение (2 канала)', category: 'Терапия', price: 650000, doctorPct: 35, duration: 90 } }),
    prisma.service.upsert({ where: { id: 6 }, update: {}, create: { name: 'Эндодонтическое лечение (3 канала)', category: 'Терапия', price: 850000, doctorPct: 35, duration: 120 } }),
    prisma.service.upsert({ where: { id: 7 }, update: {}, create: { name: 'Удаление зуба (простое)', category: 'Хирургия', price: 200000, doctorPct: 40, duration: 30 } }),
    prisma.service.upsert({ where: { id: 8 }, update: {}, create: { name: 'Удаление зуба (сложное)', category: 'Хирургия', price: 450000, doctorPct: 40, duration: 60 } }),
    prisma.service.upsert({ where: { id: 9 }, update: {}, create: { name: 'Металлокерамическая коронка', category: 'Ортопедия', price: 1200000, doctorPct: 30, duration: 60 } }),
    prisma.service.upsert({ where: { id: 10 }, update: {}, create: { name: 'Коронка диоксид циркония', category: 'Ортопедия', price: 2200000, doctorPct: 30, duration: 60 } }),
    prisma.service.upsert({ where: { id: 11 }, update: {}, create: { name: 'Зубной имплантат Nobel Biocare', category: 'Имплантология', price: 6500000, doctorPct: 25, duration: 120 } }),
    prisma.service.upsert({ where: { id: 12 }, update: {}, create: { name: 'Профессиональная чистка (Air Flow)', category: 'Гигиена', price: 350000, doctorPct: 30, duration: 60 } }),
    prisma.service.upsert({ where: { id: 13 }, update: {}, create: { name: 'Отбеливание (Zoom 4)', category: 'Эстетика', price: 2500000, doctorPct: 30, duration: 90 } }),
    prisma.service.upsert({ where: { id: 14 }, update: {}, create: { name: 'Брекет-система (металл)', category: 'Ортодонтия', price: 8000000, doctorPct: 25, duration: 120 } }),
  ]);

  // Patients
  const patientData = [
    { cardNo: '2230', firstName: 'Малика', lastName: 'Ҳасанова', gender: 'female', phone: '+998901112233', source: 'instagram' },
    { cardNo: '2231', firstName: 'Бобур', lastName: 'Мирзаев', gender: 'male', phone: '+998905556677', source: 'referral' },
    { cardNo: '2232', firstName: 'Нилуфар', lastName: 'Тошматова', gender: 'female', phone: '+998907778899', source: 'instagram' },
    { cardNo: '2233', firstName: 'Санжар', lastName: 'Алимов', gender: 'male', phone: '+998903334455', source: 'website' },
    { cardNo: '2234', firstName: 'Феруза', lastName: 'Қодирова', gender: 'female', phone: '+998906667788', source: 'referral' },
    { cardNo: '2235', firstName: 'Жасур', lastName: 'Бекмуродов', gender: 'male', phone: '+998908889900', source: 'facebook' },
    { cardNo: '2236', firstName: 'Дилноза', lastName: 'Юсупова', gender: 'female', phone: '+998902223344', source: 'instagram' },
  ];

  const patients = await Promise.all(
    patientData.map(p => prisma.patient.upsert({ where: { cardNo: p.cardNo }, update: {}, create: { ...p, status: 'active' } }))
  );

  // Dental chart for first patient
  const toothStatuses = [
    { toothNo: 16, status: 'filling' }, { toothNo: 26, status: 'crown' },
    { toothNo: 36, status: 'endo' }, { toothNo: 46, status: 'missing' },
    { toothNo: 24, status: 'caries' }, { toothNo: 11, status: 'filling' },
    { toothNo: 47, status: 'implant' }, { toothNo: 14, status: 'planned' },
    { toothNo: 37, status: 'caries' },
  ];
  await Promise.all(toothStatuses.map(t =>
    prisma.dentalTooth.upsert({
      where: { patientId_toothNo: { patientId: patients[0].id, toothNo: t.toothNo } },
      update: {},
      create: { patientId: patients[0].id, ...t },
    })
  ));

  // Today's appointments
  const todayBase = new Date();
  todayBase.setHours(9, 0, 0, 0);
  const apptData = [
    { patientIdx: 0, doctorRef: dr1, chair: 'Кресло 1', h: 9, m: 0, dur: 60, visitType: 'treatment', status: 'confirmed' },
    { patientIdx: 1, doctorRef: dr2, chair: 'Кресло 2', h: 10, m: 0, dur: 45, visitType: 'consultation', status: 'confirmed' },
    { patientIdx: 2, doctorRef: dr3, chair: 'Кресло 3', h: 11, m: 0, dur: 90, visitType: 'treatment', status: 'confirmed' },
    { patientIdx: 3, doctorRef: dr1, chair: 'Кресло 1', h: 13, m: 0, dur: 60, visitType: 'treatment', status: 'not_confirmed' },
    { patientIdx: 4, doctorRef: dr4, chair: 'Кресло 4', h: 14, m: 30, dur: 45, visitType: 'treatment', status: 'confirmed' },
  ];

  for (const a of apptData) {
    const start = new Date(todayBase);
    start.setHours(a.h, a.m, 0, 0);
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + a.dur);
    const appt = await prisma.appointment.create({
      data: {
        patientId: patients[a.patientIdx].id,
        doctorId: a.doctorRef.id,
        chair: a.chair,
        visitType: a.visitType,
        visitKind: 'paid',
        startTime: start,
        endTime: end,
        status: a.status,
        source: 'online',
      },
    });
    // Add treatment line
    await prisma.treatmentLine.create({
      data: {
        appointmentId: appt.id,
        serviceId: services[1].id,
        doctorId: a.doctorRef.id,
        qty: 1,
        price: services[1].price,
        doctorPct: 35,
      },
    });
  }

  // Suppliers
  const suppliers = await Promise.all([
    prisma.supplier.upsert({ where: { id: 1 }, update: {}, create: { name: 'DentPro Uzbekistan', contact: 'Алишер Каримов', phone: '+998712345678', category: 'Материалы', balance: -2450000 } }),
    prisma.supplier.upsert({ where: { id: 2 }, update: {}, create: { name: 'Nobel Biocare CIS', contact: 'Менеджер', phone: '+998712345679', category: 'Импланты', balance: 0 } }),
    prisma.supplier.upsert({ where: { id: 3 }, update: {}, create: { name: 'Dentsply Sirona', contact: 'Захид Раджабов', phone: '+998712345680', category: 'Оборудование', balance: -890000 } }),
    prisma.supplier.upsert({ where: { id: 4 }, update: {}, create: { name: '3M ESPE Tashkent', contact: 'Бахром Исмоилов', phone: '+998712345681', category: 'Материалы', balance: 0 } }),
    prisma.supplier.upsert({ where: { id: 5 }, update: {}, create: { name: 'SurgiDent', contact: 'Дилноза Ортиқова', phone: '+998712345682', category: 'Расходники', balance: -320000 } }),
  ]);

  // Materials
  await Promise.all([
    prisma.material.upsert({ where: { id: 1 }, update: {}, create: { name: 'Анестетик Убистезин 4%', category: 'Анестезия', stock: 12, minStock: 20, unit: 'карп.', price: 18000, supplierId: suppliers[0].id } }),
    prisma.material.upsert({ where: { id: 2 }, update: {}, create: { name: 'Фотокомпозит Filtek Z350', category: 'Пломбы', stock: 3, minStock: 5, unit: 'шпр.', price: 85000, supplierId: suppliers[3].id } }),
    prisma.material.upsert({ where: { id: 3 }, update: {}, create: { name: 'Эндофайлы Pro Taper Gold', category: 'Эндодонтия', stock: 8, minStock: 10, unit: 'уп.', price: 145000, supplierId: suppliers[2].id } }),
    prisma.material.upsert({ where: { id: 4 }, update: {}, create: { name: 'Цемент Ketac Cem', category: 'Цементы', stock: 25, minStock: 10, unit: 'уп.', price: 32000, supplierId: suppliers[3].id } }),
    prisma.material.upsert({ where: { id: 5 }, update: {}, create: { name: 'Перчатки нитрил S', category: 'СИЗ', stock: 2, minStock: 5, unit: 'уп.', price: 45000, supplierId: suppliers[4].id } }),
    prisma.material.upsert({ where: { id: 6 }, update: {}, create: { name: 'Маски трёхслойные', category: 'СИЗ', stock: 80, minStock: 100, unit: 'шт.', price: 2500, supplierId: suppliers[4].id } }),
    prisma.material.upsert({ where: { id: 7 }, update: {}, create: { name: 'Слепочная масса Impregum', category: 'Слепки', stock: 6, minStock: 4, unit: 'уп.', price: 190000, supplierId: suppliers[0].id } }),
    prisma.material.upsert({ where: { id: 8 }, update: {}, create: { name: 'Имплантат Nobel Active 3.5×10', category: 'Импланты', stock: 4, minStock: 3, unit: 'шт.', price: 2800000, supplierId: suppliers[1].id } }),
  ]);

  // CRM Leads
  const leadData = [
    { name: 'Озода Мансурова', phone: '+998901234001', source: 'instagram', stage: 0, potential: 500000 },
    { name: 'Дониёр Рустамов', phone: '+998901234002', source: 'referral', stage: 1, potential: 2200000 },
    { name: 'Гулнора Абдуллаева', phone: '+998901234003', source: 'facebook', stage: 2, potential: 1800000 },
    { name: 'Тимур Маматов', phone: '+998901234004', source: 'website', stage: 3, potential: 6500000 },
    { name: 'Шахло Норматова', phone: '+998901234005', source: 'instagram', stage: 4, potential: 350000 },
    { name: 'Улмас Хасанов', phone: '+998901234006', source: 'online', stage: 0, potential: 1200000 },
    { name: 'Барно Исмоилова', phone: '+998901234007', source: 'referral', stage: 1, potential: 900000 },
    { name: 'Фарид Мирзаев', phone: '+998901234008', source: 'instagram', stage: 2, potential: 2800000 },
    { name: 'Нодира Тошева', phone: '+998901234009', source: 'website', stage: 3, potential: 450000 },
  ];

  for (const l of leadData) {
    const existing = await prisma.lead.findFirst({ where: { phone: l.phone } });
    if (!existing) {
      await prisma.lead.create({ data: { ...l, curatorId: dr1.id } });
    }
  }

  // Cashbox entries (last 7 days)
  const cashEntries = [
    { operation: 'Оплата лечения - Ҳасанова М.', method: 'card', amount: 280000, isIncome: true },
    { operation: 'Оплата лечения - Мирзаев Б.', method: 'cash', amount: 450000, isIncome: true },
    { operation: 'Аренда помещения', method: 'bank', amount: -1500000, isIncome: false },
    { operation: 'Оплата лечения - Тошматова Н.', method: 'payme', amount: 850000, isIncome: true },
    { operation: 'Зарплата персонала (аванс)', method: 'cash', amount: -3000000, isIncome: false },
    { operation: 'Оплата лечения - Алимов С.', method: 'click', amount: 350000, isIncome: true },
    { operation: 'Закупка материалов', method: 'bank', amount: -750000, isIncome: false },
    { operation: 'Оплата лечения - Қодирова Ф.', method: 'card', amount: 2200000, isIncome: true },
    { operation: 'Коммунальные услуги', method: 'bank', amount: -450000, isIncome: false },
    { operation: 'Оплата имплантации', method: 'cash', amount: 6500000, isIncome: true },
  ];

  for (const e of cashEntries) {
    await prisma.cashboxEntry.create({ data: { ...e, amount: Math.abs(e.amount) } });
  }

  // Tasks
  const taskData = [
    { title: 'Позвонить Мансуровой Озоде — уточнить дату', priority: 'high', due: 'today', done: false },
    { title: 'Заказать анестетик (кончается)', priority: 'high', due: 'today', done: false },
    { title: 'Отправить план лечения Мирзаеву', priority: 'normal', due: 'today', done: true },
    { title: 'Проверить стерилизатор после ТО', priority: 'normal', due: 'tomorrow', done: false },
    { title: 'Подготовить отчёт за май для директора', priority: 'low', due: 'week', done: false },
  ];

  for (const t of taskData) {
    const existing = await prisma.task.findFirst({ where: { title: t.title } });
    if (!existing) {
      await prisma.task.create({ data: { ...t, assigneeId: admin.id } });
    }
  }

  // Waitlist
  const waitlistData = [
    { patientName: 'Ортиқов Баҳром', phone: '+998901234010', desiredDoctor: 'Солиева Феруза', dateWindow: '20–25 июня', priority: 'high' },
    { patientName: 'Сайдуллаева Зулайхо', phone: '+998901234011', desiredDoctor: 'Рахимов Санжар', dateWindow: 'Любой день', priority: 'normal' },
    { patientName: 'Кенжаев Олимжон', phone: '+998901234012', desiredDoctor: 'Юсупова Нилуфар', dateWindow: '18–19 июня', priority: 'normal' },
    { patientName: 'Исмоилова Мухаббат', phone: '+998901234013', desiredDoctor: 'Каримов Бехзод', dateWindow: '21 июня', priority: 'low' },
  ];

  for (const w of waitlistData) {
    const existing = await prisma.waitlist.findFirst({ where: { phone: w.phone } });
    if (!existing) {
      await prisma.waitlist.create({ data: w });
    }
  }

  // Campaigns
  const campData = [
    { name: 'Отбеливание — лето 2026', channel: 'telegram', groupName: 'Активные пациенты', reach: 1240, status: 'sent', sentAt: new Date('2026-06-10') },
    { name: 'День защиты детей — акция', channel: 'sms', groupName: 'Семьи с детьми', reach: 820, status: 'sent', sentAt: new Date('2026-06-01') },
    { name: 'Имплантация — рассрочка 0%', channel: 'whatsapp', groupName: 'Потенциальные', reach: 430, status: 'scheduled', scheduledAt: new Date('2026-06-20') },
    { name: 'Профилактика — напоминание', channel: 'telegram', groupName: 'Давние пациенты', reach: 2100, status: 'draft' },
    { name: 'Брекеты — новый врач ортодонт', channel: 'instagram', groupName: 'Молодые 18–25', reach: 3500, status: 'sent', sentAt: new Date('2026-05-25') },
  ];

  for (const c of campData) {
    const existing = await prisma.campaign.findFirst({ where: { name: c.name } });
    if (!existing) {
      await prisma.campaign.create({ data: c });
    }
  }

  // Patient groups
  const groupData = [
    { name: 'Активные пациенты', condition: 'Визит за последние 3 мес.', color: '#0787c9', count: 1240 },
    { name: 'Семьи с детьми', condition: 'Есть дети до 14 лет', color: '#27ae60', count: 380 },
    { name: 'Потенциальные', condition: 'Первичный контакт, нет визита', color: '#f39c12', count: 430 },
    { name: 'Давние пациенты', condition: 'Нет визита более 6 мес.', color: '#e74c3c', count: 2100 },
    { name: 'Молодые 18–25', condition: 'Возраст 18–25 лет', color: '#8e44ad', count: 620 },
    { name: 'VIP (высокий чек)', condition: 'Средний чек > 2 млн UZS', color: '#1abc9c', count: 145 },
  ];

  for (const g of groupData) {
    const existing = await prisma.patientGroup.findFirst({ where: { name: g.name } });
    if (!existing) {
      await prisma.patientGroup.create({ data: g });
    }
  }

  // Branches
  await Promise.all([
    prisma.branch.upsert({ where: { id: 1 }, update: {}, create: { name: 'Главный офис — Мирзо Улугбек', address: 'ул. Мирзо Улугбека, 45, Ташкент', isMain: true } }),
    prisma.branch.upsert({ where: { id: 2 }, update: {}, create: { name: 'Чиланзар', address: 'ул. Катартол, 12, Ташкент', isMain: false } }),
    prisma.branch.upsert({ where: { id: 3 }, update: {}, create: { name: 'Юнусабад', address: 'пр. Амира Темура, 78, Ташкент', isMain: false } }),
  ]);

  console.log('Seed complete!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
