import { useState, useMemo } from 'react';
import { X, Search } from 'lucide-react';
import { useCreateAppointment, useStaff, usePatients } from '../../lib/queries';
import { useLang } from '../../i18n';

interface Props {
  open: boolean;
  onClose: () => void;
}

type VisitTab = 'regular' | 'planned' | 'primary';

const TAB_LABELS: Record<VisitTab, string> = {
  regular: 'Обычный',
  planned: 'Плановый',
  primary: 'Первичный',
};

const today = new Date().toISOString().split('T')[0];

export default function NewVisitModal({ open, onClose }: Props) {
  const { t } = useLang();
  const [tab, setTab] = useState<VisitTab>('regular');

  const { data: staffData } = useStaff({ role: 'doctor' });
  const { data: patientsData } = usePatients({ limit: 200 });
  const createAppt = useCreateAppointment();

  const doctors: any[] = staffData?.items ?? staffData ?? [];
  const allPatients: any[] = patientsData?.items ?? patientsData ?? [];

  const [form, setForm] = useState({
    patientId: '',
    doctorId: '',
    chair: '',
    date: today,
    time: '09:00',
    duration: '30',
    visitType: '',
    visitKind: tab,
    source: '',
    comment: '',
  });
  const [saveError, setSaveError] = useState('');
  const [patientSearch, setPatientSearch] = useState('');
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);

  const filteredPatients = useMemo(() => {
    if (!patientSearch.trim()) return allPatients.slice(0, 20);
    const q = patientSearch.toLowerCase();
    return allPatients.filter((p: any) => {
      const name = p.name ?? `${p.lastName ?? ''} ${p.firstName ?? ''} ${p.middleName ?? ''}`.trim();
      const phone = p.phone ?? '';
      const cardNo = p.cardNo ?? '';
      return name.toLowerCase().includes(q) || phone.includes(q) || cardNo.includes(q);
    }).slice(0, 15);
  }, [allPatients, patientSearch]);

  const selectedPatient = allPatients.find((p: any) => String(p.id) === form.patientId);
  const selectedPatientName = selectedPatient
    ? (selectedPatient.name ?? `${selectedPatient.lastName ?? ''} ${selectedPatient.firstName ?? ''}`.trim())
    : '';

  function set(key: string, val: string) {
    setForm(prev => ({ ...prev, [key]: val }));
  }

  function handleTabChange(t: VisitTab) {
    setTab(t);
    setForm(prev => ({ ...prev, visitKind: t }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaveError('');

    if (!form.patientId) {
      setSaveError('Выберите пациента');
      return;
    }
    if (!form.doctorId) {
      setSaveError('Выберите врача');
      return;
    }

    createAppt.mutate(
      {
        patientId: Number(form.patientId),
        doctorId: Number(form.doctorId),
        chair: form.chair || undefined,
        date: form.date,
        time: form.time,
        duration: Number(form.duration),
        visitType: form.visitType || undefined,
        visitKind: form.visitKind,
        source: form.source || undefined,
        comment: form.comment || undefined,
      },
      {
        onSuccess: () => {
          setForm({
            patientId: '', doctorId: '', chair: '',
            date: today, time: '09:00', duration: '30',
            visitType: '', visitKind: 'regular', source: '', comment: '',
          });
          setPatientSearch('');
          setTab('regular');
          onClose();
        },
        onError: (err: any) => {
          const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message || 'Ошибка при создании визита';
          setSaveError(msg);
        },
      }
    );
  }

  if (!open) return null;

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 620 }}>
        <div className="modal__head">
          <h1>{t('newVisit')}</h1>
          <button className="modal__close" onClick={onClose} type="button">
            <X size={22} />
          </button>
        </div>

        <div className="tabs tabs--modal">
          {(Object.keys(TAB_LABELS) as VisitTab[]).map(k => (
            <button
              key={k}
              type="button"
              className={`tab ${tab === k ? 'is-active' : ''}`}
              onClick={() => handleTabChange(k)}
            >
              {TAB_LABELS[k]}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal__body">
            {/* Patient - searchable */}
            <div className="field" style={{ position: 'relative' }}>
              <label className="field__label">
                {t('patient')} <span className="req-star">*</span>
              </label>
              {form.patientId ? (
                <div className="input" style={{ justifyContent: 'space-between' }}>
                  <span style={{ font: '700 15px var(--font-sans)', color: 'var(--ink-900)' }}>
                    {selectedPatientName}
                    {selectedPatient?.phone && <span style={{ fontWeight: 400, color: 'var(--ink-500)', marginLeft: 10, fontSize: 13 }}>{selectedPatient.phone}</span>}
                  </span>
                  <button type="button" onClick={() => { set('patientId', ''); setPatientSearch(''); }} style={{ color: 'var(--ink-400)', cursor: 'pointer', background: 'none', border: 'none', fontSize: 16, lineHeight: 1 }}>×</button>
                </div>
              ) : (
                <div className="input" style={{ padding: 0 }}>
                  <Search size={16} style={{ color: 'var(--ink-400)', marginLeft: 12, flexShrink: 0 }} />
                  <input
                    value={patientSearch}
                    onChange={e => { setPatientSearch(e.target.value); setShowPatientDropdown(true); }}
                    onFocus={() => setShowPatientDropdown(true)}
                    onBlur={() => setTimeout(() => setShowPatientDropdown(false), 200)}
                    placeholder="Поиск пациента по имени, телефону или № карты..."
                    style={{ border: 'none', outline: 'none', background: 'none', flex: 1, font: '400 15px var(--font-sans)', color: 'var(--ink-800)', padding: '0 12px' }}
                  />
                </div>
              )}
              {showPatientDropdown && !form.patientId && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 0,
                  background: '#fff', border: '1px solid var(--line-300)', borderRadius: 10,
                  boxShadow: 'var(--shadow-pop)', zIndex: 10, maxHeight: 200, overflowY: 'auto',
                  marginTop: 4,
                }}>
                  {filteredPatients.length === 0 ? (
                    <div style={{ padding: '12px 14px', color: 'var(--ink-400)', fontSize: 14 }}>Ничего не найдено</div>
                  ) : (
                    filteredPatients.map((p: any) => {
                      const name = p.name ?? `${p.lastName ?? ''} ${p.firstName ?? ''}`.trim();
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => { set('patientId', String(p.id)); setPatientSearch(''); setShowPatientDropdown(false); }}
                          style={{
                            display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px',
                            background: 'none', border: 'none', cursor: 'pointer',
                            borderBottom: '1px solid var(--line-200)',
                          }}
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--brand-blue-tint)'}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'none'}
                        >
                          <div style={{ font: '700 14px var(--font-sans)', color: 'var(--ink-900)' }}>{name}</div>
                          <div style={{ font: '400 12px var(--font-sans)', color: 'var(--ink-500)', marginTop: 2 }}>
                            {p.phone ?? '—'} · карта №{p.cardNo ?? p.id}
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            <div className="formgrid">
              <div className="field">
                <label className="field__label">
                  {t('doctor')} <span className="req-star">*</span>
                </label>
                <div className="input">
                  <select
                    value={form.doctorId}
                    onChange={e => set('doctorId', e.target.value)}
                    style={{ width: '100%' }}
                    required
                  >
                    <option value="">Выберите врача...</option>
                    {doctors.map((d: any) => (
                      <option key={d.id} value={String(d.id)}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="field">
                <label className="field__label">{t('chair')}</label>
                <div className="input">
                  <select
                    value={form.chair}
                    onChange={e => set('chair', e.target.value)}
                    style={{ width: '100%' }}
                  >
                    <option value="">—</option>
                    {[1, 2, 3, 4, 5, 6].map(n => (
                      <option key={n} value={String(n)}>Кресло {n}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="field">
                <label className="field__label">
                  Дата <span className="req-star">*</span>
                </label>
                <div className="input">
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => set('date', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label className="field__label">Время</label>
                <div className="input">
                  <input
                    type="time"
                    value={form.time}
                    onChange={e => set('time', e.target.value)}
                  />
                </div>
              </div>

              <div className="field">
                <label className="field__label">Длительность (мин)</label>
                <div className="input">
                  <select
                    value={form.duration}
                    onChange={e => set('duration', e.target.value)}
                    style={{ width: '100%' }}
                  >
                    {[15, 20, 30, 45, 60, 90, 120].map(n => (
                      <option key={n} value={String(n)}>{n} мин</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="field">
                <label className="field__label">{t('visitType')}</label>
                <div className="input">
                  <select
                    value={form.visitType}
                    onChange={e => set('visitType', e.target.value)}
                    style={{ width: '100%' }}
                  >
                    <option value="">—</option>
                    <option>Консультация</option>
                    <option>Лечение</option>
                    <option>Профилактика</option>
                    <option>Ортодонтия</option>
                    <option>Имплантация</option>
                    <option>Протезирование</option>
                  </select>
                </div>
              </div>
            </div>

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

            <div className="field">
              <label className="field__label">{t('comment')}</label>
              <div
                className="input"
                style={{ height: 'auto', alignItems: 'flex-start', padding: '10px 14px' }}
              >
                <textarea
                  rows={3}
                  value={form.comment}
                  onChange={e => set('comment', e.target.value)}
                  placeholder="Комментарий к визиту..."
                  style={{
                    border: 'none', outline: 'none', background: 'none',
                    flex: 1, font: '400 15px var(--font-sans)',
                    color: 'var(--ink-800)', resize: 'vertical', width: '100%',
                  }}
                />
              </div>
            </div>

            {saveError && (
              <div className="alert alert--danger" style={{ marginTop: 16 }}>{saveError}</div>
            )}
          </div>

          <div className="modal__foot">
            <button type="button" className="btn btn--ghost" onClick={onClose}>
              {t('cancel')}
            </button>
            <button type="submit" className="btn btn--primary" disabled={createAppt.isPending}>
              {createAppt.isPending ? 'Сохранение...' : t('save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
