import { useState } from 'react';
import { Send, MessageCircle, MessageSquare, Edit2, Plus } from 'lucide-react';
import { useCampaigns, usePatientGroups } from '../lib/queries';
import { useLang } from '../i18n';
import api from '../lib/api';
import { useQueryClient } from '@tanstack/react-query';

type Tab = 'campaigns' | 'groups';

const CHANNEL_CONFIG: Record<string, { label: string; color: string; bg: string; Icon: any }> = {
  telegram: { label: 'Telegram', color: '#0088cc', bg: 'rgba(0,136,204,.12)', Icon: Send },
  whatsapp: { label: 'WhatsApp', color: '#25d366', bg: 'rgba(37,211,102,.12)', Icon: MessageCircle },
  sms: { label: 'SMS', color: '#f97316', bg: 'rgba(249,115,22,.12)', Icon: MessageSquare },
  instagram: { label: 'Instagram', color: '#e1306c', bg: 'rgba(225,48,108,.12)', Icon: Send },
};

const STATUS_CONFIG: Record<string, { cls: string; label: string }> = {
  sent: { cls: 'badge--success', label: 'Отправлено' },
  scheduled: { cls: 'badge--info', label: 'Запланировано' },
  draft: { cls: 'badge--neutral', label: 'Черновик' },
};

const GROUP_COLORS = [
  '#0787c9', '#1f8a4d', '#f97316', '#e1306c', '#8b5cf6', '#06b6d4', '#84cc16', '#f43f5e',
];

