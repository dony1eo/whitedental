import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ChevronLeft, ChevronRight, Eye, UserPlus } from 'lucide-react'
import { usePatients } from '../lib/queries'
import { useLang } from '../i18n'
import AddPatientModal from '../components/modals/AddPatientModal'

const STATUS_CLASS: Record<string, string> = {
  active:   'badge--success',
  inactive: 'badge--neutral',
  new:      'badge--info',
}
const STATUS_LABEL: Record<string, string> = {
  active:   'Активный',
  inactive: 'Неактивный',
  new:      'Новый',
}

export default function PatientsPage() {
  const { t } = useLang()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [addOpen, setAddOpen] = useState(false)

  const { data, isLoading, error } = usePatients({ page, search: search || undefined })

  if (isLoading) return <div className="loading-center">Загрузка...</div>
  if (error)     return <div className="error-center">Ошибка загрузки</div>

  const patients: Array<{
    id: number
    cardNo: string
    name: string
    firstName?: string
    lastName?: string
    phone: string
    source?: string
    status?: string
    visitsCount?: number
  }> = data?.items ?? data ?? []

  const total: number = data?.total ?? patients.length
  const perPage = 20
  const totalPages = Math.max(1, Math.ceil(total / perPage))

  return (
    <div>
      <div className="screen__head">
        <div className="screen__titlewrap">
          <h1 style={{ font: '700 28px var(--font-sans)', color: 'var(--ink-900)' }}>{t('patients')}</h1>
          <span className="meta">{total} пациентов</span>
        </div>
        <div className="screen__tools">
          {/* search */}
          <div className="topbar__search" style={{ width: 260 }}>
            <Search size={15} style={{ color: 'var(--ink-500)' }} />
            <input
              type="search"
              placeholder="Поиск по имени, номеру..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              style={{ border: 'none', outline: 'none', background: 'none', flex: 1, font: '400 14px var(--font-sans)', color: 'var(--ink-800)' }}
            />
          </div>
          <button className="btn btn--primary" onClick={() => setAddOpen(true)}>
            <UserPlus size={16} /> {t('addPatient')}
          </button>
        </div>
      </div>

      <div className="card tablecard" style={{ marginTop: 20 }}>
        <table className="dtable">
          <thead>
            <tr>
              <th>{t('cardNo')}</th>
              <th>{t('name')}</th>
              <th>{t('phone')}</th>
              <th>{t('source')}</th>
              <th>{t('status')}</th>
              <th style={{ textAlign: 'center' }}>{t('visits')}</th>
              <th style={{ width: 48 }} />
            </tr>
          </thead>
          <tbody>
            {patients.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', color: 'var(--ink-400)', padding: 40 }}>
                  Пациентов не найдено
                </td>
              </tr>
            ) : (
              patients.map(p => {
                const fullName = `${p.lastName ?? ''} ${p.firstName ?? ''}`.trim()
                const displayName = p.name ?? (fullName || '—')
                return (
                  <tr key={p.id} onClick={() => navigate(`/patients/${p.id}`)} style={{ cursor: 'pointer' }}>
                    <td style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 13, color: 'var(--ink-500)' }}>{p.cardNo ?? `#${p.id}`}</td>
                    <td style={{ fontWeight: 700, color: 'var(--ink-900)' }}>{displayName}</td>
                    <td style={{ color: 'var(--ink-600)' }}>{p.phone ?? '—'}</td>
                    <td style={{ color: 'var(--ink-600)' }}>{p.source ?? '—'}</td>
                    <td>
                      <span className={`badge ${STATUS_CLASS[p.status ?? ''] ?? 'badge--neutral'}`}>
                        {STATUS_LABEL[p.status ?? ''] ?? (p.status ?? 'Новый')}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center', color: 'var(--ink-700)' }}>{p.visitsCount ?? 0}</td>
                    <td>
                      <button
                        className="btn btn--ghost btn--icon"
                        onClick={e => { e.stopPropagation(); navigate(`/patients/${p.id}`) }}
                        title="Открыть карту"
                        style={{ padding: 4 }}
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pager">
            <span className="pager__info">Всего: {total}</span>
            <div className="pager__pages">
              <button
                className="btn btn--ghost btn--icon"
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
              >
                <ChevronLeft size={16} />
              </button>
              <span>{page} / {totalPages}</span>
              <button
                className="btn btn--ghost btn--icon"
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      <AddPatientModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  )
}
