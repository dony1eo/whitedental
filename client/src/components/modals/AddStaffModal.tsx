import { useState } from 'react';
import { X } from 'lucide-react';
import { useCreateStaff } from '../../lib/queries';
import { useLang } from '../../i18n';

interface Props {
  open: boolean;
  onClose: () => void;
}

const ROLES = [
  { value: 'doctor', label: 'Врач' },
  { value: 'assistant', label: 'Ассистент' },
  { value: 'manager', label: 'Менеджер' },
  { value: 'accountant', label: 'Бухгалтер' },
  { value: 'receptionist', label: 'Регистратор' },
  { value: 'admin', label: 'Администратор' },
];

const COLORS = [
  '#e61b1b', '#0787c9', '#1f8a4d', '#8e90c8',
  '#e040c8', '#e0a020', '#4caf50', '#7c3aed',
];

export default function AddStaffModal({ open, onClose }: Props) {
  const { t } = useLang();
  const createStaff = useCreateStaff();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'doctor',
    specialty: '',
    phone: '',
    color: '#0787c9',
  });

  function set(key: string, val: string) {
    setForm(prev => ({ ...prev, [key]: val }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    createStaff.mutate(
      {
        name: form.name,
        email: form.email,
        password: form.password || undefined,
        role: form.role,
        specialty: form.specialty || undefined,
        phone: form.phone || undefined,
        color: form.color,
      },
      { onSuccess: onClose }
    );
  }

  if (!open) return null;

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 560 }}>
        <div className="modal__head">
          <h1>Добавить сотрудника</h1>
          <button className="modal__close" onClick={onClose} type="button">
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
          <div className="modal__body">
            <div className="formgrid">
              <div className="field">
                <label className="field__label">
                  {t('name')} <span className="req-star">*</span>
                </label>
                <div className="input">
                  <input
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                    placeholder="Иванов Иван"
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label className="field__label">
                  {t('email')} <span className="req-star">*</span>
                </label>
                <div className="input">
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => set('email', e.target.value)}
                    placeholder="doctor@whitedental.uz"
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label className="field__label">{t('password')}</label>
                <div className="input">
                  <input
                    type="password"
                    value={form.password}
                    onChange={e => set('password', e.target.value)}
                    placeholder="changeme123"
                  />
                </div>
              </div>

              <div className="field">
                <label className="field__label">{t('role')} <span className="req-star">*</span></label>
                <div className="input">
                  <select
                    value={form.role}
                    onChange={e => set('role', e.target.value)}
                    style={{ width: '100%' }}
                  >
                    {ROLES.map(r => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="field">
                <label className="field__label">{t('specialty')}</label>
                <div className="input">
                  <input
                    value={form.specialty}
                    onChange={e => set('specialty', e.target.value)}
                    placeholder="Терапевт"
                  />
                </div>
              </div>

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
            </div>

            <div className="field" style={{ marginTop: 12 }}>
              <label className="field__label">Цвет</label>
              <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                {COLORS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => set('color', c)}
                    style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: c, border: form.color === c ? '3px solid var(--ink-900)' : '2px solid transparent',
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="modal__foot">
            <button type="button" className="btn btn--ghost" onClick={onClose}>
              {t('cancel')}
            </button>
            <button type="submit" className="btn btn--primary" disabled={createStaff.isPending}>
              {createStaff.isPending ? 'Сохранение...' : t('save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
