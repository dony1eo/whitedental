import { useState } from 'react'
import { X, Phone, MapPin, Plus } from 'lucide-react'
import { useLeads, useUpdateLeadStage, useCreateLead } from '../lib/queries'
import { uzs } from '../lib/api'
import { useLang } from '../i18n'

interface Lead {
  id: number
  name: string
  phone: string
  source: string
  stage: number
  potential: number
  notes?: string
}

const STAGES = [
  { key: 0, label: 'Новый',     color: 'var(--doc-indigo)' },
  { key: 1, label: 'Позвонили', color: 'var(--blue-500)'   },
  { key: 2, label: 'Записан',   color: 'var(--warn-500)'   },
  { key: 3, label: 'Пришёл',    color: 'var(--doc-orange)' },
  { key: 4, label: 'Лечение',   color: 'var(--success-500)'},
] as const

interface CardProps { lead: Lead; onDragStart: (id: number) => void; onDrop: (stageKey: number) => void; onClick: (l: Lead) => void }

function LeadCard({ lead, onDragStart, onClick }: CardProps) {
  const srcIcon: Record<string, string> = { phone: '📞', online: '🌐', messenger: '💬', ad: '📢' }
  return (
    <div
      className="lead-card"
      draggable
      onDragStart={() => onDragStart(lead.id)}
      onClick={() => onClick(lead)}
    >
      <div className="lead-card__top">
        <div className="lead-card__src" title={lead.source}>
          <span style={{ fontSize: 12 }}>{srcIcon[lead.source] || '📋'}</span>
        </div>
        <div className="lead-card__name">{lead.name}</div>
      </div>
      <div className="lead-card__phone">{lead.phone}</div>
      {lead.potential > 0 && (
        <div className="lead-card__foot">
          <span className="lead-card__val">{uzs(lead.potential)} UZS</span>
        </div>
      )}
    </div>
  )
}

interface DrawerProps { lead: Lead; onClose: () => void; onStageChange: (id: number, stage: number) => void }

