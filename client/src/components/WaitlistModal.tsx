import { X, Phone, Clock } from 'lucide-react'
import { useWaitlist } from '../lib/queries'
import { useLang } from '../i18n'

interface Props {
  onClose: () => void
}

export default function WaitlistModal({ onClose }: Props) {
  const { t } = useLang()
  const { data, isLoading } = useWaitlist()

  const waitlist: Array<{
    id: number
    patientName: string
    phone: string
    service: string
    waitingSince: string
    priority: 'high' | 'normal' | 'low'
  }> = data?.items ?? data ?? []

  const PRIORITY_CLASS: Record<string, string> = {
    high:   'badge--danger',
    normal: 'badge--info',
    low:    'badge--neutral',
  }

  const PRIORITY_LABEL: Record<string, string> = {
    high:   'Срочно',
    normal: 'Обычный',
    low:    'Низкий',
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal--wide" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h3 className="modal__title">{t('waitlist')}</h3>
          <button className="btn btn--ghost btn--icon" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="modal__body">
          {isLoading ? (
            <div className="loading-center">Загрузка...</div>
          ) : waitlist.length === 0 ? (
            <div className="empty-state"><p>Очередь пуста</p></div>
          ) : (
            <ul className="waitlist">
              {waitlist.map(item => (
                <li key={item.id} className="waitlist__item">
                  <div className="waitlist__info">
                    <span className="waitlist__name">{item.patientName}</span>
                    <span className="waitlist__service">{item.service}</span>
                  </div>
                  <div className="waitlist__meta">
                    <span><Phone size={13} /> {item.phone}</span>
                    <span><Clock size={13} /> {item.waitingSince}</span>
                    <span className={`badge ${PRIORITY_CLASS[item.priority] ?? 'badge--neutral'}`}>
                      {PRIORITY_LABEL[item.priority] ?? item.priority}
                    </span>
                  </div>
                  <button className="btn btn--primary btn--sm">{t('newVisit')}</button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="modal__footer">
          <button className="btn btn--ghost" onClick={onClose}>{t('close')}</button>
        </div>
      </div>
    </div>
  )
}
