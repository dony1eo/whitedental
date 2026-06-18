import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Plus, UserCog } from 'lucide-react'
import { useAppointments, useStaff } from '../lib/queries'
import { useLang } from '../i18n'
import NewVisitModal from '../components/modals/NewVisitModal'

const PXMIN = 1.15
const HOUR_H = PXMIN * 60
const START_HOUR = 9
const END_HOUR   = 22

const HOURS: string[] = []
for (let h = START_HOUR; h <= END_HOUR; h++) {
  HOURS.push(`${String(h).padStart(2, '0')}:00`)
  if (h < END_HOUR) HOURS.push(`${String(h).padStart(2, '0')}:30`)
}

function getLocalHM(iso: string): { h: number; m: number } {
  const d = new Date(iso)
  if (isNaN(d.getTime())) {
    const [h, m] = iso.split(':').map(Number)
    return { h: h || 0, m: m || 0 }
  }
  return { h: d.getHours(), m: d.getMinutes() }
}

function toMinutes(iso: string): number {
  const { h, m } = getLocalHM(iso)
  return h * 60 + m
}

function offsetFromTop(iso: string): number {
  return (toMinutes(iso) - START_HOUR * 60) * PXMIN
}

function durationPx(start: string, end: string): number {
  return (toMinutes(end) - toMinutes(start)) * PXMIN
}

function dateToISO(d: Date): string {
  return d.toISOString().split('T')[0]
}