export default function MarketingPage() {
  const { t } = useLang();
  const qc = useQueryClient();
  const [tab, setTab] = useState<Tab>('campaigns');
  const [campaignOpen, setCampaignOpen] = useState(false);

  const { data: campaigns, isLoading: loadingC } = useCampaigns();
  const { data: groups, isLoading: loadingG } = usePatientGroups();

  const campList: any[] = campaigns?.items ?? campaigns ?? [];
  const groupList: any[] = groups?.items ?? groups ?? [];

  const [campForm, setCampForm] = useState({
    name: '',
    channel: 'telegram',
    groupName: '',
    reach: 0,
  });
  const [campSaving, setCampSaving] = useState(false);

  async function handleCreateCampaign(e: React.FormEvent) {
    e.preventDefault();
    if (!campForm.name) return;
    setCampSaving(true);
    try {
      await api.post('/marketing/campaigns', {
        name: campForm.name,
        channel: campForm.channel,
        groupName: campForm.groupName || undefined,
        reach: Number(campForm.reach),
        status: 'draft',
      });
      qc.invalidateQueries({ queryKey: ['campaigns'] });
      setCampForm({ name: '', channel: 'telegram', groupName: '', reach: 0 });
      setCampaignOpen(false);
    } catch (err) {
      alert('Ошибка: ' + String(err));
    } finally {
      setCampSaving(false);
    }
  }

  return (
    <div>
      <div className="screen__head">
        <div className="screen__titlewrap">
          <h1 style={{ font: '700 28px var(--font-sans)', color: 'var(--ink-900)' }}>{t('marketing')}</h1>
        </div>
        <div className="screen__tools">
          <button className="btn btn--primary" onClick={() => setCampaignOpen(true)}>
            <Plus size={16} /> Создать кампанию
          </button>
        </div>
      </div>

      {campaignOpen && (
        <div className="overlay" onClick={e => e.target === e.currentTarget && setCampaignOpen(false)}>
          <div className="modal" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
            <div className="modal__head">
              <h1>Новая кампания</h1>
              <button className="modal__close" onClick={() => setCampaignOpen(false)} type="button">✕</button>
            </div>
            <form onSubmit={handleCreateCampaign} style={{ marginTop: 24 }}>
              <div className="modal__body">
                <div className="formgrid">
                  <div className="field">
                    <label className="field__label">{t('name')} <span className="req-star">*</span></label>
                    <div className="input">
                      <input value={campForm.name} onChange={e => setCampForm(f => ({ ...f, name: e.target.value }))} placeholder="Акция на чистку" required />
                    </div>
                  </div>
                  <div className="field">
                    <label className="field__label">{t('channel')}</label>
                    <div className="input">
                      <select value={campForm.channel} onChange={e => setCampForm(f => ({ ...f, channel: e.target.value }))} style={{ width: '100%' }}>
                        <option value="telegram">Telegram</option>
                        <option value="whatsapp">WhatsApp</option>
                        <option value="sms">SMS</option>
                        <option value="instagram">Instagram</option>
                      </select>
                    </div>
                  </div>
                  <div className="field">
                    <label className="field__label">Группа</label>
                    <div className="input">
                      <input value={campForm.groupName} onChange={e => setCampForm(f => ({ ...f, groupName: e.target.value }))} placeholder="Все пациенты" />
                    </div>
                  </div>
                  <div className="field">
                    <label className="field__label">{t('reach')}</label>
                    <div className="input">
                      <input type="number" min={0} value={campForm.reach || ''} onChange={e => setCampForm(f => ({ ...f, reach: Number(e.target.value) || 0 }))} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal__foot">
                <button type="button" className="btn btn--ghost" onClick={() => setCampaignOpen(false)}>{t('cancel')}</button>
                <button type="submit" className="btn btn--primary" disabled={campSaving}>{campSaving ? 'Сохранение...' : t('save')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="tabs">
        <button className={`tab ${tab === 'campaigns' ? 'is-active' : ''}`} onClick={() => setTab('campaigns')}>
          {t('campaigns')}
        </button>
        <button className={`tab ${tab === 'groups' ? 'is-active' : ''}`} onClick={() => setTab('groups')}>
          {t('groups')}
        </button>
      </div>

      <div style={{ marginTop: 20 }}>
        {tab === 'campaigns' && (
          <div className="card tablecard">
            {loadingC ? (
              <div className="placeholder"><p>Загрузка...</p></div>
            ) : (
              <table className="dtable">
                <thead>
                  <tr>
                    <th>{t('name')}</th>
                    <th>{t('channel')}</th>
                    <th>Группа</th>
                    <th>{t('reach')}</th>
                    <th>{t('status')}</th>
                    <th>Дата</th>
                    <th style={{ width: 60 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {campList.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', color: 'var(--ink-400)', padding: 32 }}>
                        Нет кампаний
                      </td>
                    </tr>
                  )}
                  {campList.map((c: any) => {
                    const ch = CHANNEL_CONFIG[c.channel?.toLowerCase()] ?? {
                      label: c.channel,
                      color: 'var(--ink-600)',
                      bg: 'var(--surface-2)',
                      Icon: Send,
                    };
                    const st = STATUS_CONFIG[c.status] ?? { cls: 'badge--neutral', label: c.status };
                    return (
                      <tr key={c.id}>
                        <td style={{ font: '700 14px var(--font-sans)', color: 'var(--ink-900)' }}>{c.name}</td>
                        <td>
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            background: ch.bg, color: ch.color,
                            padding: '3px 11px', borderRadius: 25, font: '700 13px var(--font-sans)',
                          }}>
                            <ch.Icon size={13} />
                            {ch.label}
                          </span>
                        </td>
                        <td style={{ color: 'var(--ink-600)' }}>{c.groupName ?? c.group?.name ?? '—'}</td>
                        <td style={{ fontWeight: 700 }}>{c.reach?.toLocaleString('ru-RU') ?? '—'}</td>
                        <td><span className={`badge ${st.cls}`}>{st.label}</span></td>
                        <td style={{ color: 'var(--ink-600)' }}>
                          {c.date ? new Date(c.date).toLocaleDateString('ru-RU') : '—'}
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
        )}

        {tab === 'groups' && (
          loadingG ? (
            <div className="placeholder"><p>Загрузка...</p></div>
          ) : (
            <div className="grpgrid">
              {groupList.length === 0 && (
                <div className="placeholder" style={{ gridColumn: '1/-1' }}>
                  <p>Нет групп пациентов</p>
                </div>
              )}
              {groupList.map((g: any, i: number) => {
                const color = g.color ?? GROUP_COLORS[i % GROUP_COLORS.length];
                return (
                  <div key={g.id} className="card grpcard">
                    <div className="grpcard__top">
                      <div className="grpcard__dot" style={{ background: color }} />
                      <h3 style={{ font: '700 15px var(--font-sans)', color: 'var(--ink-900)' }}>{g.name}</h3>
                    </div>
                    <p style={{ font: '400 13px var(--font-sans)', color: 'var(--ink-500)', lineHeight: 1.45, margin: '4px 0 0' }}>
                      {g.condition ?? g.description ?? 'Без условия'}
                    </p>
                    <div className="grpcard__foot">
                      <span className="grpcard__n">{g.count ?? g.patientCount ?? 0}</span>
                      <span style={{ font: '400 13px var(--font-sans)', color: 'var(--ink-500)' }}>
                        пациентов
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
}
