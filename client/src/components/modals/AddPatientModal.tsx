import { useState } from 'react';
import { X } from 'lucide-react';
import { useCreatePatient } from '../../lib/queries';
import { useLang } from '../../i18n';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AddPatientModal({ open, onClose }: Props) {
  const { t } = useLang();
  const createPatient = useCreatePatient();

  const [form, setForm] = useState({
    lastName: '',
    firstName: '',
    middleName: '',
    gender: 'male',
    dateOfBirth: '',
    phone: '',
    email: '',
    source: '',
    notes: '',
  });
  const [saveError, setSaveError] = useState('');

  function set(key: string, val: string) {
    setForm(prev => ({ ...prev, [key]: val }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaveError('');
    if (!form.lastName.trim() || !form.firstName.trim()) {
      setSaveError('Фамилия и Имя обязательны');
      return;
    }
    createPatient.mutate(
      {
        lastName: form.lastName.trim(),
        firstName: form.firstName.trim(),
        middleName: form.middleName.trim() || undefined,
        gender: form.gender,
        dateOfBirth: form.dateOfBirth || undefined,
        phone: form.phone.trim() || undefined,
        email: form.email.trim() || undefined,
        source: form.source || undefined,
        notes: form.notes.trim() || undefined,
      },
      { 
        onSuccess: () => {
          setForm({ lastName: '', firstName: '', middleName: '', gender: 'male', dateOfBirth: '', phone: '', email: '', source: '', notes: '' });
          onClose();
        },
        onError: (err: any) => {
          const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message || 'Ошибка при создании пациента';
          setSaveError(msg);
        }
      }
    );
  }

  if (!open) return null;

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 580 }}>
        <div className="modal__head">
          <h1>{t('addPatient')}</h1>
          <button className="modal__close" onClick={onClose} type="button">
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
          <div className="modal__body">
            <div className="formgrid--3 formgrid">
              {/* Last name */}
              <div className="field">
                <label className="field__label">
                  {t('lastName')} <span className="req-star">*</span>
                </label>
                <div className="input">
                  <input
                    value={form.lastName}
                    onChange={e => set('lastName', e.target.value)}
                    placeholder="Иванов"
                    required
                  />
                </div>
              </div>
              {/* First name */}
              <div className="field">
                <label className="field__label">
                  {t('firstName')} <span className="req-star">*</span>
                </label>
                <div className="input">
                  <input
                    value={form.firstName}
                    onChange={e => set('firstName', e.target.value)}
                    placeholder="Иван"
                    required
                  />
                </div>
              </div>
              {/* Middle name */}
              <div className="field">
                <label className="field__label">{t('middleName')}</label>
                <div className="input">
                  <input
                    value={form.middleName}
                    onChange={e => set('middleName', e.target.value)}
                    placeholder="Иванович"
                  />
                </div>
              </div>
            </div>

            <div className="formgrid">
              {/* Gender */}
              <div className="field">
                <label className="field__label">{t('gender')}</label>
                <div style={{ display: 'flex', gap: 18, marginTop: 4 }}>
                  {(['male', 'female'] as const).map(g => (
                    <label key={g} style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', font: '400 15px var(--font-sans)', color: 'var(--ink-800)' }}>
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={form.gender === g}
                        onChange={() => set('gender', g)}
                        style={{ accentColor: 'var(--blue-500)' }}
                      />
                      {g === 'male' ? t('male') : t('female')}
                    </label>
                  ))}
                </div>
              </div>

              {/* Birth date */}
              <div className="field">
                <label className="field__label">{t('birthDate')}</label>
                <div className="input">
                  <input
                    type="date"
                    value={form.dateOfBirth}
                    onChange={e => set('dateOfBirth', e.target.value)}
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="field">
                <label className="field__label">{t('phone')}</label>
                <div className="input">
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => set('phone', e.target.value)}
                    placeholder="+998 90 000 00 00"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="field">
                <label className="field__label">{t('email')}</label>
                <div className="input">
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => set('email', e.target.value)}
                    placeholder="patient@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Source */}
            <div className="field">
              <label className="field__label">{t('source')}</label>
              <div className="input">
                <select
                  value={form.source}
                  onChange={e => set('source', e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="">—</option>
                  <option>Звонок</option>
                  <option>Сайт</option>
                  <option>Instagram</option>
                  <option>Telegram</option>
                  <option>WhatsApp</option>
                  <option>Рекомендация</option>
                  <option>Повторный</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div className="field">
              <label className="field__label">{t('notes')}</label>
              <div
                className="input"
                style={{ height: 'auto', alignItems: 'flex-start', padding: '10px 14px' }}
              >
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={e => set('notes', e.target.value)}
                  placeholder="Примечания о пациенте..."
                  style={{
                    border: 'none', outline: 'none', background: 'none',
                    flex: 1, font: '400 15px var(--font-sans)',
                    color: 'var(--ink-800)', resize: 'vertical', width: '100%',
                  }}
                />
              </div>
            </div>
          </div>

          {saveError && (
            <div className="alert alert--danger" style={{ marginBottom: 16 }}>{saveError}</div>
          )}

          <div className="modal__foot">
            <button type="button" className="btn btn--ghost" onClick={onClose}>
              {t('cancel')}
            </button>
            <button type="submit" className="btn btn--primary" disabled={createPatient.isPending}>
              {createPatient.isPending ? 'Сохранение...' : t('save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
