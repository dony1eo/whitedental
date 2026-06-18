import { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useServices, useDeleteService } from '../lib/queries';
import { uzs } from '../lib/api';
import { useLang } from '../i18n';
import AddServiceModal from '../components/modals/AddServiceModal';

export default function ServicesPage() {
  const { t } = useLang();
  const [activeCat, setActiveCat] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);

  const { data, isLoading } = useServices();
  const deleteService = useDeleteService();

  const list: any[] = data?.items ?? data ?? [];

  const categories: string[] = ['all', ...Array.from(new Set(list.map((s: any) => s.category).filter(Boolean)))];

  const filtered = list.filter((s: any) => {
    const matchCat = activeCat === 'all' || s.category === activeCat;
    const matchSearch = !search || s.name?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  function handleEdit(item: any) {
    setEditItem(item);
    setModalOpen(true);
  }

  function handleAdd() {
    setEditItem(null);
    setModalOpen(true);
  }

  function handleDelete(id: number) {
    if (confirm('Удалить услугу?')) {
      deleteService.mutate(id);
    }
  }

  return (
    <div>
      <div className="screen__head">
        <div className="screen__titlewrap">
          <h1 style={{ font: '700 28px var(--font-sans)', color: 'var(--ink-900)' }}>{t('services')}</h1>
          <span className="screen__count">{filtered.length} услуг</span>
        </div>
        <div className="screen__tools">
          <div className="tbl-search">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ color: 'var(--ink-400)', flexShrink: 0 }}>
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              placeholder={t('search')}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn--primary" onClick={handleAdd}>
            <Plus size={16} /> Добавить услугу
          </button>
        </div>
      </div>

      <div className="chips">
        {categories.map(cat => (
          <button
            key={cat}
            className={`chip ${activeCat === cat ? 'chip--on' : ''}`}
            onClick={() => setActiveCat(cat)}
          >
            {cat === 'all' ? t('all') : cat}
          </button>
        ))}
      </div>

      <div className="card tablecard" style={{ marginTop: 18 }}>
        {isLoading ? (
          <div className="placeholder"><p>Загрузка...</p></div>
        ) : (
          <table className="dtable">
            <thead>
              <tr>
                <th>{t('name')}</th>
                <th>{t('category')}</th>
                <th>{t('price')}</th>
                <th>Длит. (мин)</th>
                <th>Врач %</th>
                <th>{t('status')}</th>
                <th style={{ width: 80 }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: 'var(--ink-400)', padding: 32 }}>
                    Нет услуг
                  </td>
                </tr>
              )}
              {filtered.map((s: any) => (
                <tr key={s.id}>
                  <td style={{ font: '700 14px var(--font-sans)', color: 'var(--ink-900)' }}>{s.name}</td>
                  <td>
                    {s.category && (
                      <span className="badge badge--neutral">{s.category}</span>
                    )}
                  </td>
                  <td style={{ fontWeight: 700 }}>{uzs(s.price)}</td>
                  <td style={{ color: 'var(--ink-600)' }}>{s.duration ?? '—'}</td>
                  <td style={{ color: 'var(--ink-600)' }}>
                    {s.doctorPct != null ? `${s.doctorPct}%` : '—'}
                  </td>
                  <td>
                    {s.active !== false ? (
                      <span className="badge badge--success">{t('active')}</span>
                    ) : (
                      <span className="badge badge--neutral">{t('inactive')}</span>
                    )}
                  </td>
                  <td>
                    <div className="rowacts">
                      <button className="iconbtn" title={t('edit')} onClick={() => handleEdit(s)}>
                        <Edit2 size={15} />
                      </button>
                      <button className="iconbtn" title={t('delete')} onClick={() => handleDelete(s.id)}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AddServiceModal open={modalOpen} onClose={() => setModalOpen(false)} editItem={editItem} />
    </div>
  );
}
