import { useState } from 'react';
import { Edit2 } from 'lucide-react';
import { useStaff } from '../lib/queries';
import { useLang } from '../i18n';
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

function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map(p => p[0]?.toUpperCase() ?? '')
    .join('');
}

export default function StaffPage() {
  const { t } = useLang();
  const [addOpen, setAddOpen] = useState(false);
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
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: 'var(--ink-400)', padding: 32 }}>
                    Нет сотрудников
                  </td>
                </tr>
              )}
              {list.map((s: any) => {
                const fullName = s.name ?? `${s.firstName ?? ''} ${s.lastName ?? ''}`.trim();
                const color = s.color ?? '#0787c9';
                const roleCls = ROLE_BADGE[s.role] ?? 'badge--neutral';
                const roleLabel = ROLE_LABELS[s.role] ?? s.role ?? '—';
                return (
                  <tr key={s.id}>
                    <td>
                      <div className="staffname">
                        <div
                          className="avatar"
                          style={{
                            width: 36, height: 36,
                            background: color,
                            borderColor: color,
                            color: '#fff',
                            fontSize: 13,
                          }}
                        >
                          {initials(fullName)}
                        </div>
                        <div>
                          <div style={{ font: '700 14px var(--font-sans)', color: 'var(--ink-900)' }}>
                            {fullName}
                          </div>
                          {s.specialty && (
                            <div style={{ font: '400 12px var(--font-sans)', color: 'var(--ink-500)', marginTop: 2 }}>
                              {s.specialty}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td><span className={`badge ${roleCls}`}>{roleLabel}</span></td>
                    <td style={{ color: 'var(--ink-600)' }}>{s.phone ?? '—'}</td>
                    <td style={{ color: 'var(--ink-600)' }}>{s.email ?? '—'}</td>
                    <td style={{ color: 'var(--ink-500)', font: '400 13px var(--font-sans)' }}>
                      {s.lastLogin
                        ? new Date(s.lastLogin).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' })
                        : '—'}
                    </td>
                    <td>
                      <div className="rowacts">
                        <button className="iconbtn" title={t('edit')}>
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
    </div>
  );
}
