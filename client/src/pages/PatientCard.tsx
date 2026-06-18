import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Phone, Calendar, User2, MapPin, FileText, Edit2 } from 'lucide-react'
import { usePatient } from '../lib/queries'
import { uzs } from '../lib/api'
import { useLang } from '../i18n'
import NewVisitModal from '../components/modals/NewVisitModal'

// ─── FDI Dental Chart ─────────────────────────────────────────────────────────

type ToothStatus =
  | 'healthy' | 'caries' | 'filling' | 'crown'
  | 'endo' | 'implant' | 'missing' | 'planned'

const TOOTH_COLORS: Record<ToothStatus, string> = {
  healthy:  '#dee2e6',
  caries:   '#fec943',
  filling:  '#0787c9',
  crown:    '#6c757d',
  endo:     '#e61b1b',
  implant:  '#1f8a4d',
  missing:  '#212529',
  planned:  '#8e90c8',
}

const LEGEND: { status: ToothStatus; label: string }[] = [
  { status: 'healthy',  label: 'Здоров' },
  { status: 'caries',   label: 'Кариес' },
  { status: 'filling',  label: 'Пломба' },
  { status: 'crown',    label: 'Коронка' },
  { status: 'endo',     label: 'Эндо' },
  { status: 'implant',  label: 'Имплант' },
  { status: 'missing',  label: 'Удалён' },
  { status: 'planned',  label: 'Плановый' },
]

// FDI numbering
const UPPER_RIGHT = [18, 17, 16, 15, 14, 13, 12, 11]
const UPPER_LEFT  = [21, 22, 23, 24, 25, 26, 27, 28]
const LOWER_LEFT  = [31, 32, 33, 34, 35, 36, 37, 38]
const LOWER_RIGHT = [48, 47, 46, 45, 44, 43, 42, 41]

interface ToothProps {
  num: number
  status: ToothStatus
  selected: boolean
  onClick: (n: number) => void
}

function ToothSvg({ num, status, selected, onClick }: ToothProps) {
  const isMolar = [6, 7, 8].includes(num % 10) || num % 10 === 0
  const fill = TOOTH_COLORS[status]
  return (
    <div
      className={`tooth${selected ? ' tooth--sel' : ''}`}
      onClick={() => onClick(num)}
      title={`${num} – ${status}`}
    >
      <svg width="28" height="30" viewBox="0 0 28 30" className="tooth__svg">
        {isMolar ? (
          <path
            d="M4 24 C2 20 2 8 6 5 C9 3 13 3 14 3 C15 3 19 3 22 5 C26 8 26 20 24 24 C22 27 18 28 14 28 C10 28 6 27 4 24Z"
            fill={fill}
            stroke="#adb5bd"
            strokeWidth="1"
          />
        ) : (
          <path
            d="M8 26 C6 22 5 10 8 5 C10 3 13 2 14 2 C15 2 18 3 20 5 C23 10 22 22 20 26 C18 29 10 29 8 26Z"
            fill={fill}
            stroke="#adb5bd"
            strokeWidth="1"
          />
        )}
      </svg>
      <span className="tooth__num">{num}</span>
    </div>
  )
}

interface DentalChartProps {
  formula: Record<number, ToothStatus>
  onChange: (num: number, status: ToothStatus) => void
}

