import { useState } from 'react';
import { Plus, Minus, Trash2, CheckCircle } from 'lucide-react';
import { useServices, useStaff, usePatients } from '../lib/queries';
import { uzs } from '../lib/api';
import { useLang } from '../i18n';
import api from '../lib/api';
import { useQueryClient } from '@tanstack/react-query';

interface TreatmentLine {
  id: number;
  serviceId: number;
  serviceName: string;
  toothNo: string;
  qty: number;
  price: number;
  doctorPercent: number;
  doctorId: number;
  doctorName: string;
}

let lineIdCounter = 1;

export default function TreatmentPage() {
  const { t } = useLang();
  const qc = useQueryClient();
  const { data: servicesData } = useServices();
  const { data: staffData } = useStaff({ role: 'doctor' });
  const { data: patientsData } = usePatients();

  const services: any[] = servicesData?.items ?? servicesData ?? [];
  const doctors: any[] = staffData?.items ?? staffData ?? [];
  const patients: any[] = patientsData?.items ?? patientsData ?? [];

  const [selPatient, setSelPatient] = useState('');
  const [selDoctor, setSelDoctor] = useState('');
  const [toothInput, setToothInput] = useState('');
  const [selService, setSelService] = useState('');
  const [lines, setLines] = useState<TreatmentLine[]>([]);
  const [discount, setDiscount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleAdd() {
    if (!selService) return;
    const svc = services.find(s => String(s.id) === selService);
    if (!svc) return;
    const doc = doctors.find(d => String(d.id) === selDoctor);
    setLines(prev => [
      ...prev,
      {
        id: lineIdCounter++,
        serviceId: svc.id,
        serviceName: svc.name,
        toothNo: toothInput,
        qty: 1,
        price: svc.price ?? 0,
        doctorPercent: svc.doctorPct ?? svc.doctorPercent ?? 0,
        doctorId: doc?.id ?? 0,
        doctorName: doc?.name ?? '—',
      },
    ]);
    setToothInput('');
  }

  function setQty(id: number, delta: number) {
    setLines(prev =>
      prev.map(l => l.id === id ? { ...l, qty: Math.max(1, l.qty + delta) } : l)
    );
  }

  function removeLine(id: number) {
    setLines(prev => prev.filter(l => l.id !== id));
  }

  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const total = Math.max(0, subtotal - discount);
  const doctorShare = lines.reduce((s, l) => s + l.price * l.qty * (l.doctorPercent / 100), 0);

  async function handleSave() {
    if (lines.length === 0) return;
    setSaving(true);
    try {
      const apptRes = await api.post('/appointments', {
        patientId: selPatient ? Number(selPatient) : undefined,
        doctorId: selDoctor ? Number(selDoctor) : undefined,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 5),
        duration: 30,
        visitType: 'Лечение',
        status: 'done',
      });
      const apptId = apptRes.data.id;

      for (const l of lines) {
        await api.post(`/appointments/${apptId}/treatment-lines`, {
          serviceId: l.serviceId,
          doctorId: l.doctorId || undefined,
          toothNo: l.toothNo || undefined,
          qty: l.qty,
          price: l.price,
          doctorPct: l.doctorPercent,
        });
      }

      if (total > 0 && selPatient) {
        await api.post('/finance/cashbox', {
          operation: `Лечение: пациент #${selPatient}`,
          method: 'cash',
          amount: total,
          isIncome: true,
          patientId: Number(selPatient),
        });
      }

      qc.invalidateQueries({ queryKey: ['appointments'] });
      qc.invalidateQueries({ queryKey: ['cashbox'] });
      qc.invalidateQueries({ queryKey: ['pnl'] });

      setLines([]);
      setDiscount(0);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      alert('Ошибка сохранения: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="screen__head">
        <div className="screen__titlewrap">
          <h1 style={{ font: '700 28px var(--font-sans)', color: 'var(--ink-900)' }}>{t('treatment')}</h1>
        </div>
      </div>

      <div className="tr-grid">
        <div className="card tablecard" style={{ overflow: 'visible' }}>
          <div className="tr-addbar">
            <div className="input" style={{ flex: '0 0 180px', height: 38 }}>
              <select value={selPatient} onChange={e => setSelPatient(e.target.value)} style={{ width: '100%' }}>
                <option value="">Пациент...</option>
                {patients.map(p => (
                  <option key={p.id} value={String(p.id)}>
                    {p.name ?? `${p.lastName ?? ''} ${p.firstName ?? ''}`.trim()}
                  </option>
                ))}
              </select>
            </div>

            <div className="input" style={{ flex: '0 0 150px', height: 38 }}>
              <select value={selDoctor} onChange={e => setSelDoctor(e.target.value)} style={{ width: '100%' }}>
                <option value="">Врач...</option>
                {doctors.map(d => (
                  <option key={d.id} value={String(d.id)}>
                    {d.name ?? `${d.firstName ?? ''} ${d.lastName ?? ''}`.trim()}
                  </option>
                ))}
              </select>
            </div>

            <div className="input" style={{ flex: '0 0 90px', height: 38 }}>
              <input
                placeholder="Зуб"
                value={toothInput}
                onChange={e => setToothInput(e.target.value)}
                style={{ textAlign: 'center' }}
              />
            </div>

            <div className="input" style={{ flex: 1, height: 38 }}>
              <select value={selService} onChange={e => setSelService(e.target.value)} style={{ width: '100%' }}>
                <option value="">Услуга...</option>
                {services.filter(s => s.active !== false).map(s => (
                  <option key={s.id} value={String(s.id)}>
                    {s.name} — {uzs(s.price)}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="btn btn--primary btn--sm"
              onClick={handleAdd}
              disabled={!selService}
              style={{ flexShrink: 0 }}
            >
              <Plus size={15} /> Добавить
            </button>
          </div>

          <table className="dtable">
            <thead>
              <tr>
                <th>Услуга</th>
                <th>Зуб</th>
                <th style={{ textAlign: 'center' }}>Кол</th>
                <th>Цена</th>
                <th>Врач %</th>
                <th>Итого</th>
                <th style={{ width: 40 }}></th>
              </tr>
            </thead>
            <tbody>
              {lines.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: 'var(--ink-400)', padding: 32 }}>
                    Нет позиций — добавьте услугу выше
                  </td>
                </tr>
              )}
              {lines.map(l => (
                <tr key={l.id}>
                  <td style={{ font: '700 14px var(--font-sans)', color: 'var(--ink-900)' }}>
                    {l.serviceName}
                    <div style={{ font: '400 12px var(--font-sans)', color: 'var(--ink-500)' }}>{l.doctorName}</div>
                  </td>
                  <td>
                    {l.toothNo ? (
                      <span className="toothtag">{l.toothNo}</span>
                    ) : (
                      <span className="mut">—</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
                      <button
                        className="iconbtn"
                        onClick={() => setQty(l.id, -1)}
                        style={{ width: 26, height: 26 }}
                      >
                        <Minus size={13} />
                      </button>
                      <span style={{ minWidth: 20, textAlign: 'center', fontWeight: 700 }}>{l.qty}</span>
                      <button
                        className="iconbtn"
                        onClick={() => setQty(l.id, 1)}
                        style={{ width: 26, height: 26 }}
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </td>
                  <td>{uzs(l.price)}</td>
                  <td style={{ color: 'var(--ink-600)' }}>{l.doctorPercent}%</td>
                  <td style={{ fontWeight: 700 }}>{uzs(l.price * l.qty)}</td>
                  <td>
                    <button className="iconbtn" onClick={() => removeLine(l.id)} title={t('delete')}>
                      <Trash2 size={15} color="var(--danger-500)" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card" style={{ padding: '20px 22px', position: 'sticky', top: 0 }}>
          <h3 style={{ font: '700 16px var(--font-sans)', color: 'var(--ink-900)', marginBottom: 18 }}>
            Итоги приёма
          </h3>

          <div className="pnl-row">
            <span>Подытог</span>
            <span style={{ fontWeight: 700 }}>{uzs(subtotal)}</span>
          </div>

          <div className="pnl-row" style={{ alignItems: 'center', gap: 12 }}>
            <span>{t('discount')}</span>
            <div className="input" style={{ width: 140, height: 36, marginLeft: 'auto' }}>
              <input
                type="number"
                min={0}
                value={discount || ''}
                onChange={e => setDiscount(Number(e.target.value) || 0)}
                placeholder="0"
                style={{ textAlign: 'right' }}
              />
            </div>
          </div>

          <div className="pnl-row pnl-row--total">
            <span>{t('toPay')}</span>
            <span>{uzs(total)}</span>
          </div>

          <div className="pnl-row" style={{ marginTop: 8 }}>
            <span style={{ color: 'var(--ink-500)', fontSize: 13 }}>Доля врача</span>
            <span style={{ color: 'var(--success-500)', fontWeight: 700 }}>{uzs(doctorShare)}</span>
          </div>

          <button
            className="btn btn--primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: 24 }}
            disabled={lines.length === 0 || saving}
            onClick={handleSave}
          >
            {saving ? 'Сохранение...' : saved ? 'Сохранено!' : <><CheckCircle size={16} /> Провести</>}
          </button>
        </div>
      </div>
    </div>
  );
}
