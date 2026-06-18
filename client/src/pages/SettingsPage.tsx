import { useState, useEffect } from 'react';
import {
  MessageCircle, Mail, Calendar, CreditCard,
  Phone, Globe, Database, Bell,
  Edit2, Save, Check,
} from 'lucide-react';
import { useIntegrations, useBranches, useRbac, useSaveRbac } from '../lib/queries';
import { useLang } from '../i18n';

type Tab = 'rbac' | 'integrations' | 'branches';

/* ─── RBAC data ───────────────────────────────────────── */
const ROLES = [
  { key: 'admin', label: 'Администратор', count: 2 },
  { key: 'doctor', label: 'Врач', count: 6 },
  { key: 'manager', label: 'Менеджер', count: 3 },
  { key: 'accountant', label: 'Бухгалтер', count: 1 },
  { key: 'assistant', label: 'Ассистент', count: 4 },
  { key: 'receptionist', label: 'Регистратор', count: 2 },
];

const MODULES = [
  'Расписание', 'Пациенты', 'Лечение',
  'Финансы', 'CRM', 'Склад', 'Маркетинг', 'Настройки',
];

const PERMS = ['Просмотр', 'Создание', 'Редактирование', 'Удаление'];

// Default matrix: [module][perm] => { admin, doctor, ... }
const DEFAULT_MATRIX: Record<string, Record<string, Record<string, boolean>>> = {};
MODULES.forEach(mod => {
  DEFAULT_MATRIX[mod] = {};
  PERMS.forEach(perm => {
    DEFAULT_MATRIX[mod][perm] = {
      admin: true,
      doctor: ['Расписание', 'Пациенты', 'Лечение'].includes(mod) && ['Просмотр', 'Создание', 'Редактирование'].includes(perm),
      manager: ['Расписание', 'Пациенты', 'CRM', 'Маркетинг'].includes(mod) && perm !== 'Удаление',
      accountant: mod === 'Финансы',
      assistant: ['Расписание', 'Пациенты'].includes(mod) && perm === 'Просмотр',
      receptionist: ['Расписание', 'Пациенты'].includes(mod) && ['Просмотр', 'Создание'].includes(perm),
    };
  });
});

/* ─── Integration icons ──────────────────────────────── */
const INT_ICONS: Record<string, any> = {
  whatsapp: MessageCircle,
  telegram: MessageCircle,
  email: Mail,
  calendar: Calendar,
  payment: CreditCard,
  sms: Phone,
  website: Globe,
  backup: Database,
  notifications: Bell,
};

const INT_DEFAULTS = [
  { key: 'whatsapp', name: 'WhatsApp Business' },
  { key: 'telegram', name: 'Telegram Bot' },
  { key: 'email', name: 'Email / SMTP' },
  { key: 'calendar', name: 'Google Calendar' },
  { key: 'payment', name: 'Payme / Click' },
  { key: 'sms', name: 'SMS Gateway' },
  { key: 'website', name: 'Сайт / Виджет' },
  { key: 'backup', name: 'Бэкап данных' },
];

/* ─── Toggle component ───────────────────────────────── */
function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      className={`toggle ${on ? 'toggle--on' : ''}`}
      onClick={() => onChange(!on)}
      title={on ? 'Выключить' : 'Включить'}
    >
      <span />
    </button>
  );
}

