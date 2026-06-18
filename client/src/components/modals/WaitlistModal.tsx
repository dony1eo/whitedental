import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { useWaitlist } from '../../lib/queries';
import { useLang } from '../../i18n';
import api from '../../lib/api';
import { useQueryClient } from '@tanstack/react-query';

interface Props {
  open: boolean;
  onClose: () => void;
}

const PRIORITY_BADGE: Record<string, string> = {
  high: 'badge--danger',
  medium: 'badge--warn',
  low: 'badge--neutral',
};

const PRIORITY_LABEL: Record<string, string> = {
  high: 'Высокий',
  medium: 'Средний',
  low: 'Низкий',
};

export default function WaitlistModal({ open, onClose }: Props) {
  const { t } = useLang();
  const qc = useQueryClient();
  const { data, isLoading } = useWaitlist();
  const entries: any[] = data?.items ?? data ?? [];

  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    patientName: '',
    phone: '',
    doctorPrefer: '',
    dateFrom: '',
    dateTo: '',
    priority: 'medium',
  });

  function set(key: string, val: string) {
    setForm(prev => ({ ...prev, [key]: val }));
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.patientName) return;
    setSaving(true);
    try {
      await api.post('/crm/waitlist', {
        patientName: form.patientName,
        phone: form.phone || undefined,
        desiredDoctor: form.doctorPrefer || undefined,
        dateWindow: form.dateFrom ? `${form.dateFrom}${form.dateTo ? ' — ' + form.dateTo : ''}` : undefined,
        priority: form.priority,
      });
      qc.invalidateQueries({ queryKey: ['waitlist'] });
      setForm({ patientName: '', phone: '', doctorPrefer: '', dateFrom: '', dateTo: '', priority: 'medium' });
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 640 }}>
        <div className="modal__head">
          <h1>{t('waitlist')}</h1>
          <button className="modal__close" onClick={onClose} type="button">
            <X size={22} />
          </button>
        </div>

        {/* Current waitlist */}
        <div style={{ marginTop: 24 }}>
          <h3 style={{ font: '700 15px var(--font-sans)', color: 'var(--ink-800)', marginBottom: 12 }}>
            Текущая очередь
          </h3>
          {isLoading ? (
            <p style={{ color: 'var(--ink-400)', fontSize: 14 }}>Загрузка...</p>
          ) : entries.length === 0 ? (
            <p style={{ color: 'var(--ink-400)', fontSize: 14 }}>Очередь пуста</p>
          ) : (
            <div className="card tablecard">
              <table className="dtable">
                <thead>
                  <tr>
                    <th>Пациент</th>
                    <th>{t('phone')}</th>
                    <th>Врач</th>
                    <th>Окно дат</th>
                    <th>Приоритет</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((e: any) => (
                    <tr key={e.id}>
                      <td style={{ fontWeight: 700 }}>{e.patientName ?? e.patient?.name ?? '—'}</td>
                      <td style={{ color: 'var(--ink-600)' }}>{e.phone ?? '—'}</td>
                      <td style={{ color: 'var(--ink-600)' }}>{e.desiredDoctor ?? e.doctorPrefer ?? e.doctor?.name ?? '—'}</td>
                      <td style={{ color: 'var(--ink-600)', font: '400 13px var(--font-sans)' }}>
                        {e.dateWindow
                          ? e.dateWindow
                          : e.dateFrom
                            ? `${new Date(e.dateFrom).toLocaleDateString('ru-RU')}${e.dateTo ? ' — ' + new Date(e.dateTo).toLocaleDateString('ru-RU') : ''}`
                            : '—'}
                      </td>
                      <td>
                        <span className={`badge ${PRIORITY_BADGE[e.priority] ?? 'badge--neutral'}`}>
                          {PRIORITY_LABEL[e.priority] ?? e.priority ?? '—'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add entry form */}
        <div style={{ marginTop: 28, borderTop: '1px solid var(--line-300)', paddingTop: 22 }}>
          <h3 style={{ font: '700 15px var(--font-sans)', color: 'var(--ink-800)', marginBottom: 16 }}>
            Добавить в очередь
          </h3>
          <form onSubmit={handleAdd}>
            <div className="modal__body">
              <div className="formgrid">
                <div className="field">
                  <label className="field__label">
                    Имя пациента <span className="req-star">*</span>
                  </label>
                  <div className="input">
                    <input
                      value={form.patientName}
                      onChange={e => set('patientName', e.target.value)}
                      placeholder="Иванов Иван"
                      required
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
                <div className="field">
                  <label className="field__label">Желаемый врач</label>
                  <div className="input">
                    <input
                      value={form.doctorPrefer}
                      onChange={e => set('doctorPrefer', e.target.value)}
                      placeholder="Любой"
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="field__label">Приоритет</label>
                  <div className="input">
                    <select value={form.priority} onChange={e => set('priority', e.target.value)} style={{ width: '100%' }}>
                      <option value="low">Низкий</option>
                      <option value="medium">Средний</option>
                      <option value="high">Высокий</option>
                    </select>
                  </div>
                </div>
                <div className="field">
                  <label className="field__label">Дата с</label>
                  <div className="input">
                    <input type="date" value={form.dateFrom} onChange={e => set('dateFrom', e.target.value)} />
                  </div>
                </div>
                <div className="field">
                  <label className="field__label">Дата по</label>
                  <div className="input">
                    <input type="date" value={form.dateTo} onChange={e => set('dateTo', e.target.value)} />
                  </div>
                </div>
              </div>
            </div>

            <div className="modal__foot">
              <button type="button" className="btn btn--ghost" onClick={onClose}>
                {t('close')}
              </button>
              <button type="submit" className="btn btn--primary" disabled={saving || !form.patientName}>
                <Plus size={15} /> {saving ? 'Добавление...' : 'Добавить'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