function DentalChart({ formula, onChange }: DentalChartProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const getStatus = (n: number): ToothStatus => formula[n] ?? 'healthy'

  function handleClick(n: number) {
    setSelected(prev => {
      if (prev === n) {
        // second click: cycle status
        const statuses = Object.keys(TOOTH_COLORS) as ToothStatus[]
        const curr = statuses.indexOf(getStatus(n))
        const next = statuses[(curr + 1) % statuses.length]
        onChange(n, next)
        return null
      }
      return n
    })
  }

  return (
    <div style={{ padding: '20px 0' }}>
      {/* Upper jaw */}
      <div className="jawlabel">Верхняя челюсть</div>
      <div className="toothrow">
        {UPPER_RIGHT.map(n => (
          <ToothSvg key={n} num={n} status={getStatus(n)} selected={selected === n} onClick={handleClick} />
        ))}
        <div className="midline" />
        {UPPER_LEFT.map(n => (
          <ToothSvg key={n} num={n} status={getStatus(n)} selected={selected === n} onClick={handleClick} />
        ))}
      </div>

      <div style={{ height: 6 }} />

      {/* Lower jaw */}
      <div className="toothrow toothrow--lower">
        {LOWER_RIGHT.map(n => (
          <ToothSvg key={n} num={n} status={getStatus(n)} selected={selected === n} onClick={handleClick} />
        ))}
        <div className="midline" />
        {LOWER_LEFT.map(n => (
          <ToothSvg key={n} num={n} status={getStatus(n)} selected={selected === n} onClick={handleClick} />
        ))}
      </div>
      <div className="jawlabel">Нижняя челюсть</div>

      {/* Legend */}
      <div className="toothlegend">
        {LEGEND.map(({ status, label }) => (
          <span key={status} className="legchip">
            <span className="legchip__sw" style={{ background: TOOTH_COLORS[status], borderColor: TOOTH_COLORS[status] }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── Tabs ──────────────────────────────────────────────────────────────────────

const TABS = [
  { key: 'formula',  label: 'Зубная формула' },
  { key: 'plan',     label: 'План лечения' },
  { key: 'visits',   label: 'Визиты' },
  { key: 'payments', label: 'Платежи' },
  { key: 'files',    label: 'Файлы' },
  { key: 'feed',     label: 'Лента' },
]

// ─── Main Component ────────────────────────────────────────────────────────────

export default function PatientCard() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useLang()
  const [activeTab, setActiveTab] = useState('formula')
  const [formula, setFormula] = useState<Record<number, ToothStatus>>({})

  const patientId = Number(id)
  const [newVisitOpen, setNewVisitOpen] = useState(false)
  const { data: patient, isLoading, error } = usePatient(patientId)

  if (isLoading) return <div className="loading-center">Загрузка...</div>
  if (error || !patient) return <div className="error-center">Пациент не найден</div>

  const visits   = patient.visits   ?? []
  const payments = patient.payments ?? []

  const handleToothChange = (num: number, status: ToothStatus) => {
    setFormula(f => ({ ...f, [num]: status }))
  }

  const initial = (patient.name ?? '?')[0]?.toUpperCase()
  const avatarBg = patient.color || '#0787c9'

  return (
    <div>
      {/* Back link */}
      <button className="backlink" onClick={() => navigate('/patients')}>
        <ArrowLeft size={16} /> {t('patients')}
      </button>

      {/* Header card */}
      <div className="card pc-head">
        <div
          className="avatar"
          style={{ width: 52, height: 52, background: avatarBg, borderColor: avatarBg, color: '#fff', fontSize: 20, flex: '0 0 52px' }}
        >
          {initial}
        </div>
        <div className="pc-head__main">
          <h1>{patient.name}</h1>
          <div className="pc-head__meta">
            <span className="badge badge--neutral">№ {patient.cardNo}</span>
            <span className="pc-dot" />
            <span>{patient.phone}</span>
            <span className="pc-dot" />
            <span className={`badge ${patient.status === 'active' ? 'badge--success' : 'badge--neutral'}`}>
              {patient.status === 'active' ? 'Активный' : 'Неактивный'}
            </span>
            {patient.source && (
              <>
                <span className="pc-dot" />
                <span className="badge badge--info">{patient.source}</span>
              </>
            )}
          </div>
        </div>
        <div className="pc-head__actions">
          <button className="btn btn--primary btn--sm" onClick={() => setNewVisitOpen(true)}>{t('newVisit')}</button>
          <button className="btn btn--ghost btn--sm"><Edit2 size={14} /></button>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="pc-grid" style={{ marginTop: 18 }}>
        {/* Left sidebar */}
        <aside className="pc-side">
          <div className="card" style={{ padding: '18px 20px' }}>
            <div className="pc-balance">
              <span style={{ font: '400 13px var(--font-sans)', color: 'var(--ink-500)' }}>Баланс</span>
              <span
                className="pc-balance__v"
                style={{ color: (patient.balance ?? 0) < 0 ? 'var(--danger-500)' : 'var(--success-500)' }}
              >
                {uzs(patient.balance ?? 0)}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 24, marginBottom: 14 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ font: '700 18px var(--font-sans)', color: 'var(--ink-900)' }}>
                  {patient.visitsCount ?? 0}
                </span>
                <span style={{ font: '400 12px var(--font-sans)', color: 'var(--ink-500)' }}>визитов</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ font: '700 18px var(--font-sans)', color: 'var(--ink-900)' }}>
                  {patient.lastVisit
                    ? new Date(patient.lastVisit).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })
                    : '—'}
                </span>
                <span style={{ font: '400 12px var(--font-sans)', color: 'var(--ink-500)' }}>посл. визит</span>
              </div>
            </div>

            {/* Info rows */}
            <div className="pc-row">
              <span style={{ color: 'var(--ink-500)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Phone size={13} /> Телефон
              </span>
              <span>{patient.phone ?? '—'}</span>
            </div>
            {patient.birthDate && (
              <div className="pc-row">
                <span style={{ color: 'var(--ink-500)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Calendar size={13} /> Дата рождения
                </span>
                <span>{new Date(patient.birthDate).toLocaleDateString('ru-RU')}</span>
              </div>
            )}
            {patient.gender && (
              <div className="pc-row">
                <span style={{ color: 'var(--ink-500)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <User2 size={13} /> Пол
                </span>
                <span>{patient.gender === 'male' ? t('male') : t('female')}</span>
              </div>
            )}
            {patient.source && (
              <div className="pc-row">
                <span style={{ color: 'var(--ink-500)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <MapPin size={13} /> Источник
                </span>
                <span>{patient.source}</span>
              </div>
            )}
            {patient.doctor && (
              <div className="pc-row">
                <span style={{ color: 'var(--ink-500)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <User2 size={13} /> Врач
                </span>
                <span>{patient.doctor}</span>
              </div>
            )}
            {patient.notes && (
              <div className="pc-row" style={{ flexDirection: 'column', gap: 4, alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--ink-500)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FileText size={13} /> Заметки
                </span>
                <span style={{ font: '400 13px var(--font-sans)', color: 'var(--ink-600)', lineHeight: 1.45 }}>
                  {patient.notes}
                </span>
              </div>
            )}
          </div>
        </aside>

        {/* Main content */}
        <div className="pc-main">
          {/* Tabs */}
          <div className="tabs">
            {TABS.map(tab => (
              <button
                key={tab.key}
                className={`tab ${activeTab === tab.key ? 'is-active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ marginTop: 20 }}>
            {/* Formula tab */}
            {activeTab === 'formula' && (
              <div className="card" style={{ padding: '18px 24px' }}>
                <DentalChart formula={formula} onChange={handleToothChange} />
              </div>
            )}

            {/* Treatment plan tab */}
            {activeTab === 'plan' && (
              <div className="empty-state">
                <p>Нет плана лечения</p>
              </div>
            )}

            {/* Visits tab */}
            {activeTab === 'visits' && (
              <div className="card tablecard">
                <table className="dtable">
                  <thead>
                    <tr>
                      <th>Дата</th>
                      <th>Врач</th>
                      <th>Услуга</th>
                      <th>Статус</th>
                      <th>Сумма</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visits.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', color: 'var(--ink-400)', padding: 32 }}>
                          Визитов нет
                        </td>
                      </tr>
                    ) : (
                      (visits as Array<{
                        id: number
                        date: string
                        doctor: string
                        service: string
                        status: string
                        amount: number
                      }>).map(v => (
                        <tr key={v.id}>
                          <td>{new Date(v.date).toLocaleDateString('ru-RU')}</td>
                          <td>{v.doctor}</td>
                          <td>{v.service}</td>
                          <td><span className="badge badge--info">{v.status}</span></td>
                          <td>{uzs(v.amount)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Payments tab */}
            {activeTab === 'payments' && (
              <div className="card tablecard">
                <table className="dtable">
                  <thead>
                    <tr>
                      <th>Дата</th>
                      <th>Метод</th>
                      <th>Сумма</th>
                      <th>Комментарий</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.length === 0 ? (
                      <tr>
                        <td colSpan={4} style={{ textAlign: 'center', color: 'var(--ink-400)', padding: 32 }}>
                          Платежей нет
                        </td>
                      </tr>
                    ) : (
                      (payments as Array<{
                        id: number
                        date: string
                        method: string
                        amount: number
                        comment: string
                      }>).map(p => (
                        <tr key={p.id}>
                          <td>{new Date(p.date).toLocaleDateString('ru-RU')}</td>
                          <td><span className="badge badge--neutral">{p.method}</span></td>
                          <td style={{ color: 'var(--success-500)', fontWeight: 600 }}>{uzs(p.amount)}</td>
                          <td>{p.comment}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Files tab */}
            {activeTab === 'files' && (
              <div className="empty-state"><p>Файлов нет</p></div>
            )}

            {/* Feed tab */}
            {activeTab === 'feed' && (
              <div className="empty-state"><p>Лента пуста</p></div>
            )}
          </div>
        </div>
      </div>

      <NewVisitModal open={newVisitOpen} onClose={() => setNewVisitOpen(false)} />
    </div>
  )
}
