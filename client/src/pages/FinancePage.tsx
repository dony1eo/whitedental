import { useState } from 'react'
import { TrendingUp, TrendingDown, DollarSign, Percent, Plus } from 'lucide-react'
import { useCashbox, usePnl, useDebtors, useCreateCashEntry } from '../lib/queries'
import { uzs } from '../lib/api'
import { useLang } from '../i18n'

const METHOD_CLASS: Record<string, string> = {
  cash:   'badge--success',
  card:   'badge--info',
  online: 'badge--info',
  debt:   'badge--danger',
}
const METHOD_LABEL: Record<string, string> = {
  cash:   'Наличные',
  card:   'Карта',
  online: 'Онлайн',
  debt:   'Долг',
}

function CashboxTab() {
  const today = new Date().toISOString().split('T')[0]
  const { data, isLoading, error } = useCashbox(today)
  const createEntry = useCreateCashEntry()
  const { t } = useLang()

  const [addForm, setAddForm] = useState(false)
  const [entryForm, setEntryForm] = useState({
    operation: '',
    method: 'cash',
    amount: 0,
    isIncome: true,
  })

  function handleAddEntry(e: React.FormEvent) {
    e.preventDefault()
    if (!entryForm.operation || entryForm.amount <= 0) return
    createEntry.mutate(
      {
        operation: entryForm.operation,
        method: entryForm.method,
        amount: entryForm.isIncome ? Math.abs(entryForm.amount) : -Math.abs(entryForm.amount),
        isIncome: entryForm.isIncome,
      },
      {
        onSuccess: () => {
          setAddForm(false)
          setEntryForm({ operation: '', method: 'cash', amount: 0, isIncome: true })
        },
      }
    )
  }

  if (isLoading) return <div className="loading-center">Загрузка...</div>
  if (error)     return <div className="error-center">Ошибка загрузки</div>

  const entries: Array<{
    id: number
    operation: string
    method: string
    amount: number
    isIncome: boolean
    createdAt: string
  }> = data?.entries ?? []

  const income  = data?.income  ?? 0
  const expense = data?.expense ?? 0
  const balance = data?.balance ?? 0

  return (
    <div>
      <div className="kpis" style={{ marginBottom: 20 }}>
        <div className="card kpi">
          <div className="kpi__icon" style={{ background: 'rgba(31,138,77,.12)' }}>
            <TrendingUp size={22} color="var(--success-500)" />
          </div>
          <div className="kpi__body">
            <div className="kpi__label">{t('revenue')}</div>
            <div className="kpi__value" style={{ fontSize: 18 }}>{uzs(income)}</div>
          </div>
        </div>
        <div className="card kpi">
          <div className="kpi__icon" style={{ background: 'rgba(229,57,53,.10)' }}>
            <TrendingDown size={22} color="var(--danger-500)" />
          </div>
          <div className="kpi__body">
            <div className="kpi__label">{t('expenses')}</div>
            <div className="kpi__value" style={{ fontSize: 18 }}>{uzs(expense)}</div>
          </div>
        </div>
        <div className="card kpi">
          <div className="kpi__icon" style={{ background: 'rgba(7,135,201,.12)' }}>
            <DollarSign size={22} color="var(--blue-500)" />
          </div>
          <div className="kpi__body">
            <div className="kpi__label">{t('balance')}</div>
            <div className="kpi__value" style={{ fontSize: 18 }}>{uzs(balance)}</div>
          </div>
        </div>
      </div>

      <div className="card tablecard">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid var(--line-300)' }}>
          <b style={{ font: '700 15px var(--font-sans)', color: 'var(--ink-900)' }}>Операции за день</b>
          <button className="btn btn--primary btn--sm" onClick={() => setAddForm(!addForm)}>
            <Plus size={14} /> Добавить
          </button>
        </div>

        {addForm && (
          <form onSubmit={handleAddEntry} style={{ padding: '16px', borderBottom: '1px solid var(--line-300)', background: 'var(--surface-2)' }}>
            <div className="formgrid" style={{ gridTemplateColumns: '1fr 1fr auto auto auto', alignItems: 'end', gap: 10 }}>
              <div className="field">
                <label className="field__label">Описание <span className="req-star">*</span></label>
                <div className="input" style={{ height: 38 }}>
                  <input value={entryForm.operation} onChange={e => setEntryForm(f => ({ ...f, operation: e.target.value }))} placeholder="Приём пациента" required />
                </div>
              </div>
              <div className="field">
                <label className="field__label">Сумма <span className="req-star">*</span></label>
                <div className="input" style={{ height: 38 }}>
                  <input type="number" min={0} value={entryForm.amount || ''} onChange={e => setEntryForm(f => ({ ...f, amount: Number(e.target.value) || 0 }))} required />
                </div>
              </div>
              <div className="field">
                <label className="field__label">Метод</label>
                <div className="input" style={{ height: 38, padding: 0 }}>
                  <select value={entryForm.method} onChange={e => setEntryForm(f => ({ ...f, method: e.target.value }))} style={{ width: '100%', height: '100%', padding: '0 10px', border: 'none', background: 'none', font: '400 14px var(--font-sans)' }}>
                    <option value="cash">Наличные</option>
                    <option value="card">Карта</option>
                    <option value="online">Онлайн</option>
                    <option value="debt">Долг</option>
                  </select>
                </div>
              </div>
              <div className="field">
                <label className="field__label">Тип</label>
                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', fontSize: 13 }}>
                    <input type="radio" checked={entryForm.isIncome} onChange={() => setEntryForm(f => ({ ...f, isIncome: true }))} />
                    Приход
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', fontSize: 13 }}>
                    <input type="radio" checked={!entryForm.isIncome} onChange={() => setEntryForm(f => ({ ...f, isIncome: false }))} />
                    Расход
                  </label>
                </div>
              </div>
              <button type="submit" className="btn btn--primary btn--sm" disabled={createEntry.isPending}>
                {createEntry.isPending ? '...' : <Plus size={14} />}
              </button>
            </div>
          </form>
        )}

        <table className="dtable">
          <thead>
            <tr>
              <th>Время</th>
              <th>Описание</th>
              <th>Метод</th>
              <th>Тип</th>
              <th style={{ textAlign: 'right' }}>Сумма</th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--ink-400)', padding: 32 }}>Операций нет</td></tr>
            ) : (
              entries.map(e => (
                <tr key={e.id}>
                  <td style={{ color: 'var(--ink-500)' }}>
                    {new Date(e.createdAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td>{e.operation}</td>
                  <td>
                    <span className={`badge ${METHOD_CLASS[e.method] ?? 'badge--neutral'}`}>
                      {METHOD_LABEL[e.method] ?? e.method}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${e.isIncome ? 'badge--success' : 'badge--danger'}`}>
                      {e.isIncome ? 'Приход' : 'Расход'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', color: e.isIncome ? 'var(--success-500)' : 'var(--danger-500)', fontWeight: 700 }}>
                    {e.isIncome ? '+' : '-'}{uzs(Math.abs(e.amount))}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function PnlTab() {
  const now = new Date()
  const { data, isLoading, error } = usePnl(now.getMonth() + 1, now.getFullYear())

  if (isLoading) return <div className="loading-center">Загрузка...</div>
  if (error)     return <div className="error-center">Ошибка загрузки</div>

  const revenue  = data?.revenue  ?? data?.summary?.revenue  ?? 0
  const expenses = data?.expenses ?? data?.summary?.expenses ?? 0
  const profit   = data?.profit   ?? data?.netProfit  ?? data?.summary?.profit ?? (revenue - expenses)
  const margin   = revenue ? Math.round((profit / revenue) * 100) : 0

  const incomeItems: Array<{ label: string; amount: number }>  = data?.incomeBreakdown  ?? []
  const expenseItems: Array<{ label: string; amount: number }> = data?.expenseBreakdown ?? []

  return (
    <div>
      <div className="kpis" style={{ marginBottom: 20 }}>
        {[
          { icon: <TrendingUp size={22} color="var(--blue-500)" />, bg: 'rgba(7,135,201,.12)',   label: 'Выручка',  value: uzs(revenue) },
          { icon: <TrendingDown size={22} color="var(--danger-500)" />, bg: 'rgba(229,57,53,.10)', label: 'Расходы', value: uzs(expenses) },
          { icon: <DollarSign size={22} color="var(--success-500)" />, bg: 'rgba(31,138,77,.12)', label: 'Прибыль',  value: uzs(profit) },
          { icon: <Percent size={22} color="#7c3aed" />, bg: 'rgba(124,58,237,.12)',              label: 'Маржа',    value: `${margin}%` },
        ].map((k, i) => (
          <div key={i} className="card kpi">
            <div className="kpi__icon" style={{ background: k.bg }}>{k.icon}</div>
            <div className="kpi__body">
              <div className="kpi__label">{k.label}</div>
              <div className="kpi__value" style={{ fontSize: 18 }}>{k.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="pnl-cols">
        <div className="card" style={{ padding: '18px 20px' }}>
          <div className="cardhead" style={{ marginBottom: 12 }}>
            <h3>Доходы</h3>
          </div>
          {incomeItems.length === 0 ? (
            <div style={{ color: 'var(--ink-400)', padding: '12px 0', fontSize: 14 }}>Нет данных</div>
          ) : incomeItems.map((item, i) => (
            <div key={i} className="pnl-row">
              <span>{item.label}</span>
              <b style={{ color: 'var(--success-500)' }}>{uzs(item.amount)}</b>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: '18px 20px' }}>
          <div className="cardhead" style={{ marginBottom: 12 }}>
            <h3>Расходы</h3>
          </div>
          {expenseItems.length === 0 ? (
            <div style={{ color: 'var(--ink-400)', padding: '12px 0', fontSize: 14 }}>Нет данных</div>
          ) : expenseItems.map((item, i) => (
            <div key={i} className="pnl-row">
              <span>{item.label}</span>
              <b style={{ color: 'var(--danger-500)' }}>{uzs(item.amount)}</b>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function DebtorsTab() {
  const { data, isLoading, error } = useDebtors()

  if (isLoading) return <div className="loading-center">Загрузка...</div>
  if (error)     return <div className="error-center">Ошибка загрузки</div>

  const debtors: Array<{
    id: number
    patientName: string
    phone?: string
    debt: number
    lastVisit?: string
  }> = data?.items ?? data ?? []

  return (
    <div className="card tablecard">
      <table className="dtable">
        <thead>
          <tr>
            <th>Пациент</th>
            <th>Телефон</th>
            <th>Последний визит</th>
            <th style={{ textAlign: 'right' }}>Долг</th>
          </tr>
        </thead>
        <tbody>
          {debtors.length === 0 ? (
            <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--ink-400)', padding: 32 }}>Должников нет</td></tr>
          ) : (
            debtors.map(d => (
              <tr key={d.id}>
                <td style={{ fontWeight: 700 }}>{d.patientName}</td>
                <td style={{ color: 'var(--ink-600)' }}>{d.phone ?? '—'}</td>
                <td style={{ color: 'var(--ink-600)' }}>
                  {d.lastVisit ? new Date(d.lastVisit).toLocaleDateString('ru-RU') : '—'}
                </td>
                <td style={{ textAlign: 'right', color: 'var(--danger-500)', fontWeight: 700 }}>
                  {uzs(Math.abs(d.debt))}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

const TABS = [
  { key: 'cashbox', label: 'Касса' },
  { key: 'pnl',     label: 'П&У'   },
  { key: 'debtors', label: 'Должники' },
] as const

export default function FinancePage() {
  const { t } = useLang()
  const [tab, setTab] = useState<'cashbox' | 'pnl' | 'debtors'>('cashbox')

  return (
    <div>
      <div className="screen__head">
        <div className="screen__titlewrap">
          <h1 style={{ font: '700 28px var(--font-sans)', color: 'var(--ink-900)' }}>{t('finance')}</h1>
        </div>
      </div>

      <div className="tabs">
        {TABS.map(item => (
          <button
            key={item.key}
            className={`tab ${tab === item.key ? 'is-active' : ''}`}
            onClick={() => setTab(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 20 }}>
        {tab === 'cashbox' && <CashboxTab />}
        {tab === 'pnl'     && <PnlTab />}
        {tab === 'debtors' && <DebtorsTab />}
      </div>
    </div>
  )
}