export default function CalendarPage() {
  const { t } = useLang()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [newVisitOpen, setNewVisitOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'doctors' | '1day'>('doctors')
  const [filterDoctor, setFilterDoctor] = useState<string>('all')
  const bodyRef = useRef<HTMLDivElement>(null)
  const dateStr = dateToISO(currentDate)

  const { data: apptData, isLoading: apptLoading } = useAppointments({ date: dateStr })
  const { data: staffData, isLoading: staffLoading } = useStaff({ role: 'doctor' })

  const [nowOffset, setNowOffset] = useState<number | null>(null)
  useEffect(() => {
    const calc = () => {
      const now = new Date()
      const mins = now.getHours() * 60 + now.getMinutes()
      const offset = (mins - START_HOUR * 60) * PXMIN
      setNowOffset(offset >= 0 && offset <= (END_HOUR - START_HOUR) * HOUR_H ? offset : null)
    }
    calc()
    const id = setInterval(calc, 60_000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (bodyRef.current && nowOffset !== null) {
      bodyRef.current.scrollTop = Math.max(0, nowOffset - 100)
    }
  }, [nowOffset])

  const prevDay = () => setCurrentDate(d => { const n = new Date(d); n.setDate(n.getDate() - 1); return n })
  const nextDay = () => setCurrentDate(d => { const n = new Date(d); n.setDate(n.getDate() + 1); return n })
  const goToday = () => setCurrentDate(new Date())

  const appointments: Array<{
    id: number
    doctorId: number
    patient?: { firstName: string; lastName: string }
    service?: string
    startTime: string
    endTime: string
    status: string
  }> = apptData?.items ?? apptData ?? []

  const doctors: Array<{ id: number; name: string; color?: string }> =
    staffData?.items ?? staffData ?? []

  const filteredDoctors = filterDoctor === 'all'
    ? doctors
    : doctors.filter(d => String(d.id) === filterDoctor)

  const totalHeight = (END_HOUR - START_HOUR) * HOUR_H + HOUR_H

  if (apptLoading || staffLoading) return (
    <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-500)' }}>Загрузка...</div>
  )

  return (
    <div className="screen--cal">
      <div className="caltabs">
        <button
          className={`caltab ${viewMode === 'doctors' ? 'is-active' : ''}`}
          onClick={() => setViewMode('doctors')}
        >
          <UserCog size={15} /> {t('staff')}
        </button>
        <button
          className={`caltab ${viewMode === '1day' ? 'is-active' : ''}`}
          onClick={() => setViewMode('1day')}
        >
          1 день
        </button>
      </div>

      <div className="caltoolbar">
        <div className="caltoolbar__left">
          <span className="caltoolbar__lbl">{t('calendar')}:</span>
          <div className="input" style={{ width: 160, height: 36 }}>
            <select
              value={filterDoctor}
              onChange={e => setFilterDoctor(e.target.value)}
              style={{ width: '100%', border: 'none', background: 'none', font: '400 14px var(--font-sans)', color: 'var(--ink-800)' }}
            >
              <option value="all">Все врачи</option>
              {doctors.map(d => (
                <option key={d.id} value={String(d.id)}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="caltoolbar__right">
          <div className="cal-datenav">
            <button onClick={prevDay}><ChevronLeft size={16} /></button>
            <span>
              {currentDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <button onClick={nextDay}><ChevronRight size={16} /></button>
          </div>
          <button className="btn btn--outline btn--sm" onClick={goToday}>{t('today')}</button>
          <button className="btn btn--primary btn--sm" onClick={() => setNewVisitOpen(true)}>
            <Plus size={14} /> {t('newVisit')}
          </button>
        </div>
      </div>

      <div className="card calgrid" style={{ flex: 1, minHeight: 0 }}>
        <div className="calgrid__head">
          <div className="calgrid__corner" />
          {filteredDoctors.length === 0 ? (
            <div style={{ padding: '10px 16px', color: 'var(--ink-500)', fontSize: 14 }}>Нет врачей</div>
          ) : (
            filteredDoctors.map(doc => (
              <div
                key={doc.id}
                className="calcol__head"
                style={{ background: doc.color || '#0787c9', color: '#fff' }}
              >
                <div
                  style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}
                >
                  {doc.name.split(' ').map(p => p[0]).slice(0, 2).join('')}
                </div>
                <span className="calcol__name">{doc.name}</span>
              </div>
            ))
          )}
        </div>

        <div className="calgrid__body" ref={bodyRef}>
          <div className="caltime" style={{ height: totalHeight }}>
            {HOURS.map(h => (
              <div key={h} className="caltime__row" style={{ height: 30 * PXMIN }}>
                {h.endsWith(':00') ? h : ''}
              </div>
            ))}
          </div>

          <div className="calcols" style={{ height: totalHeight }}>
            {nowOffset !== null && (
              <div className="calnow" style={{ top: nowOffset }} />
            )}

            {filteredDoctors.length === 0 ? (
              <div style={{ padding: '40px 20px', color: 'var(--ink-400)', fontSize: 14 }}>
                Нет записей на этот день
              </div>
            ) : (
              filteredDoctors.map(doc => {
                const docAppts = appointments.filter(a => a.doctorId === doc.id)
                const borderColor = doc.color || '#0787c9'
                return (
                  <div key={doc.id} className="calcol">
                    {HOURS.map(h => (
                      <div key={h} className="calcol__slot" style={{ height: 30 * PXMIN }} />
                    ))}
                    {docAppts.map(appt => {
                      const topPx = offsetFromTop(appt.startTime)
                      const hPx   = durationPx(appt.startTime, appt.endTime)
                      if (topPx < 0 || hPx < 0) return null
                      const patName = appt.patient
                        ? `${appt.patient.lastName} ${appt.patient.firstName}`
                        : '—'
                      const isConfirmed = appt.status === 'confirmed'
                      const startHM = (() => { const {h,m} = getLocalHM(appt.startTime); return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}` })()
                      const endHM   = (() => { const {h,m} = getLocalHM(appt.endTime);   return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}` })()
                      return (
                        <div
                          key={appt.id}
                          className={`appt${isConfirmed ? ' appt--confirmed' : ''}`}
                          style={{
                            top: topPx,
                            height: Math.max(hPx - 4, 24),
                            borderLeftColor: borderColor,
                            borderLeftWidth: 4,
                          }}
                          title={`${patName} · ${appt.service || ''}`}
                        >
                          <div className="appt__name">{patName}</div>
                          <div className="appt__time">{startHM}–{endHM}</div>
                          {appt.service && hPx > 48 && (
                            <div className="appt__note">{appt.service}</div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      <NewVisitModal open={newVisitOpen} onClose={() => setNewVisitOpen(false)} />
    </div>
  )
}
