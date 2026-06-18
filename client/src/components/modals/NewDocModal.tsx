import { useState } from 'react'
import { X, Plus, ChevronDown } from 'lucide-react'
import { useMaterials, useSuppliers, useCreateWarehouseDoc } from '../../lib/queries'
import { uzs } from '../../lib/api'
import { useLang } from '../../i18n'

interface Props {
  open: boolean
  onClose: () => void
}

interface DocRow {
  id: number
  materialId: string
  qty: number
  price: number
}

const DOC_TYPES = [
  ['dIncome',   'success'],
  ['dExpense',  'warn'],
  ['dMove',     'info'],
  ['dWriteoff', 'neutral'],
] as const

const TYPE_API: Record<string, string> = {
  dIncome:   'receipt',
  dExpense:  'invoice',
  dMove:     'move',
  dWriteoff: 'writeoff',
}

export default function NewDocModal({ open, onClose }: Props) {
  const { t } = useLang()
  const { data: mats } = useMaterials()
  const { data: sups } = useSuppliers()
  const createDoc = useCreateWarehouseDoc()

  const materials: any[] = mats?.items ?? mats ?? []
  const suppliers: any[] = sups?.items ?? sups ?? []

  const [docType, setDocType] = useState<string>('dIncome')
  const [supplierId, setSupplierId] = useState<string>('')
  const [party, setParty] = useState<string>('')
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [rows, setRows] = useState<DocRow[]>(() => [{
    id: 1,
    materialId: '',
    qty: 1,
    price: 0,
  }])

  const showSum = docType === 'dIncome'

  function addRow() {
    setRows(r => [...r, { id: Date.now(), materialId: '', qty: 1, price: 0 }])
  }

  function removeRow(id: number) {
    setRows(r => r.length > 1 ? r.filter(x => x.id !== id) : r)
  }

  function setMaterial(id: number, matId: string) {
    const mat = materials.find((m: any) => String(m.id) === matId)
    setRows(r => r.map(x => x.id === id ? { ...x, materialId: matId, price: mat?.price || 0 } : x))
  }

  function setQty(id: number, q: number) {
    setRows(r => r.map(x => x.id === id ? { ...x, qty: Math.max(1, q || 1) } : x))
  }

  const total = rows.reduce((a, b) => a + b.qty * b.price, 0)

  function handleSave() {
    const lines = rows
      .filter(r => r.materialId)
      .map(r => ({ materialId: Number(r.materialId), qty: r.qty, price: r.price }))

    createDoc.mutate(
      {
        type: TYPE_API[docType],
        supplierId: supplierId ? Number(supplierId) : undefined,
        party: party || undefined,
        date,
        lines,
      },
      { onSuccess: onClose }
    )
  }

  if (!open) return null

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 720 }}>
        <div className="modal__head">
          <h1>{t('inv.newDoc')}</h1>
          <button className="modal__close" onClick={onClose} type="button"><X size={22} /></button>
        </div>

        <div className="modal__body">
          {/* Top row: type / supplier / date */}
          <div className="formgrid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
            <div className="field">
              <label className="field__label">{t('inv.docType')} <span style={{ color: 'var(--danger-500)' }}>*</span></label>
              <div className="input" style={{ padding: 0 }}>
                <select
                  value={docType}
                  onChange={e => setDocType(e.target.value)}
                  style={{ width: '100%', height: '100%', padding: '0 14px', border: 'none', background: 'none', font: '400 15px var(--font-sans)', color: 'var(--ink-800)' }}
                >
                  {DOC_TYPES.map(([k]) => (
                    <option key={k} value={k}>{t(`inv.${k}`)}</option>
                  ))}
                </select>
                <ChevronDown size={16} style={{ color: 'var(--ink-500)', marginRight: 10, flexShrink: 0 }} />
              </div>
            </div>

            {docType === 'dIncome' ? (
              <div className="field">
                <label className="field__label">{t('inv.supplier')}</label>
                <div className="input" style={{ padding: 0 }}>
                  <select
                    value={supplierId}
                    onChange={e => setSupplierId(e.target.value)}
                    style={{ width: '100%', height: '100%', padding: '0 14px', border: 'none', background: 'none', font: '400 15px var(--font-sans)', color: 'var(--ink-800)' }}
                  >
                    <option value="">—</option>
                    {suppliers.map((s: any) => (
                      <option key={s.id} value={String(s.id)}>{s.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} style={{ color: 'var(--ink-500)', marginRight: 10, flexShrink: 0 }} />
                </div>
              </div>
            ) : (
              <div className="field">
                <label className="field__label">{t('inv.party')}</label>
                <div className="input">
                  <input
                    type="text"
                    value={party}
                    onChange={e => setParty(e.target.value)}
                    placeholder={t('inv.party')}
                    style={{ border: 'none', outline: 'none', background: 'none', flex: 1, font: '400 15px var(--font-sans)', color: 'var(--ink-800)' }}
                  />
                </div>
              </div>
            )}

            <div className="field">
              <label className="field__label">{t('today')} / Дата <span style={{ color: 'var(--danger-500)' }}>*</span></label>
              <div className="input">
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  style={{ border: 'none', outline: 'none', background: 'none', flex: 1, font: '400 15px var(--font-sans)', color: 'var(--ink-800)' }}
                />
              </div>
            </div>
          </div>

          {/* Material rows table */}
          <div className="card tablecard" style={{ marginTop: 4 }}>
            <table className="dtable">
              <thead>
                <tr>
                  <th>{t('inv.material')}</th>
                  <th style={{ width: 90, textAlign: 'center' }}>{t('qty')}</th>
                  {showSum && <th style={{ width: 150, textAlign: 'right' }}>{t('inv.sum')}</th>}
                  <th style={{ width: 40 }} />
                </tr>
              </thead>
              <tbody>
                {rows.map(row => (
                  <tr key={row.id}>
                    <td>
                      <div className="input" style={{ padding: 0, height: 38 }}>
                        <select
                          value={row.materialId}
                          onChange={e => setMaterial(row.id, e.target.value)}
                          style={{ width: '100%', height: '100%', padding: '0 14px', border: 'none', background: 'none', font: '400 14px var(--font-sans)', color: 'var(--ink-800)' }}
                        >
                          <option value="">Выберите материал...</option>
                          {materials.map((m: any) => (
                            <option key={m.id} value={String(m.id)}>{m.name}</option>
                          ))}
                        </select>
                        <ChevronDown size={14} style={{ color: 'var(--ink-500)', marginRight: 8, flexShrink: 0 }} />
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="number"
                        min={1}
                        value={row.qty}
                        onChange={e => setQty(row.id, parseInt(e.target.value))}
                        style={{ width: 60, textAlign: 'center', border: '1px solid var(--line-300)', borderRadius: 6, padding: '4px 8px', font: '700 14px var(--font-sans)', color: 'var(--ink-800)' }}
                      />
                    </td>
                    {showSum && (
                      <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--ink-900)' }}>
                        {uzs(row.qty * row.price)}
                      </td>
                    )}
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => removeRow(row.id)}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, border: 'none', background: 'none', cursor: 'pointer', color: 'var(--ink-400)', borderRadius: 6 }}
                      >
                        <X size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button type="button" className="btn btn--outline btn--sm" onClick={addRow}>
              <Plus size={14} /> {t('add')}
            </button>
            {showSum && (
              <div style={{ font: '700 17px var(--font-sans)', color: 'var(--ink-900)' }}>
                {t('total')}: {uzs(total)} UZS
              </div>
            )}
          </div>
        </div>

        <div className="modal__foot">
          <button type="button" className="btn btn--ghost" onClick={onClose}>{t('cancel')}</button>
          <button
            type="button"
            className="btn btn--primary"
            onClick={handleSave}
            disabled={createDoc.isPending}
          >
            {createDoc.isPending ? 'Сохранение...' : t('save')}
          </button>
        </div>
      </div>
    </div>
  )
}