function LeadDrawer({ lead, onClose, onStageChange }: DrawerProps) {
  const { t } = useLang()
  const stage = STAGES.find(s => s.key === lead.stage)

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer" onClick={e => e.stopPropagation()}>
        <div className="drawer__head">
          <h3 style={{ font: '700 18px var(--font-sans)', color: 'var(--ink-900)' }}>{lead.name}</h3>
          <button className="modal__close" onClick={onClose} type="button"><X size={20} /></button>
        </div>

        <div className="drawer__body">
          {stage && (
            <div className="drawer__stage" style={{ background: stage.color }}>
              {t('crm.stage')}: {stage.label}
            </div>
          )}

          <div className="pc-row">
            <span className="meta"><Phone size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />{t('phone')}</span>
            <a href={`tel:${lead.phone}`} style={{ fontWeight: 600 }}>{lead.phone}</a>
          </div>

          {lead.source && (
            <div className="pc-row">
              <span className="meta"><MapPin size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />{t('crm.source')}</span>
              <span>{lead.source}</span>
            </div>
          )}

          {lead.potential > 0 && (
            <div className="pc-row">
              <span className="meta">{t('crm.value')}</span>
              <b style={{ color: 'var(--success-500)' }}>{uzs(lead.potential)} UZS</b>
            </div>
          )}

          {lead.notes && (
            <div style={{ marginTop: 12, padding: '10px 12px', background: 'var(--surface-2)', borderRadius: 8, font: '400 14px var(--font-sans)', color: 'var(--ink-700)' }}>
              {lead.notes}
            </div>
          )}

          <div className="drawer__actions" style={{ marginTop: 16 }}>
            <button type="button" className="btn btn--outline btn--sm" style={{ flex: 1 }}>
              <Phone size={14} /> {t('crm.call')}
            </button>
            <button type="button" className="btn btn--outline btn--sm" style={{ flex: 1 }}>
              💬 {t('crm.message')}
            </button>
          </div>

          <div className="tasksec" style={{ marginTop: 22 }}>{t('crm.timeline')}</div>
          <div className="feed">
            <div className="feed__row">
              <div className="feed__icon" style={{ color: 'var(--blue-500)' }}><Phone size={14} /></div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{lead.source || 'Обращение'}</div>
                <div className="meta">Первичный контакт</div>
              </div>
            </div>
            {lead.stage > 0 && (
              <div className="feed__row">
                <div className="feed__icon" style={{ color: 'var(--success-500)' }}>✓</div>
                <div><div style={{ fontWeight: 700, fontSize: 14 }}>Звонок выполнен</div></div>
              </div>
            )}
          </div>

          <div className="tasksec" style={{ marginTop: 20 }}>Перенести в стадию</div>
          <div className="drawer__actions">
            {STAGES.filter(s => s.key !== lead.stage).map(s => (
              <button
                key={s.key}
                type="button"
                className="btn btn--ghost btn--sm"
                style={{ borderColor: s.color, color: s.color, flex: '1 1 auto' }}
                onClick={() => { onStageChange(lead.id, s.key); onClose() }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function NewLeadForm({ onClose }: { onClose: () => void }) {
  const { t } = useLang()
  const createLead = useCreateLead()
  const [form, setForm] = useState({ name: '', phone: '', source: 'online', potential: 0, notes: '' })

  function set(k: string, v: string | number) {
    setForm(prev => ({ ...prev, [k]: v }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name) return
    createLead.mutate(
      {
        name: form.name,
        phone: form.phone || undefined,
        source: form.source,
        potential: Number(form.potential),
        notes: form.notes || undefined,
      },
      { onSuccess: onClose }
    )
  }

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
        <div className="modal__head">
          <h1>{t('crm.newLead')}</h1>
          <button className="modal__close" onClick={onClose} type="button"><X size={22} /></button>
        </div>
        <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
          <div className="modal__body">
            <div className="formgrid">
              <div className="field">
                <label className="field__label">{t('name')} <span className="req-star">*</span></label>
                <div className="input">
                  <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Иванов Иван" required />
                </div>
              </div>
              <div className="field">
                <label className="field__label">{t('phone')}</label>
                <div className="input">
                  <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+998 90 000 00 00" />
                </div>
              </div>
              <div className="field">
                <label className="field__label">{t('source')}</label>
                <div className="input">
                  <select value={form.source} onChange={e => set('source', e.target.value)} style={{ width: '100%' }}>
                    <option value="online">Сайт</option>
                    <option value="phone">Звонок</option>
                    <option value="messenger">Мессенджер</option>
                    <option value="ad">Реклама</option>
                  </select>
                </div>
              </div>
              <div className="field">
                <label className="field__label">{t('crm.value')}</label>
                <div className="input">
                  <input type="number" min={0} value={form.potential || ''} onChange={e => set('potential', Number(e.target.value) || 0)} />
                </div>
              </div>
            </div>
            <div className="field" style={{ marginTop: 8 }}>
              <label className="field__label">{t('notes')}</label>
              <div className="input" style={{ height: 'auto', alignItems: 'flex-start', padding: '10px 14px' }}>
                <textarea rows={2} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Заметки..." style={{ border: 'none', outline: 'none', background: 'none', flex: 1, font: '400 14px var(--font-sans)', color: 'var(--ink-800)', resize: 'vertical', width: '100%' }} />
              </div>
            </div>
          </div>
          <div className="modal__foot">
            <button type="button" className="btn btn--ghost" onClick={onClose}>{t('cancel')}</button>
            <button type="submit" className="btn btn--primary" disabled={createLead.isPending}>{createLead.isPending ? 'Сохранение...' : t('save')}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function CrmPage() {
  const { t } = useLang()
  const { data, isLoading, error } = useLeads()
  const { mutate: updateStage } = useUpdateLeadStage()

  const [draggedId, setDraggedId] = useState<number | null>(null)
  const [overStage, setOverStage] = useState<number | null>(null)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [newLeadOpen, setNewLeadOpen] = useState(false)

  if (isLoading) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-500)' }}>Загрузка...</div>
  if (error) return <div style={{ padding: 40, color: 'var(--danger-500)' }}>Ошибка загрузки</div>

  const leads: Lead[] = data?.items ?? data ?? []

  const handleDrop = (stageKey: number) => {
    if (draggedId === null) return
    updateStage({ id: draggedId, stage: stageKey })
    setDraggedId(null)
    setOverStage(null)
  }

  const totalLeads = leads.length

  return (
    <div>
      <div className="screen__head">
        <div className="screen__titlewrap">
          <h1 style={{ font: '700 28px var(--font-sans)', color: 'var(--ink-900)' }}>{t('crm')}</h1>
          <span className="meta">{totalLeads} лидов</span>
        </div>
        <div className="screen__tools">
          <button className="btn btn--primary" onClick={() => setNewLeadOpen(true)}>
            <Plus size={16} /> {t('crm.newLead')}
          </button>
        </div>
      </div>

      <div className="kanban">
        {STAGES.map(stage => {
          const stageLeads = leads.filter(l => l.stage === stage.key)
          const stageSum = stageLeads.reduce((s, l) => s + (l.potential || 0), 0)

          return (
            <div
              key={stage.key}
              className={`kcol${overStage === stage.key ? ' kcol--over' : ''}`}
              onDragOver={e => { e.preventDefault(); setOverStage(stage.key) }}
              onDragLeave={() => setOverStage(o => o === stage.key ? null : o)}
              onDrop={() => handleDrop(stage.key)}
            >
              <div className="kcol__head" style={{ borderTopColor: stage.color }}>
                <div className="kcol__title">
                  <span className="kcol__dot" style={{ background: stage.color }} />
                  {stage.label}
                  <span className="kcol__n">{stageLeads.length}</span>
                </div>
                {stageSum > 0 && <div className="meta" style={{ fontSize: 12, marginTop: 2 }}>{uzs(stageSum, 0)} UZS</div>}
              </div>

              <div className="kcol__body">
                {stageLeads.map(lead => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    onDragStart={id => setDraggedId(id)}
                    onDrop={handleDrop}
                    onClick={l => setSelectedLead(l)}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {selectedLead && (
        <LeadDrawer
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onStageChange={(id, stage) => updateStage({ id, stage })}
        />
      )}

      {newLeadOpen && <NewLeadForm onClose={() => setNewLeadOpen(false)} />}
    </div>
  )
}
