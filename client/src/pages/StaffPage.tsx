import { useState } from 'react';
import { Edit2, X } from 'lucide-react';
import { useStaff } from '../lib/queries';
import { useLang } from '../i18n';
import api from '../lib/api';
import { useQueryClient } from '@tanstack/react-query';
import AddStaffModal from '../components/modals/AddStaffModal';

const ROLE_LABELS: Record<string, string> = {
  admin: 'Администратор',
  doctor: 'Врач',
  manager: 'Менеджер',
  accountant: 'Бухгалтер',
  assistant: 'Ассистент',
  receptionist: 'Регистратор',
};

const ROLE_BADGE: Record<string, string> = {
  admin: 'badge--danger',
  doctor: 'badge--info',
  manager: 'badge--success',
  accountant: 'badge--warn',
  assistant: 'badge--neutral',
  receptionist: 'badge--neutral',
};

const COLORS = ['#e61b1b','#0787c9','#1f8a4d','#8e90c8','#e040c8','#e0a020','#4caf50','#7c3aed'];

function initials(name: string): string {
  return name.split(' ').slice(0,2).map(p => p[0]?.toUpperCase()??'').join('');
}

function EditStaffModal({ staff, onClose }: { staff: any; onClose: () => void }) {
  const { t } = useLang();
  const qc = useQueryClient();
  const [form, setForm] = useState({
    name: staff.name ?? '',
    email: staff.email ?? '',
    role: staff.role ?? 'doctor',
    specialty: staff.specialty ?? '',
    phone: staff.phone ?? '',
    color: staff.color ?? '#0787c9',
    password: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function set(k: string, v: string) { setForm(prev => ({...prev, [k]: v})); }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload: Record<string, string> = { ...form };
      if (!payload.password) delete payload.password;
      await api.put(`/staff/${staff.id}`, payload);
      qc.invalidateQueries({ queryKey: ['staff'] });
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Ошибка');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
        <div className="modal__head">
          <h1>Редактировать сотрудника</h1>
          <button className="modal__close" onClick={onClose} type="button"><X size={22} /></button>
        </div>
        <form onSubmit={handleSave} style={{ marginTop: 24 }}>
          <div className="modal__body">
            <div className="formgrid">
              <div className="field" style={{ gridColumn: '1/-1' }}>
                <label className="field__label">{t('name')} <span className="req-star">*</span></label>
                <div className="input"><input value={form.name} onChange={e => set('name', e.target.value)} required /></div>
              </div>
              <div className="field"><label className="field__label">{t('email')}</label><div className="input"><input type="email" value={form.email} onChange={e => set('email', e.target.value)} /></div></div>
              <div className="field"><label className="field__label">{t('role')}</label>
                <div className="input"><select value={form.role} onChange={e => set('role', e.target.value)} style={{ width: '100%' }}>
                  {Object.keys(ROLE_LABELS).map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
                </select></div>
              </div>
              <div className="field"><label className="field__label">{t('specialty')}</label><div className="input"><input value={form.specialty} onChange={e => set('specialty', e.target.value)} /></div></div>
              <div className="field"><label className="field__label">{t('phone')}</label><div className="input"><input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} /></div></div>
              <div className="field"><label className="field__label">{t('password')}</label><div className="input"><input type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="Оставьте пустым, чтобы не менять" autoComplete="new-password" /></div></div>
              <div className="field" style={{ gridColumn: '1/-1' }}><label className="field__label">Цвет</label>
                <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                  {COLORS.map(c => <button key={c} type="button" onClick={() => set('color', c)}
                    style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: form.color === c ? '3px solid var(--ink-900)' : '2px solid transparent', cursor: 'pointer' }} />)}
                </div>
              </div>
            </div>
            {error && <div className="alert alert--danger" style={{ marginTop: 12 }}>{error}</div>}
          </div>
          <div className="modal__foot">
            <button type="button" className="btn btn--ghost" onClick={onClose}>{t('cancel')}</button>
            <button type="submit" className="btn btn--primary" disabled={saving}>{saving ? 'Сохранение...' : t('save')}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function StaffPage() {
  const { t } = useLang();
  const [addOpen, setAddOpen] = useState(false);
  const [editStaff, setEditStaff] = useState<any>(null);
  const { data, isLoading } = useStaff();
  const list: any[] = data?.items ?? data ?? [];

  return (
    <div>
      <div className="screen__head">
        <div className="screen__titlewrap">
          <h1 style={{ font: '700 28px var(--font-sans)', color: 'var(--ink-900)' }}>{t('staff')}</h1>
          <span className="screen__count">{list.length} сотрудников</span>
        </div>
        <div className="screen__tools">
          <button className="btn btn--primary" onClick={() => setAddOpen(true)}>+ Добавить сотрудника</button>
        </div>
      </div>

      <div className="card tablecard" style={{ marginTop: 24 }}>
        {isLoading ? (
          <div className="placeholder"><p>Загрузка...</p></div>
        ) : (
          <table className="dtable">
            <thead>
              <tr>
                <th>Сотрудник</th>
                <th>{t('role')}</th>
                <th>{t('phone')}</th>
                <th>{t('email')}</th>
                <th>Последний вход</th>
                <th style={{ width: 50 }}></th>
              </tr>
            </thead>
            <tbody>
              {list.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--ink-400)', padding: 32 }}>Нет сотрудников</td></tr>
              )}
              {list.map((s: any) => {
                const color = s.color ?? '#0787c9';
                const roleCls = ROLE_BADGE[s.role] ?? 'badge--neutral';
                const roleLabel = ROLE_LABELS[s.role] ?? s.role ?? '—';
                return (
                  <tr key={s.id}>
                    <td>
                      <div className="staffname">
                        <div className="avatar" style={{ width: 36, height: 36, background: color, borderColor: color, color: '#fff', fontSize: 13 }}>
                          {initials(s.name)}
                        </div>
                        <div>
                          <div style={{ font: '700 14px var(--font-sans)', color: 'var(--ink-900)' }}>{s.name}</div>
                          {s.specialty && <div style={{ font: '400 12px var(--font-sans)', color: 'var(--ink-500)', marginTop: 2 }}>{s.specialty}</div>}
                        </div>
                      </div>
                    </td>
                    <td><span className={`badge ${roleCls}`}>{roleLabel}</span></td>
                    <td style={{ color: 'var(--ink-600)' }}>{s.phone ?? '—'}</td>
                    <td style={{ color: 'var(--ink-600)' }}>{s.email ?? '—'}</td>
                    <td style={{ color: 'var(--ink-500)', font: '400 13px var(--font-sans)' }}>
                      {s.lastLogin ? new Date(s.lastLogin).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                    </td>
                    <td>
                      <div className="rowacts">
                        <button className="iconbtn" title={t('edit')} onClick={() => setEditStaff(s)}>
                          <Edit2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <AddStaffModal open={addOpen} onClose={() => setAddOpen(false)} />
      {editStaff && <EditStaffModal staff={editStaff} onClose={() => setEditStaff(null)} />}
    </div>
  );
}
