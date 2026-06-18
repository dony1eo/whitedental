import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, X, Search } from 'lucide-react';
import { useAppointments, useUpdateAppointment, useStaff, usePatients } from '../lib/queries';
import { useLang } from '../i18n';
import api from '../lib/api';
import { useQueryClient } from '@tanstack/react-query';

const STATUSES = [
  { key: 'all', label: 'Все' },
  { key: 'confirmed', label: 'Подтверждён' },
  { key: 'not_confirmed', label: 'Не подтверждён' },
  { key: 'arrived', label: 'Пришёл' },
  { key: 'in_chair', label: 'В кресле' },
  { key: 'done', label: 'Завершён' },
  { key: 'cancelled', label: 'Отменён' },
];

const STATUS_BADGE: Record<string, string> = {
  confirmed: 'badge--success',
  not_confirmed: 'badge--warn',
  arrived: 'badge--info',
  in_chair: 'badge--info',
  done: 'badge--success',
  cancelled: 'badge--danger',
  no_show: 'badge--neutral',
};

const STATUS_LABEL: Record<string, string> = {
  confirmed: 'Подтверждён',
  not_confirmed: 'Не подтверждён',
  arrived: 'Пришёл',
  in_chair: 'В кресле',
  done: 'Завершён',
  cancelled: 'Отменён',
  no_show: 'Неявка',
};

function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map(p => p[0]?.toUpperCase() ?? '')
    .join('');
}

const todayStr = new Date().toISOString().split('T')[0];
const monthLater = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

interface EditModalProps {
  appt: any;
  doctors: any[];
  patients: any[];
  onClose: () => void;
}

