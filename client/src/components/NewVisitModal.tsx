import { useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import { useCreateAppointment, usePatients, useStaff, useServices } from '../lib/queries'
import { useLang } from '../i18n'

interface Props {
  onClose: () => void
}

export default function NewVisitModal({ onClose }: Props) {
  const { t } = useLang()
  const { mutate: createAppointment, isPending } = useCreateAppointment()
  const { data: patientsData } = usePatients({ page: 1 })
  const { data: staffData }    = useStaff({ role: 'doctor' })
  const { data: servicesData } = useServices()

  const patients  = patientsData?.items  ?? patientsData  ?? []
  const doctors   = staffData?.items     ?? staffData     ?? []
  const services  = servicesData?.items  ?? servicesData  ?? []

  const today = new Date().toISOString().split('T')[0]

  const [form, setForm] = useState({
    patientId:  '',
    doctorId:   '',
    serviceId:  '',
    date:       today,
    startTime:  '09:00',
    endTime:    '09:30',
    chair:      '1',
    notes:      '',
  })

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    createAppointment(
      {
        patientId: Number(form.patientId),
        doctorId:  Number(form.doctorId),
        serviceId: Number(form.serviceId),
        date:      form.date,
        startTime: form.startTime,
        endTime:   form.endTime,
        chair:     Number(form.chair),
        notes:     form.notes,
      },
      { onSuccess: onClose }
    )
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h3 className="modal__title">{t('newVisit')}</h3>
          <button className="btn btn--ghost btn--icon" onClick={onClose}><X size={18} /></button>
        </div>

        <form className="modal__body" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{t('patient')}</label>
              <select className="form-input" value={form.patientId} onChange={set('patientId')} required>
                <option value="">— выберите —</option>
                {(patients as Array<{ id: number; name: string }>).map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">{t('doctor')}</label>
              <select className="form-input" value={form.doctorId} onChange={set('doctorId')} required>
                <option value="">— выберите —</option>
                {(doctors as Array<{ id: number; name: string }>).map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Услуга</label>
            <select className="form-input" value={form.serviceId} onChange={set('serviceId')}>
              <option value="">— выберите —</option>
              {(services as Array<{ id: number; name: string }>).map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Дата</label>
              <input type="date" className="form-input" value={form.date} onChange={set('date')} required />
            </div>
            <div className="form-group">
              <label className="form-label">Начало</label>
              <input type="time" className="form-input" value={form.startTime} onChange={set('startTime')} required />
            </div>
            <div className="form-group">
              <label className="form-label">Конец</label>
              <input type="time" className="form-input" value={form.endTime} onChange={set('endTime')} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Кресло</label>
              <input type="number" min={1} max={10} className="form-input" value={form.chair} onChange={set('chair')} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t('notes')}</label>
            <textarea className="form-input" rows={2} value={form.notes} onChange={set('notes')} />
          </div>

          <div className="modal__footer">
            <button type="button" className="btn btn--ghost" onClick={onClose}>{t('cancel')}</button>
            <button type="submit" className="btn btn--primary" disabled={isPending}>
              {isPending ? 'Сохранение...' : t('save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
