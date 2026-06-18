import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useCreateService, useUpdateService } from '../../lib/queries';
import { useLang } from '../../i18n';

interface Props {
  open: boolean;
  onClose: () => void;
  editItem?: {
    id: number;
    name: string;
    category: string;
    price: number;
    duration: number;
    doctorPct: number;
  } | null;
}

export default function AddServiceModal({ open, onClose, editItem }: Props) {
  const { t } = useLang();
  const createService = useCreateService();
  const updateService = useUpdateService();

  const [form, setForm] = useState({
    name: '',
    category: '',
    price: 0,
    duration: 45,
    doctorPct: 30,
  });

  useEffect(() => {
    if (editItem) {
      setForm({
        name: editItem.name,
        category: editItem.category,
        price: editItem.price,
        duration: editItem.duration,
        doctorPct: editItem.doctorPct,
      });
    } else {
      setForm({ name: '', category: '', price: 0, duration: 45, doctorPct: 30 });
    }
  }, [editItem, open]);

  const isEdit = !!editItem;

  function set(key: string, val: string | number) {
    setForm(prev => ({ ...prev, [key]: val }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = {
      name: form.name,
      category: form.category,
      price: Number(form.price),
      duration: Number(form.duration),
      doctorPct: Number(form.doctorPct),
    };
    if (isEdit) {
      updateService.mutate({ id: editItem!.id, ...data }, { onSuccess: onClose });
    } else {
      createService.mutate(data, { onSuccess: onClose });
    }
  }

  if (!open) return null;

  const pending = createService.isPending || updateService.isPending;

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 500 }}>
        <div className="modal__head">
          <h1>{isEdit ? t('edit') : 'Добавить услугу'}</h1>
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
                    placeholder="Консультация"
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label className="field__label">
                  {t('category')} <span className="req-star">*</span>
                </label>
                <div className="input">
                  <select
                    value={form.category}
                    onChange={e => set('category', e.target.value)}
                    style={{ width: '100%' }}
                    required
                  >
                    <option value="">—</option>
                    <option>Терапия</option>
                    <option>Хирургия</option>
                    <option>Ортодонтия</option>
                    <option>Ортопедия</option>
                    <option>Имплантация</option>
                    <option>Пародонтология</option>
                    <option>Профилактика</option>
                    <option>Диагностика</option>
                  </select>
                </div>
              </div>

              <div className="field">
                <label className="field__label">
                  {t('price')} (сум) <span className="req-star">*</span>
                </label>
                <div className="input">
                  <input
                    type="number"
                    min={0}
                    value={form.price || ''}
                    onChange={e => set('price', Number(e.target.value) || 0)}
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label className="field__label">Длит. (мин)</label>
                <div className="input">
                  <input
                    type="number"
                    min={5}
                    value={form.duration || ''}
                    onChange={e => set('duration', Number(e.target.value) || 45)}
                  />
                </div>
              </div>

              <div className="field">
                <label className="field__label">Врач %</label>
                <div className="input">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={form.doctorPct || ''}
                    onChange={e => set('doctorPct', Number(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="modal__foot">
            <button type="button" className="btn btn--ghost" onClick={onClose}>
              {t('cancel')}
            </button>
            <button type="submit" className="btn btn--primary" disabled={pending}>
              {pending ? 'Сохранение...' : t('save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