function EditAppointmentModal({ appt, doctors, patients, onClose }: EditModalProps) {
  const { t } = useLang();
  const updateAppt = useUpdateAppointment();
  const startDate = new Date(appt.startTime);
  const dateStr = startDate.toISOString().split('T')[0];
  const timeStr = startDate.toTimeString().slice(0, 5);

  const [form, setForm] = useState({
    patientId: String(appt.patientId ?? appt.patient?.id ?? ''),
    doctorId: String(appt.doctorId ?? appt.doctor?.id ?? ''),
    chair: appt.chair ?? '',
    date: dateStr,
    time: timeStr,
    visitType: appt.visitType ?? '',
    status: appt.status ?? 'not_confirmed',
    comment: appt.comment ?? '',
  });
  const [saveError, setSaveError] = useState('');

  function set(k: string, v: string) { setForm(prev => ({ ...prev, [k]: v })); }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaveError('');
    updateAppt.mutate(
      {
        id: appt.id,
        patientId: Number(form.patientId),
        doctorId: Number(form.doctorId),
        chair: form.chair || undefined,
        visitType: form.visitType || undefined,
        status: form.status,
        comment: form.comment || undefined,
        startTime: new Date(`${form.date}T${form.time}:00`).toISOString(),
        endTime: new Date(new Date(`${form.date}T${form.time}:00`).getTime() + 30 * 60000).toISOString(),
      },
      {
        onSuccess: onClose,
        onError: (err: any) => { setSaveError(err?.response?.data?.message || err?.message || 'Ошибка'); }
      }
    );
  }

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
        <div className="modal__head">
          <h1>Редактировать визит</h1>
          <button className="modal__close" onClick={onClose} type="button"><X size={22} /></button>
        </div>
        <form onSubmit={handleSave} style={{ marginTop: 24 }}>
          <div className="modal__body">
            <div className="formgrid">
              <div className="field">
                <label className="field__label">{t('patient')}</label>
                <div className="input">
                  <select value={form.patientId} onChange={e => set('patientId', e.target.value)} style={{ width: '100%' }}>
                    {patients.map((p: any) => (
                      <option key={p.id} value={String(p.id)}>{p.name ?? `${p.lastName ?? ''} ${p.firstName ?? ''}`.trim()}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="field">
                <label className="field__label">{t('doctor')}</label>
                <div className="input">
                  <select value={form.doctorId} onChange={e => set('doctorId', e.target.value)} style={{ width: '100%' }}>
                    {doctors.map((d: any) => (
                      <option key={d.id} value={String(d.id)}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="field">
                <label className="field__label">Дата</label>
                <div className="input"><input type="date" value={form.date} onChange={e => set('date', e.target.value)} /></div>
              </div>
              <div className="field">
                <label className="field__label">Время</label>
                <div className="input"><input type="time" value={form.time} onChange={e => set('time', e.target.value)} /></div>
              </div>
              <div className="field">
                <label className="field__label">{t('status')}</label>
                <div className="input">
                  <select value={form.status} onChange={e => set('status', e.target.value)} style={{ width: '100%' }}>
                    {STATUSES.filter(s => s.key !== 'all').map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="field">
                <label className="field__label">Тип</label>
                <div className="input"><input value={form.visitType} onChange={e => set('visitType', e.target.value)} placeholder="Консультация" /></div>
              </div>
            </div>
            <div className="field" style={{ marginTop: 8 }}>
              <label className="field__label">{t('comment')}</label>
              <div className="input" style={{ height: 'auto', padding: '8px 12px' }}>
                <textarea rows={2} value={form.comment} onChange={e => set('comment', e.target.value)}
                  style={{ border: 'none', outline: 'none', background: 'none', flex: 1, font: '400 14px var(--font-sans)', color: 'var(--ink-800)', resize: 'vertical', width: '100%' }} />
              </div>
            </div>
            {saveError && <div className="alert alert--danger" style={{ marginTop: 12 }}>{saveError}</div>}
          </div>
          <div className="modal__foot">
            <button type="button" className="btn btn--ghost" onClick={onClose}>{t('cancel')}</button>
            <button type="submit" className="btn btn--primary" disabled={updateAppt.isPending}>
              {updateAppt.isPending ? 'Сохранение...' : t('save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function VisitsPage() {
  const { t } = useLang();
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('all');
  const [from, setFrom] = useState(todayStr);
  const [to, setTo] = useState(monthLater);
  const [searchQuery, setSearchQuery] = useState('');
  const [editAppt, setEditAppt] = useState<any>(null);

  const { data, isLoading } = useAppointments({
    status: statusFilter === 'all' ? undefined : statusFilter,
    from,
    to,
  });
  const { data: staffData } = useStaff({ role: 'doctor' });
  const { data: patientsData } = usePatients({ limit: 200 });

  const appointments: any[] = data?.items ?? data ?? [];
  const doctors: any[] = staffData?.items ?? staffData ?? [];
  const allPatients: any[] = patientsData?.items ?? patientsData ?? [];

  const filtered = searchQuery.trim()
    ? appointments.filter((a: any) => {
        const patName = `${a.patient?.firstName ?? ''} ${a.patient?.lastName ?? ''}`.toLowerCase();
        const docName = (a.doctor?.name ?? '').toLowerCase();
        const q = searchQuery.toLowerCase();
        return patName.includes(q) || docName.includes(q) || a.phone?.includes(q);
      })
    : appointments;

  async function handleDelete(id: number) {
    if (!confirm('Удалить визит?')) return;
    try {
      await api.delete(`/appointments/${id}`);
      qc.invalidateQueries({ queryKey: ['appointments'] });
    } catch (err: any) {
      alert('Ошибка: ' + (err?.response?.data?.message || err?.message));
    }
  }

  return (
    <div>
      <div className="screen__head">
        <div className="screen__titlewrap">
          <h1 style={{ font: '700 28px var(--font-sans)', color: 'var(--ink-900)' }}>{t('visits')}</h1>
          <span className="screen__count">{filtered.length} визитов</span>
        </div>
        <div className="screen__tools">
          <div className="tbl-search" style={{ width: 220 }}>
            <Search size={15} style={{ color: 'var(--ink-500)' }} />
            <input
              placeholder="Поиск..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="input" style={{ width: 155, height: 40 }}>
              <input type="date" value={from} onChange={e => setFrom(e.target.value)} />
            </div>
            <span style={{ color: 'var(--ink-400)', flexShrink: 0 }}>—</span>
            <div className="input" style={{ width: 155, height: 40 }}>
              <input type="date" value={to} onChange={e => setTo(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      <div className="chips">
        {STATUSES.map(s => (
          <button
            key={s.key}
            className={`chip ${statusFilter === s.key ? 'chip--on' : ''}`}
            onClick={() => setStatusFilter(s.key)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="card tablecard" style={{ marginTop: 18 }}>
        {isLoading ? (
          <div className="placeholder"><p>Загрузка...</p></div>
        ) : (
          <table className="dtable">
            <thead>
              <tr>
                <th>Дата и время</th>
                <th>{t('patient')}</th>
                <th>{t('doctor')}</th>
                <th>Тип</th>
                <th>{t('chair')}</th>
                <th>{t('status')}</th>
                <th style={{ width: 70 }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: 'var(--ink-400)', padding: 32 }}>
                    Нет визитов за период
                  </td>
                </tr>
              )}
              {filtered.map((a: any) => {
                const startTime = new Date(a.startTime);
                const endTime = new Date(a.endTime);
                const dateStr = startTime.toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' });
                const timeStr = `${startTime.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })} – ${endTime.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
                const docColor = a.doctor?.color ?? '#0787c9';
                const doctorName = a.doctor?.name ?? '—';
                const patientName = a.patient
                  ? `${a.patient.lastName ?? ''} ${a.patient.firstName ?? ''}`.trim()
                  : '—';
                const patientId = a.patient?.id;
                const stCls = STATUS_BADGE[a.status] ?? 'badge--neutral';
                const stLabel = STATUS_LABEL[a.status] ?? a.status ?? '—';

                return (
                  <tr key={a.id}>
                    <td>
                      <div style={{ font: '700 14px var(--font-sans)', color: 'var(--ink-900)' }}>{dateStr}</div>
                      <div style={{ font: '400 13px var(--font-sans)', color: 'var(--ink-500)' }}>{timeStr}</div>
                    </td>
                    <td>
                      {patientId ? (
                        <Link
                          to={`/patients/${patientId}`}
                          style={{ color: 'var(--blue-link)', fontWeight: 700, textDecoration: 'none' }}
                        >
                          {patientName}
                        </Link>
                      ) : (
                        <span style={{ fontWeight: 700 }}>{patientName}</span>
                      )}
                    </td>
                    <td>
                      <div className="staffname">
                        <div className="avatar" style={{ width: 28, height: 28, background: docColor, borderColor: docColor, color: '#fff', fontSize: 10 }}>
                          {initials(doctorName)}
                        </div>
                        <span style={{ font: '400 14px var(--font-sans)', color: 'var(--ink-800)' }}>{doctorName}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--ink-600)' }}>{a.visitType ?? '—'}</td>
                    <td style={{ color: 'var(--ink-600)' }}>{a.chair ?? '—'}</td>
                    <td><span className={`badge ${stCls}`}>{stLabel}</span></td>
                    <td>
                      <div className="rowacts">
                        <button className="iconbtn" title={t('edit')} onClick={() => setEditAppt(a)}>
                          <Edit2 size={15} />
                        </button>
                        <button className="iconbtn" title={t('delete')} onClick={() => handleDelete(a.id)}>
                          <Trash2 size={15} />
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

      {editAppt && (
        <EditAppointmentModal
          appt={editAppt}
          doctors={doctors}
          patients={allPatients}
          onClose={() => setEditAppt(null)}
        />
      )}
    </div>
  );
}