/* ─── Main component ─────────────────────────────────── */
export default function SettingsPage() {
  const { t } = useLang();
  const [tab, setTab] = useState<Tab>('rbac');
  const [activeRole, setActiveRole] = useState('admin');
  const [matrix, setMatrix] = useState(DEFAULT_MATRIX);
  const [saved, setSaved] = useState(false);

  const { data: intData, isLoading: loadingInt } = useIntegrations();
  const { data: brData, isLoading: loadingBr } = useBranches();
  const { data: rbacData } = useRbac();
  const saveRbac = useSaveRbac();

  // Hydrate matrix from API once loaded
  useEffect(() => { if (rbacData) setMatrix(rbacData as typeof DEFAULT_MATRIX); }, [rbacData]);

  function handleSaveRbac() {
    saveRbac.mutate(matrix, {
      onSuccess: () => { setSaved(true); setTimeout(() => setSaved(false), 2000); },
    });
  }

  const integrations: any[] = intData?.items ?? intData ?? [];
  const branches: any[] = brData?.items ?? brData ?? [];

  // Merge API integrations with defaults (show all 8 slots)
  const intCards = INT_DEFAULTS.map(d => {
    const fromApi = integrations.find((i: any) => i.key === d.key || i.type === d.key);
    return { ...d, connected: fromApi?.connected ?? fromApi?.active ?? false };
  });

  function togglePerm(mod: string, perm: string, role: string) {
    setMatrix(prev => ({
      ...prev,
      [mod]: {
        ...prev[mod],
        [perm]: {
          ...prev[mod][perm],
          [role]: !prev[mod][perm][role],
        },
      },
    }));
  }

  return (
    <div>
      <div className="screen__head">
        <div className="screen__titlewrap">
          <h1 style={{ font: '700 28px var(--font-sans)', color: 'var(--ink-900)' }}>{t('settings')}</h1>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab ${tab === 'rbac' ? 'is-active' : ''}`} onClick={() => setTab('rbac')}>
          {t('roles')} и права
        </button>
        <button className={`tab ${tab === 'integrations' ? 'is-active' : ''}`} onClick={() => setTab('integrations')}>
          {t('integrations')}
        </button>
        <button className={`tab ${tab === 'branches' ? 'is-active' : ''}`} onClick={() => setTab('branches')}>
          {t('branches')}
        </button>
      </div>

      <div style={{ marginTop: 20 }}>
        {/* RBAC */}
        {tab === 'rbac' && (
          <div className="rbac">
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
              <button
                className="btn btn--primary btn--sm"
                onClick={handleSaveRbac}
                disabled={saveRbac.isPending}
              >
                {saved ? <Check size={15} /> : <Save size={15} />}
                {saved ? 'Сохранено' : 'Сохранить изменения'}
              </button>
            </div>
            {/* Role list */}
            <div className="rbac__roles">
              {ROLES.map(r => (
                <button
                  key={r.key}
                  className={`rolebtn ${activeRole === r.key ? 'is-active' : ''}`}
                  onClick={() => setActiveRole(r.key)}
                >
                  <span className="rolebtn__name">{r.label}</span>
                  <span className="rolebtn__n">{r.count}</span>
                </button>
              ))}
            </div>

            {/* Permission matrix */}
            <div className="card tablecard" style={{ flex: 1, overflow: 'auto' }}>
              <table className="dtable permtable">
                <thead>
                  <tr>
                    <th style={{ minWidth: 140 }}>Модуль</th>
                    {PERMS.map(p => (
                      <th key={p} style={{ textAlign: 'center', width: 130 }}>{p}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MODULES.map(mod => (
                    <tr key={mod}>
                      <td style={{ font: '700 14px var(--font-sans)', color: 'var(--ink-800)' }}>{mod}</td>
                      {PERMS.map(perm => (
                        <td key={perm} style={{ textAlign: 'center' }}>
                          <Toggle
                            on={matrix[mod]?.[perm]?.[activeRole] ?? false}
                            onChange={() => togglePerm(mod, perm, activeRole)}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* INTEGRATIONS */}
        {tab === 'integrations' && (
          loadingInt ? (
            <div className="placeholder"><p>Загрузка...</p></div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {intCards.map(ic => {
                const Icon = INT_ICONS[ic.key] ?? Globe;
                return (
                  <div key={ic.key} className="card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 10,
                      background: 'var(--line-blue)', color: 'var(--blue-500)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <Icon size={22} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ font: '700 14px var(--font-sans)', color: 'var(--ink-900)' }}>{ic.name}</div>
                      <div style={{ marginTop: 5 }}>
                        {ic.connected ? (
                          <span className="badge badge--success">Подключено</span>
                        ) : (
                          <span className="badge badge--neutral">Не подключено</span>
                        )}
                      </div>
                    </div>
                    <button className="btn btn--outline btn--sm">
                      {ic.connected ? 'Настроить' : 'Подключить'}
                    </button>
                  </div>
                );
              })}
            </div>
          )
        )}

        {/* BRANCHES */}
        {tab === 'branches' && (
          loadingBr ? (
            <div className="placeholder"><p>Загрузка...</p></div>
          ) : (
            <div className="card tablecard">
              <table className="dtable">
                <thead>
                  <tr>
                    <th>{t('name')}</th>
                    <th>Адрес</th>
                    <th style={{ textAlign: 'center' }}>Основной</th>
                    <th style={{ textAlign: 'center', width: 50 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {branches.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', color: 'var(--ink-400)', padding: 32 }}>
                        Нет филиалов
                      </td>
                    </tr>
                  )}
                  {branches.map((b: any) => (
                    <tr key={b.id}>
                      <td style={{ font: '700 14px var(--font-sans)', color: 'var(--ink-900)' }}>{b.name}</td>
                      <td style={{ color: 'var(--ink-600)' }}>{b.address ?? '—'}</td>
                      <td style={{ textAlign: 'center' }}>
                        {b.isMain || b.main ? (
                          <span className="badge badge--success">Да</span>
                        ) : (
                          <span className="badge badge--neutral">—</span>
                        )}
                      </td>
                      <td>
                        <div className="rowacts" style={{ justifyContent: 'center' }}>
                          <button className="iconbtn" title={t('edit')}>
                            <Edit2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </div>
  );
}
