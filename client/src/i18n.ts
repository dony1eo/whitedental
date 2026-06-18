import { createContext, useContext } from 'react';

export type Lang = 'ru' | 'uz' | 'en';

type Dict = Record<string, Record<Lang, string>>;

const DICT: Dict = {
  dashboard: { ru: 'Дашборд', uz: 'Bosh sahifa', en: 'Dashboard' },
  calendar: { ru: 'Расписание', uz: 'Jadval', en: 'Calendar' },
  patients: { ru: 'Пациенты', uz: 'Bemorlar', en: 'Patients' },
  visits: { ru: 'Визиты', uz: 'Tashriflar', en: 'Visits' },
  treatment: { ru: 'Лечение', uz: 'Davolash', en: 'Treatment' },
  finance: { ru: 'Финансы', uz: 'Moliya', en: 'Finance' },
  crm: { ru: 'CRM', uz: 'CRM', en: 'CRM' },
  inventory: { ru: 'Склад', uz: 'Ombor', en: 'Inventory' },
  marketing: { ru: 'Маркетинг', uz: 'Marketing', en: 'Marketing' },
  reports: { ru: 'Отчёты', uz: 'Hisobotlar', en: 'Reports' },
  services: { ru: 'Услуги', uz: 'Xizmatlar', en: 'Services' },
  staff: { ru: 'Персонал', uz: 'Xodimlar', en: 'Staff' },
  settings: { ru: 'Настройки', uz: 'Sozlamalar', en: 'Settings' },
  search: { ru: 'Поиск...', uz: 'Qidirish...', en: 'Search...' },
  newVisit: { ru: 'Новый визит', uz: 'Yangi tashrif', en: 'New visit' },
  addPatient: { ru: 'Добавить пациента', uz: 'Bemor qoʻshish', en: 'Add patient' },
  waitlist: { ru: 'Очередь', uz: 'Navbat', en: 'Waitlist' },
  tasks: { ru: 'Задачи', uz: 'Vazifalar', en: 'Tasks' },
  save: { ru: 'Сохранить', uz: 'Saqlash', en: 'Save' },
  cancel: { ru: 'Отмена', uz: 'Bekor qilish', en: 'Cancel' },
  delete: { ru: 'Удалить', uz: "O'chirish", en: 'Delete' },
  close: { ru: 'Закрыть', uz: 'Yopish', en: 'Close' },
  edit: { ru: 'Редактировать', uz: 'Tahrirlash', en: 'Edit' },
  add: { ru: 'Добавить', uz: "Qo'shish", en: 'Add' },
  today: { ru: 'Сегодня', uz: 'Bugun', en: 'Today' },
  tomorrow: { ru: 'Завтра', uz: 'Ertaga', en: 'Tomorrow' },
  week: { ru: 'Неделя', uz: 'Hafta', en: 'Week' },
  month: { ru: 'Месяц', uz: 'Oy', en: 'Month' },
  revenue: { ru: 'Выручка', uz: 'Daromad', en: 'Revenue' },
  expenses: { ru: 'Расходы', uz: 'Xarajatlar', en: 'Expenses' },
  profit: { ru: 'Прибыль', uz: 'Foyda', en: 'Profit' },
  balance: { ru: 'Касса', uz: 'Kassa', en: 'Cashbox' },
  newPatients: { ru: 'Новых пациентов', uz: 'Yangi bemorlar', en: 'New patients' },
  debtors: { ru: 'Должники', uz: 'Qarzdorlar', en: 'Debtors' },
  doctor: { ru: 'Врач', uz: 'Shifokor', en: 'Doctor' },
  patient: { ru: 'Пациент', uz: 'Bemor', en: 'Patient' },
  phone: { ru: 'Телефон', uz: 'Telefon', en: 'Phone' },
  email: { ru: 'Email', uz: 'Email', en: 'Email' },
  status: { ru: 'Статус', uz: 'Holat', en: 'Status' },
  source: { ru: 'Источник', uz: 'Manba', en: 'Source' },
  notes: { ru: 'Примечания', uz: 'Izohlar', en: 'Notes' },
  name: { ru: 'Имя', uz: 'Ism', en: 'Name' },
  lastName: { ru: 'Фамилия', uz: 'Familiya', en: 'Last name' },
  firstName: { ru: 'Имя', uz: 'Ism', en: 'First name' },
  middleName: { ru: 'Отчество', uz: 'Otasining ismi', en: 'Middle name' },
  gender: { ru: 'Пол', uz: 'Jins', en: 'Gender' },
  male: { ru: 'Мужской', uz: 'Erkak', en: 'Male' },
  female: { ru: 'Женский', uz: 'Ayol', en: 'Female' },
  birthDate: { ru: 'Дата рождения', uz: "Tug'ilgan sana", en: 'Date of birth' },
  cardNo: { ru: 'Карта №', uz: 'Karta №', en: 'Card #' },
  cashbox: { ru: 'Касса', uz: 'Kassa', en: 'Cashbox' },
  pnl: { ru: 'П&У', uz: 'D&Z', en: 'P&L' },
  confirmed: { ru: 'Подтверждён', uz: 'Tasdiqlangan', en: 'Confirmed' },
  notConfirmed: { ru: 'Не подтверждён', uz: "Tasdiqlanmagan", en: 'Not confirmed' },
  arrived: { ru: 'Пришёл', uz: 'Keldi', en: 'Arrived' },
  inChair: { ru: 'В кресле', uz: 'Kresloda', en: 'In chair' },
  done: { ru: 'Завершён', uz: 'Tugallangan', en: 'Done' },
  cancelled: { ru: 'Отменён', uz: 'Bekor qilindi', en: 'Cancelled' },
  noShow: { ru: 'Неявка', uz: 'Kelmadi', en: 'No-show' },
  formula: { ru: 'Зубная формула', uz: 'Tish formulasi', en: 'Dental formula' },
  treatmentPlan: { ru: 'План лечения', uz: 'Davolash rejasi', en: 'Treatment plan' },
  'visits-tab': { ru: 'Визиты', uz: 'Tashriflar', en: 'Visits' },
  payments: { ru: 'Платежи', uz: "To'lovlar", en: 'Payments' },
  files: { ru: 'Файлы', uz: 'Fayllar', en: 'Files' },
  feed: { ru: 'Лента', uz: 'Lenta', en: 'Feed' },
  service: { ru: 'Услуга', uz: 'Xizmat', en: 'Service' },
  price: { ru: 'Цена', uz: 'Narx', en: 'Price' },
  qty: { ru: 'Кол', uz: "Miqdor", en: 'Qty' },
  total: { ru: 'Итого', uz: 'Jami', en: 'Total' },
  discount: { ru: 'Скидка', uz: "Chegirma", en: 'Discount' },
  toPay: { ru: 'К оплате', uz: "To'lash", en: 'To pay' },
  materials: { ru: 'Материалы', uz: 'Materiallar', en: 'Materials' },
  suppliers: { ru: 'Поставщики', uz: 'Yetkazib beruvchilar', en: 'Suppliers' },
  documents: { ru: 'Документы', uz: 'Hujjatlar', en: 'Documents' },
  campaigns: { ru: 'Кампании', uz: 'Kampaniyalar', en: 'Campaigns' },
  groups: { ru: 'Группы пациентов', uz: 'Bemor guruhlari', en: 'Patient groups' },
  roles: { ru: 'Роли', uz: 'Rollar', en: 'Roles' },
  integrations: { ru: 'Интеграции', uz: 'Integratsiyalar', en: 'Integrations' },
  branches: { ru: 'Филиалы', uz: 'Filiallar', en: 'Branches' },
  login: { ru: 'Войти', uz: 'Kirish', en: 'Log in' },
  logout: { ru: 'Выйти', uz: 'Chiqish', en: 'Log out' },
  password: { ru: 'Пароль', uz: 'Parol', en: 'Password' },
  notifications: { ru: 'Уведомления', uz: 'Bildirishnomalar', en: 'Notifications' },
  markAllRead: { ru: 'Все прочитаны', uz: 'Barchasi oʻqildi', en: 'Mark all read' },
  lowStock: { ru: 'Низкий остаток', uz: 'Kam qoldiq', en: 'Low stock' },
  order: { ru: 'Заказать', uz: 'Buyurtma', en: 'Order' },
  active: { ru: 'Активный', uz: 'Faol', en: 'Active' },
  inactive: { ru: 'Неактивный', uz: 'Faol emas', en: 'Inactive' },
  all: { ru: 'Все', uz: 'Barchasi', en: 'All' },
  category: { ru: 'Категория', uz: 'Kategoriya', en: 'Category' },
  unit: { ru: 'Ед. изм.', uz: "O'lchov birligi", en: 'Unit' },
  stock: { ru: 'Остаток', uz: 'Qoldiq', en: 'Stock' },
  minStock: { ru: 'Мин. остаток', uz: 'Min. qoldiq', en: 'Min. stock' },
  specialty: { ru: 'Специальность', uz: 'Mutaxassislik', en: 'Specialty' },
  role: { ru: 'Роль', uz: 'Rol', en: 'Role' },
  chair: { ru: 'Кресло', uz: 'Kreslo', en: 'Chair' },
  direction: { ru: 'Направление', uz: "Yo'nalish", en: 'Direction' },
  visitType: { ru: 'Тип визита', uz: 'Tashrif turi', en: 'Visit type' },
  comment: { ru: 'Комментарий', uz: 'Izoh', en: 'Comment' },
  toothNo: { ru: 'Зуб', uz: 'Tish', en: 'Tooth' },
  channel: { ru: 'Канал', uz: 'Kanal', en: 'Channel' },
  reach: { ru: 'Охват', uz: 'Qamrov', en: 'Reach' },
  condition: { ru: 'Условие', uz: 'Shart', en: 'Condition' },
  count: { ru: 'Кол-во', uz: 'Soni', en: 'Count' },
  // Inventory modal keys
  'inv.newDoc':    { ru: 'Новый документ',          uz: 'Yangi hujjat',             en: 'New document' },
  'inv.docType':   { ru: 'Тип документа',            uz: 'Hujjat turi',              en: 'Document type' },
  'inv.dIncome':   { ru: 'Приход',                   uz: 'Kirim',                    en: 'Receipt' },
  'inv.dExpense':  { ru: 'Расход',                   uz: 'Chiqim',                   en: 'Expense' },
  'inv.dMove':     { ru: 'Перемещение',              uz: "Ko'chirish",               en: 'Transfer' },
  'inv.dWriteoff': { ru: 'Списание',                 uz: 'Hisobdan chiqarish',       en: 'Write-off' },
  'inv.supplier':  { ru: 'Поставщик',                uz: 'Yetkazib beruvchi',        en: 'Supplier' },
  'inv.party':     { ru: 'Контрагент',               uz: 'Kontragent',               en: 'Counterparty' },
  'inv.material':  { ru: 'Материал',                 uz: 'Material',                 en: 'Material' },
  'inv.sum':       { ru: 'Сумма',                    uz: 'Summa',                    en: 'Amount' },
  // Dashboard keys
  docLoad:         { ru: 'Нагрузка врачей',          uz: 'Shifokorlar yuki',         en: 'Doctor load' },
  // CRM keys
  'crm.newLead':   { ru: 'Новый лид',                uz: 'Yangi lid',                en: 'New lead' },
  'crm.stage':     { ru: 'Этап',                     uz: 'Bosqich',                  en: 'Stage' },
  'crm.call':      { ru: 'Позвонить',                uz: "Qo'ng'iroq",               en: 'Call' },
  'crm.message':   { ru: 'Сообщение',                uz: 'Xabar',                    en: 'Message' },
  'crm.book':      { ru: 'Записать',                 uz: 'Yozish',                   en: 'Book visit' },
  'crm.timeline':  { ru: 'История',                  uz: 'Tarix',                    en: 'History' },
  'crm.curator':   { ru: 'Куратор',                  uz: 'Kurator',                  en: 'Curator' },
  'crm.value':     { ru: 'Потенциал',                uz: 'Salohiyat',                en: 'Potential' },
  'crm.source':    { ru: 'Источник',                 uz: 'Manba',                    en: 'Source' },
  // Funnel stage keys
  'fn.new':        { ru: 'Новый',                    uz: 'Yangi',                    en: 'New' },
  'fn.called':     { ru: 'Позвонили',                uz: "Qo'ng'iroq qilindi",       en: 'Called' },
  'fn.booked':     { ru: 'Записан',                  uz: 'Yozilgan',                 en: 'Booked' },
  'fn.arrived':    { ru: 'Пришёл',                   uz: 'Keldi',                    en: 'Arrived' },
  'fn.treatment':  { ru: 'Лечение',                  uz: 'Davolanish',               en: 'Treatment' },
};

export interface LangCtxType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

export const LangCtx = createContext<LangCtxType>({
  lang: 'ru',
  setLang: () => {},
  t: (k) => k,
});

export function useLang(): LangCtxType {
  return useContext(LangCtx);
}

export function createLangState(initial: Lang = 'ru') {
  const stored = (localStorage.getItem('lang') as Lang) || initial;
  return stored;
}

export function makeT(lang: Lang) {
  return (key: string): string => {
    const entry = DICT[key];
    if (!entry) return key;
    return entry[lang] || entry['ru'] || key;
  };
}

export const LANGS: Lang[] = ['ru', 'uz', 'en'];
