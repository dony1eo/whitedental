import { useState } from 'react';
import { X } from 'lucide-react';
import { useCreateMaterial, useSuppliers } from '../../lib/queries';
import { useLang } from '../../i18n';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AddMaterialModal({ open, onClose }: Props) {
  const { t } = useLang();
  const createMaterial = useCreateMaterial();
  const { data: suppliersData } = useSuppliers();
  const suppliers: any[] = suppliersData?.items ?? suppliersData ?? [];

  const [form, setForm] = useState({
    name: '',
    category: '',
    stock: 0,
    minStock: 0,
    unit: 'шт',
    price: 0,
    supplierId: '',
  });
  const [saveError, setSaveError] = useState('');

  function set(key: string, val: string | number) {
    setForm(prev => ({ ...prev, [key]: val }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaveError('');
    if (!form.name.trim()) {
      setSaveError('Название материала обязательно');
      return;
    }
    createMaterial.mutate(
      {
        name: form.name.trim(),
        category: form.category || undefined,
        stock: Number(form.stock),
        minStock: Number(form.minStock),
        unit: form.unit || 'шт',
        price: Number(form.price),
        supplierId: form.supplierId ? Number(form.supplierId) : undefined,
      },
      {
        onSuccess: () => {
          setForm({ name: '', category: '', stock: 0, minStock: 0, unit: 'шт', price: 0, supplierId: '' });
          onClose();
        },
        onError: (err: any) => {
          const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message || 'Ошибка при создании материала';
          setSaveError(msg);
        },
      }
    );
  }

  if (!open) return null;

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 520 }}>
        <div className="modal__head">
          <h1>Добавить материал</h1>
          <button className="modal__close" onClick={onClose} type="button">
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
          <div className="modal__body">
            <div className="formgrid">
              <div className="field" style={{ gridColumn: '1/-1' }}>
                <label className="field__label">
                  {t('name')} <span className="req-star">*</span>
                </label>
                <div className="input">
                  <input
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                    placeholder="Анестетик Ультракаин"
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label className="field__label">{t('category')}</label>
                <div className="input">
                  <input
                    value={form.category}
                    onChange={e => set('category', e.target.value)}
                    placeholder="Анестетики"
                  />
                </div>
              </div>

              <div className="field">
                <label className="field__label">{t('unit')}</label>
                <div className="input">
                  <select value={form.unit} onChange={e => set('unit', e.target.value)} style={{ width: '100%' }}>
                    <option value="шт">шт</option>
                    <option value="мл">мл</option>
                    <option value="г">г</option>
                    <option value="уп">уп</option>
                    <option value="фл">фл</option>
                    <option value="компл">компл</option>
                  </select>
                </div>
              </div>

              <div className="field">
                <label className="field__label">{t('stock')}</label>
                <div className="input">
                  <input
                    type="number"
                    min={0}
                    value={form.stock || ''}
                    onChange={e => set('stock', Number(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="field">
                <label className="field__label">{t('minStock')}</label>
                <div className="input">
                  <input
                    type="number"
                    min={0}
                    value={form.minStock || ''}
                    onChange={e => set('minStock', Number(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="field">
                <label className="field__label">{t('price')} (сум)</label>
                <div className="input">
                  <input
                    type="number"
                    min={0}
                    value={form.price || ''}
                    onChange={e => set('price', Number(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="field">
                <label className="field__label">{t('inv.supplier')}</label>
                <div className="input">
                  <select
                    value={form.supplierId}
                    onChange={e => set('supplierId', e.target.value)}
                    style={{ width: '100%' }}
                  >
                    <option value="">—</option>
                    {suppliers.map((s: any) => (
                      <option key={s.id} value={String(s.id)}>{s.name}</option>
                    ))}
                  </select>
                </div>
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
            <button type="submit" className="btn btn--primary" disabled={createMaterial.isPending}>
              {createMaterial.isPending ? 'Сохранение...' : t('save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
