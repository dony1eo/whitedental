import { TrendingUp, Wallet, UserPlus, AlertCircle } from 'lucide-react'
import { useDashboard } from '../lib/queries'
import { uzs } from '../lib/api'
import { useLang } from '../i18n'

const WEEK = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const STATIC_WEEK = [
  { income: 4800000, expense: 2200000 },
  { income: 6200000, expense: 3100000 },
  { income: 5400000, expense: 2800000 },
  { income: 7100000, expense: 3400000 },
  { income: 8900000, expense: 4200000 },
  { income: 3200000, expense: 1400000 },
  { income: 5600000, expense: 2700000 },
]
const CRM_STAGES = ['Новый', 'Позвонили', 'Запись', 'Пришёл', 'Лечение']
const STAGE_COLORS = ['#0787c9', '#f39c12', '#8e44ad', '#27ae60', '#e74c3c']

function DocLoadBar({ value, color }: { value: number; color: string }) {
  return (
    <div style={{ height: 6, background: 'var(--line-200)', borderRadius: 4, overflow: 'hidden' }}>
      <div style={{ width: `${Math.min(value, 100)}%`, height: '100%', background: color, borderRadius: 4, transition: 'width .3s ease' }} />
    </div>
  )
}

function DoctorAvatar({ name, color }: { name: string; color: string }) {
  const initials = name.split(' ').map(p => p[0]).slice(0, 2).join('')
  return (
    <div style={{ width: 28, height: 28, borderRadius: '50%', background: color + '22', border: `1.5px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color, flexShrink: 0 }}>
      {initials}
    </div>
  )
}

export default function DashboardPage() {
  const { t } = useLang()
  const { data, isLoading } = useDashboard()

  if (isLoading) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-500)' }}>Загрузка...</div>

  const kpis = data?.kpis || {}
  const appointments: Array<{ id: number; startTime: string; patient: { firstName: string; lastName: string }; doctor: { name: string; color: string }; status: string }> = data?.appointments || []
  const leads: Array<{ stage: number; _count?: number }> = data?.leads || []
  const lowStock: Array<{ id: number; name: string; stock: number; minStock: number; unit: string }> = data?.lowStock || []
  const docLoad: Array<{ id: number; name: string; color: string; appts: number; load: number }> = data?.docLoad || []

  const maxBar = Math.max(...STATIC_WEEK.map(d => Math.max(d.income, d.expense)), 1)

  const stageCount = CRM_STAGES.map((_, i) => {
    const entry = leads.find(l => l.stage === i)
    return entry?._count || 0
  })
  const maxStage = Math.max(...stageCount, 1)

  return (
    <div>
      <div className="screen__head">
        <div className="screen__titlewrap"><h1>{t('dashboard')}</h1></div>
      </div>

      {/* KPIs */}
      <div className="kpis">
        {[
          { icon: <TrendingUp size={22} color="#fff" />, label: 'Выручка сегодня', value: uzs(kpis.revenueToday || 0), bg: '#0787c9' },
          { icon: <Wallet size={22} color="#fff" />, label: t('balance'), value: uzs(kpis.cashbox || 0), bg: '#1f8a4d' },
          { icon: <UserPlus size={22} color="#fff" />, label: t('newPatients'), value: String(kpis.newPatients ?? 0), bg: '#7c3aed' },
          { icon: <AlertCircle size={22} color="#fff" />, label: t('debtors'), value: String(kpis.debtors ?? 0) + ' чел.', bg: '#e53935' },
        ].map((k, i) => (
          <div key={i} className="card kpi">
            <div className="kpi__icon" style={{ background: k.bg }}>{k.icon}</div>
            <div className="kpi__body">
              <div className="kpi__label">{k.label}</div>
              <div className="kpi__value">{k.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashgrid">
        <div className="dashcol">
          {/* Weekly revenue bar chart */}
          <div className="card" style={{ padding: '20px 24px' }}>
            <div className="cardhead">
              <h3>Выручка за неделю</h3>
              <div className="legend">
                <span><i style={{ background: '#0787c9' }} />Доходы</span>
                <span><i style={{ background: '#e74c3c' }} />Расходы</span>
              </div>
            </div>
            <div className="barchart">
              {WEEK.map((day, i) => {
                const d = STATIC_WEEK[i]
                const incH = Math.round((d.income / maxBar) * 140)
                const expH = Math.round((d.expense / maxBar) * 140)
                return (
                  <div key={day} className="barchart__col">
                    <div className="barchart__bars">
                      <div className="barchart__bar" style={{ height: incH, background: '#0787c9' }} title={uzs(d.income)} />
                      <div className="barchart__bar" style={{ height: expH, background: '#e74c3c' }} title={uzs(d.expense)} />
                    </div>
                    <span className="barchart__lbl">{day}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Today's appointments timeline */}
          <div className="card" style={{ padding: '0' }}>
            <div style={{ padding: '16px 20px 12px' }}>
              <div className="cardhead" style={{ marginBottom: 0 }}>
                <h3>Записи сегодня</h3>
                <span className="meta">{appointments.length} визитов</span>
              </div>
            </div>
            <div className="tline">
              {appointments.length === 0 ? (
                <div style={{ padding: '16px 20px', color: 'var(--ink-500)' }}>Записей нет</div>
              ) : appointments.slice(0, 5).map(a => {
                const time = new Date(a.startTime).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })
                const statusMap: Record<string, string> = {
                  confirmed: 'success', not_confirmed: 'warn', arrived: 'info', in_chair: 'info', done: 'success', cancelled: 'danger'
                }
                return (
                  <div key={a.id} className="tline__row">
                    <span className="tline__time">{time}</span>
                    <div className="tline__bar" style={{ background: a.doctor.color }} />
                    <div className="tline__body">
                      <div className="tline__name">{a.patient.lastName} {a.patient.firstName}</div>
                      <div className="meta">{a.doctor.name}</div>
                    </div>
                    <span className={`badge badge--${statusMap[a.status] || 'neutral'}`}>{a.status}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="dashcol">
          {/* CRM Funnel */}
          <div className="card" style={{ padding: '20px 24px' }}>
            <div className="cardhead"><h3>CRM воронка</h3></div>
            <div className="funnel">
              {CRM_STAGES.map((label, i) => {
                const count = stageCount[i]
                const pct = Math.round((count / maxStage) * 100) || 4
                return (
                  <div key={i} className="funnel__row">
                    <span className="funnel__lbl">{label}</span>
                    <div className="funnel__track">
                      <div className="funnel__fill" style={{ width: `${pct}%`, background: STAGE_COLORS[i] }}>
                        {count > 0 ? count : ''}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Doctor load */}
          <div className="card" style={{ padding: '20px 24px' }}>
            <div className="cardhead">
              <h3>{t('docLoad')}</h3>
              <span className="meta">{docLoad.reduce((s, d) => s + d.appts, 0)} визитов</span>
            </div>
            {docLoad.length === 0 ? (
              <div className="docload">
                {[
                  { name: 'Нуруллахон Асадуллаев', color: '#e74c3c', load: 88, appts: 9 },
                  { name: 'Бахшиллаева Согдиана',  color: '#f39c12', load: 74, appts: 7 },
                  { name: 'Бехзод Жалолов',         color: '#27ae60', load: 62, appts: 6 },
                  { name: 'Комола Мирабидова',       color: '#8e44ad', load: 55, appts: 5 },
                  { name: 'Омонов Зухриддин',        color: '#0787c9', load: 40, appts: 4 },
                ].map((d, i) => (
                  <div key={i} className="docload__row">
                    <DoctorAvatar name={d.name} color={d.color} />
                    <div className="docload__body">
                      <div className="docload__top">
                        <span className="docload__name">{d.name}</span>
                        <span className="meta">{d.appts} · {d.load}%</span>
                      </div>
                      <DocLoadBar value={d.load} color={d.color} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="docload">
                {docLoad.slice(0, 5).map(d => (
                  <div key={d.id} className="docload__row">
                    <DoctorAvatar name={d.name} color={d.color || '#0787c9'} />
                    <div className="docload__body">
                      <div className="docload__top">
                        <span className="docload__name">{d.name}</span>
                        <span className="meta">{d.appts} · {d.load}%</span>
                      </div>
                      <DocLoadBar value={d.load} color={d.color || '#0787c9'} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Low stock */}
          <div className="card" style={{ padding: '20px 24px' }}>
            <div className="cardhead">
              <h3>{t('lowStock')}</h3>
              <a href="/inventory" style={{ font: '700 13px var(--font-sans)' }}>Склад →</a>
            </div>
            <div className="lowstock">
              {lowStock.length === 0 ? (
                <div style={{ color: 'var(--ink-500)', fontSize: 14 }}>Всё в норме</div>
              ) : lowStock.map(item => {
                const isDanger = item.stock <= item.minStock / 2
                return (
                  <div key={item.id} className="lowstock__row">
                    <div className={`dot ${isDanger ? 'dot--danger' : 'dot--warn'}`} />
                    <span className="lowstock__name">{item.name}</span>
                    <span className="lowstock__left" style={{ color: isDanger ? 'var(--danger-500)' : 'var(--warn-700)' }}>
                      {item.stock} {item.unit}
                    </span>
                    <button className="lowstock__order">{t('order')}</button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
