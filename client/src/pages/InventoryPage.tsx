import { useState } from 'react';
import { Package, AlertTriangle, DollarSign, Edit2, FileText, FilePlus } from 'lucide-react';
import { useMaterials, useSuppliers, useWarehouseDocs } from '../lib/queries';
import { uzs } from '../lib/api';
import { useLang } from '../i18n';
import NewDocModal from '../components/modals/NewDocModal';
import AddMaterialModal from '../components/modals/AddMaterialModal';

type Tab = 'materials' | 'suppliers' | 'documents';


export default function InventoryPage() {
  const { t } = useLang();
  const [tab, setTab] = useState<Tab>('materials');
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [matModalOpen, setMatModalOpen] = useState(false);

  const { data: materials, isLoading: loadingMat } = useMaterials();
  const { data: suppliers, isLoading: loadingSup } = useSuppliers();
  const { data: docs, isLoading: loadingDocs } = useWarehouseDocs();

  const matList: any[] = materials?.items ?? materials ?? [];
  const supList: any[] = suppliers?.items ?? suppliers ?? [];
  const docList: any[] = docs?.items ?? docs ?? [];

  const lowCount = matList.filter((m: any) => m.stock < m.minStock).length;
  const totalValue = matList.reduce((s: number, m: any) => s + (m.stock ?? 0) * (m.price ?? 0), 0);

  return (
    <div>
      <div className="screen__head">
        <div className="screen__titlewrap">
          <h1 style={{ font: '700 28px var(--font-sans)', color: 'var(--ink-900)' }}>{t('inventory')}</h1>
        </div>
        <div className="screen__tools">
          <button className="btn btn--outline" onClick={() => { setTab('documents'); setDocModalOpen(true); }}>
            <FilePlus size={16} /> {t('inv.newDoc')}
          </button>
          <button className="btn btn--primary" onClick={() => setMatModalOpen(true)}>
            <Package size={16} /> Добавить материал
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="kpis" style={{ marginTop: 20 }}>
        <div className="card kpi">
          <div className="kpi__icon" style={{ background: 'var(--line-blue)' }}>
            <Package size={22} color="var(--blue-500)" />
          </div>
          <div className="kpi__body">
            <div className="kpi__label">Всего позиций</div>
            <div className="kpi__value">{matList.length}</div>
          </div>
        </div>
        <div className="card kpi">
          <div className="kpi__icon" style={{ background: 'rgba(254,201,67,.22)' }}>
            <AlertTriangle size={22} color="var(--warn-700)" />
          </div>
          <div className="kpi__body">
            <div className="kpi__label">{t('lowStock')}</div>
            <div className="kpi__value" style={{ color: lowCount > 0 ? 'var(--warn-700)' : 'var(--ink-900)' }}>
              {lowCount}
            </div>
          </div>
        </div>
        <div className="card kpi">
          <div className="kpi__icon" style={{ background: 'rgba(31,138,77,.12)' }}>
            <DollarSign size={22} color="var(--success-500)" />
          </div>
          <div className="kpi__body">
            <div className="kpi__label">Стоимость склада</div>
            <div className="kpi__value" style={{ fontSize: 16 }}>{uzs(totalValue)}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab ${tab === 'materials' ? 'is-active' : ''}`} onClick={() => setTab('materials')}>
          {t('materials')}
        </button>
        <button className={`tab ${tab === 'suppliers' ? 'is-active' : ''}`} onClick={() => setTab('suppliers')}>
          {t('suppliers')}
        </button>
        <button className={`tab ${tab === 'documents' ? 'is-active' : ''}`} onClick={() => setTab('documents')}>
          {t('documents')}
        </button>
      </div>

      <div style={{ marginTop: 20 }}>
        {/* MATERIALS */}
        {tab === 'materials' && (
          <div className="card tablecard">
            {loadingMat ? (
              <div className="placeholder"><p>Загрузка...</p></div>
            ) : (
              <table className="dtable">
                <thead>
                  <tr>
                    <th>{t('name')}</th>
                    <th>{t('category')}</th>
                    <th>{t('stock')} / {t('minStock')}</th>
                    <th>{t('unit')}</th>
                    <th>{t('price')}</th>
                    <th>Поставщик</th>
                    <th style={{ width: 40 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {matList.length === 0 && (
                    <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--ink-400)', padding: 32 }}>Нет данных</td></tr>
                  )}
                  {matList.map((m: any) => {
                    const isLow = (m.stock ?? 0) < (m.minStock ?? 0);
                    return (
                      <tr key={m.id} style={isLow ? { background: 'rgba(254,201,67,.07)' } : undefined}>
                        <td>
                          <span style={{ font: '700 14px var(--font-sans)', color: 'var(--ink-900)' }}>{m.name}</span>
                          {isLow && (
                            <AlertTriangle size={13} color="var(--warn-700)" style={{ marginLeft: 6, verticalAlign: 'middle' }} />
                          )}
                        </td>
                        <td><span className="badge badge--neutral">{m.category}</span></td>
                        <td>
                          <div className="stockcell">
                            <strong style={{ color: isLow ? 'var(--warn-700)' : 'var(--ink-900)' }}>
                              {m.stock ?? 0}
                            </strong>
                            <span>мин {m.minStock ?? 0}</span>
                          </div>
                        </td>
                        <td>{m.unit}</td>
                        <td>{uzs(m.price)}</td>
                        <td style={{ color: 'var(--ink-600)' }}>{m.supplierName ?? m.supplier?.name ?? '—'}</td>
                        <td>
                          <div className="rowacts">
                            <button className="iconbtn" title="Редактировать">
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
        )}

        {/* SUPPLIERS */}
        {tab === 'suppliers' && (
          <div className="card tablecard">
            {loadingSup ? (
              <div className="placeholder"><p>Загрузка...</p></div>
            ) : (
              <table className="dtable">
                <thead>
                  <tr>
                    <th>{t('name')}</th>
                    <th>Контакт</th>
                    <th>{t('phone')}</th>
                    <th>{t('category')}</th>
                    <th>Баланс</th>
                    <th>Документов</th>
                    <th style={{ width: 40 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {supList.length === 0 && (
                    <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--ink-400)', padding: 32 }}>Нет данных</td></tr>
                  )}
                  {supList.map((s: any) => (
                    <tr key={s.id}>
                      <td style={{ font: '700 14px var(--font-sans)', color: 'var(--ink-900)' }}>{s.name}</td>
                      <td>{s.contact ?? '—'}</td>
                      <td>{s.phone ?? '—'}</td>
                      <td>{s.category ?? '—'}</td>
                      <td style={{ color: (s.balance ?? 0) < 0 ? 'var(--danger-500)' : 'var(--ink-900)', fontWeight: 700 }}>
                        {uzs(s.balance ?? 0)}
                      </td>
                      <td>{s.docsCount ?? 0}</td>
                      <td>
                        <div className="rowacts">
                          <button className="iconbtn" title="Редактировать">
                            <Edit2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* DOCUMENTS */}
        {tab === 'documents' && (
          <div className="card tablecard">
            {loadingDocs ? (
              <div className="placeholder"><p>Загрузка...</p></div>
            ) : (
              <table className="dtable">
                <thead>
                  <tr>
                    <th>Номер</th>
                    <th>Тип</th>
                    <th>Поставщик</th>
                    <th>Дата</th>
                    <th>Сумма</th>
                    <th>{t('status')}</th>
                  </tr>
                </thead>
                <tbody>
                  {docList.length === 0 && (
                    <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--ink-400)', padding: 32 }}>Нет данных</td></tr>
                  )}
                  {docList.map((d: any) => {
                    const typeColor: Record<string, string> = {
                      receipt: 'badge--success',
                      invoice: 'badge--info',
                      return: 'badge--warn',
                      writeoff: 'badge--danger',
                    };
                    const typeLabel: Record<string, string> = {
                      receipt: 'Приход',
                      invoice: 'Накладная',
                      return: 'Возврат',
                      writeoff: 'Списание',
                    };
                    const statusColor: Record<string, string> = {
                      posted: 'badge--success',
                      draft: 'badge--neutral',
                      cancelled: 'badge--danger',
                    };
                    const statusLabel: Record<string, string> = {
                      posted: 'Проведён',
                      draft: 'Черновик',
                      cancelled: 'Отменён',
                    };
                    return (
                      <tr key={d.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                            <FileText size={15} color="var(--ink-400)" />
                            <span style={{ fontWeight: 700 }}>{d.docNo ?? d.number ?? `#${d.id}`}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${typeColor[d.type] ?? 'badge--neutral'}`}>
                            {typeLabel[d.type] ?? d.type}
                          </span>
                        </td>
                        <td>{d.supplierName ?? d.supplier?.name ?? '—'}</td>
                        <td style={{ color: 'var(--ink-600)' }}>
                          {d.date ? new Date(d.date).toLocaleDateString('ru-RU') : '—'}
                        </td>
                        <td style={{ fontWeight: 700 }}>{uzs(d.total ?? d.totalSum)}</td>
                        <td>
                          <span className={`badge ${statusColor[d.status] ?? 'badge--neutral'}`}>
                            {statusLabel[d.status] ?? d.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      <NewDocModal open={docModalOpen} onClose={() => setDocModalOpen(false)} />
      <AddMaterialModal open={matModalOpen} onClose={() => setMatModalOpen(false)} />
    </div>
  );
}
