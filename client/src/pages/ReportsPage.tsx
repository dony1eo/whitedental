import { useState } from 'react';
import {
  BarChart3, TrendingUp, Users, CalendarDays,
  Package, Wallet, Star,
} from 'lucide-react';
import { useReportByDoctor } from '../lib/queries';
import { uzs } from '../lib/api';
import { useLang } from '../i18n';

const DOCTOR_COLORS = [
  'var(--doc-red)', 'var(--doc-blue)', 'var(--doc-green)', 'var(--doc-indigo)',
  'var(--doc-magenta)', 'var(--doc-orange)', 'var(--doc-olive)', 'var(--doc-purple)',
];

const now = new Date();

const REPORT_CARDS = [
  { Icon: BarChart3, title: 'Выручка по врачам', desc: 'По врачу за период' },
  { Icon: TrendingUp, title: 'Выручка по услугам', desc: 'Топ услуг по обороту' },
  { Icon: Users, title: 'Поток пациентов', desc: 'Новые vs возвращающиеся' },
  { Icon: CalendarDays, title: 'Загрузка расписания', desc: 'Занятость кресел' },
  { Icon: Package, title: 'Расход материалов', desc: 'Списания по периоду' },
  { Icon: Wallet, title: 'P&L сводный', desc: 'Доходы и расходы' },
  { Icon: Star, title: 'NPS / Отзывы', desc: 'Средняя оценка клиники' },
];

export default function ReportsPage() {
  const { t } = useLang();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const { data, isLoading } = useReportByDoctor(month, year);
  const rows: any[] = data?.items ?? data?.doctors ?? data ?? [];

  const maxRevenue = rows.reduce((m: number, r: any) => Math.max(m, r.revenue ?? 0), 1);

  const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - 2 + i);
  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
  ];

  return (
    <div>
      <div className="screen__head">
        <div className="screen__titlewrap">
          <h1 style={{ font: '700 28px var(--font-sans)', color: 'var(--ink-900)' }}>{t('reports')}</h1>
        </div>
        <div className="screen__tools">
          <div className="input" style={{ width: 160, height: 40 }}>
            <select
              value={month}
              onChange={e => setMonth(Number(e.target.value))}
              style={{ width: '100%' }}
            >
              {monthNames.map((n, i) => (
                <option key={i + 1} value={i + 1}>{n}</option>
              ))}
            </select>
          </div>
          <div className="input" style={{ width: 100, height: 40 }}>
            <select
              value={year}
              onChange={e => setYear(Number(e.target.value))}
              style={{ width: '100%' }}
            >
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Horizontal bar chart */}
      <div className="card" style={{ padding: '22px 24px', marginTop: 24 }}>
        <div className="cardhead">
          <h3>Выручка по врачам — {monthNames[month - 1]} {year}</h3>
        </div>
        {isLoading ? (
          <div className="placeholder" style={{ padding: 40 }}><p>Загрузка...</p></div>
        ) : rows.length === 0 ? (
          <div className="placeholder" style={{ padding: 40 }}><p>Нет данных за период</p></div>
        ) : (
          <div className="hbars">
            {rows.map((r: any, i: number) => {
              const pct = maxRevenue > 0 ? ((r.revenue ?? 0) / maxRevenue) * 100 : 0;
              const color = r.color ?? DOCTOR_COLORS[i % DOCTOR_COLORS.length];
              return (
                <div key={r.id ?? i} className="hbar">
                  <div className="hbar__name">{r.doctorName ?? r.name}</div>
                  <div className="hbar__track">
                    <div
                      className="hbar__fill"
                      style={{ width: `${pct}%`, background: color }}
                    />
                  </div>
                  <div className="hbar__val">
                    {uzs(r.revenue ?? 0)}
                    {r.visitsCount != null && (
                      <small style={{ display: 'block' }}>{r.visitsCount} визитов</small>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Report cards */}
      <h2 style={{ font: '700 18px var(--font-sans)', color: 'var(--ink-800)', margin: '32px 0 16px' }}>
        Все отчёты
      </h2>
      <div className="repgrid">
        {REPORT_CARDS.map(({ Icon, title, desc }) => (
          <div key={title} className="card repcard">
            <div className="repcard__icon">
              <Icon size={22} />
            </div>
            <div className="repcard__body">
              <div className="repcard__title">{title}</div>
              <div style={{ font: '400 13px var(--font-sans)', color: 'var(--ink-500)', marginTop: 4 }}>
                {desc}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
