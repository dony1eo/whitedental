import { useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import { useCreatePatient } from '../lib/queries'
import { useLang } from '../i18n'

interface Props {
  onClose: () => void
}

const SOURCES = ['Instagram', 'Сарафанное радио', 'Google', '2ГИС', 'Telegram', 'Другое']
const GENDERS = [
  { value: 'male',   label: 'Мужской' },
  { value: 'female', label: 'Женский' },
]

export default function AddPatientModal({ onClose }: Props) {
  const { t } = useLang()
  const { mutate: createPatient, isPending } = useCreatePatient()

  const [form, setForm] = useState({
    firstName:  '',
    lastName:   '',
    middleName: '',
    phone:      '',
    birthDate:  '',
    gender:     'male',
    source:     '',
    notes:      '',
  })

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    createPatient(
      {
        name: `${form.lastName} ${form.firstName} ${form.middleName}`.trim(),
        ...form,
      },
      { onSuccess: onClose }
    )
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={ev => ev.stopPropagation()}>
        <div className="modal__header">
          <h3 className="modal__title">{t('addPatient')}</h3>
          <button className="btn btn--ghost btn--icon" onClick={onClose}><X size={18} /></button>
        </div>

        <form className="modal__body" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{t('lastName')}</label>
              <input className="form-input" value={form.lastName}   onChange={set('lastName')}   required />
            </div>
            <div className="form-group">
              <label className="form-label">{t('firstName')}</label>
              <input className="form-input" value={form.firstName}  onChange={set('firstName')}  required />
            </div>
            <div className="form-group">
              <label className="form-label">{t('middleName')}</label>
              <input className="form-input" value={form.middleName} onChange={set('middleName')} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{t('phone')}</label>
              <input
                type="tel"
                className="form-input"
                value={form.phone}
                onChange={set('phone')}
                placeholder="+998 __ ___ __ __"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">{t('birthDate')}</label>
              <input type="date" className="form-input" value={form.birthDate} onChange={set('birthDate')} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{t('gender')}</label>
              <select className="form-input" value={form.gender} onChange={set('gender')}>
                {GENDERS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">{t('source')}</label>
              <select className="form-input" value={form.source} onChange={set('source')}>
                <option value="">— выберите —</option>
                {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
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
