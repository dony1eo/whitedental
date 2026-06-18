import { X, Check } from 'lucide-react';
import { useTasks, useToggleTask } from '../../lib/queries';
import { useLang } from '../../i18n';

interface Props {
  open: boolean;
  onClose: () => void;
}

const PRIORITY_BADGE: Record<string, string> = {
  high: 'badge--danger',
  medium: 'badge--warn',
  low: 'badge--neutral',
  urgent: 'badge--danger',
};

const PRIORITY_LABEL: Record<string, string> = {
  high: 'Высокий',
  medium: 'Средний',
  low: 'Низкий',
  urgent: 'Срочно',
};

function isToday(dateStr: string): boolean {
  const d = new Date(dateStr);
  const t = new Date();
  return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate();
}

function isTomorrow(dateStr: string): boolean {
  const d = new Date(dateStr);
  const t = new Date();
  t.setDate(t.getDate() + 1);
  return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate();
}

function isThisWeek(dateStr: string): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = d.getTime() - now.getTime();
  return diff > 0 && diff <= 7 * 86400000;
}

interface TaskItemProps {
  task: any;
  onToggle: () => void;
  toggling: boolean;
}

function TaskItem({ task, onToggle, toggling }: TaskItemProps) {
  return (
    <div className={`task-item ${task.done ? 'task-item--done' : ''}`}>
      <button
        type="button"
        className={`taskchk ${task.done ? 'on' : ''}`}
        onClick={onToggle}
        disabled={toggling}
        title={task.done ? 'Отметить невыполненным' : 'Отметить выполненным'}
      >
        {task.done && <Check size={13} />}
      </button>
      <div className="task-item__body">
        <div className="task-item__title">{task.title}</div>
        <div className="task-item__meta">
          {task.priority && (
            <span className={`badge ${PRIORITY_BADGE[task.priority] ?? 'badge--neutral'}`} style={{ fontSize: 11, padding: '2px 8px' }}>
              {PRIORITY_LABEL[task.priority] ?? task.priority}
            </span>
          )}
          {task.assigneeName && (
            <span style={{ font: '400 12px var(--font-sans)', color: 'var(--ink-500)' }}>
              {task.assigneeName}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TasksModal({ open, onClose }: Props) {
  const { t } = useLang();
  const { data, isLoading } = useTasks();
  const toggle = useToggleTask();

  const allTasks: any[] = data?.items ?? data ?? [];

  const todayTasks = allTasks.filter((t: any) => t.dueDate && isToday(t.dueDate));
  const tomorrowTasks = allTasks.filter((t: any) => t.dueDate && isTomorrow(t.dueDate));
  const weekTasks = allTasks.filter(
    (t: any) => t.dueDate && !isToday(t.dueDate) && !isTomorrow(t.dueDate) && isThisWeek(t.dueDate)
  );
  const otherTasks = allTasks.filter(
    (t: any) => !t.dueDate || (!isToday(t.dueDate) && !isTomorrow(t.dueDate) && !isThisWeek(t.dueDate))
  );

  function handleToggle(id: number) {
    toggle.mutate(id);
  }

  if (!open) return null;

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 520 }}>
        <div className="modal__head">
          <h1>{t('tasks')}</h1>
          <button className="modal__close" onClick={onClose} type="button">
            <X size={22} />
          </button>
        </div>

        <div className="modal__body" style={{ marginTop: 24 }}>
          {isLoading ? (
            <p style={{ color: 'var(--ink-400)', textAlign: 'center', padding: 24 }}>Загрузка...</p>
          ) : allTasks.length === 0 ? (
            <p style={{ color: 'var(--ink-400)', textAlign: 'center', padding: 24 }}>Задач нет</p>
          ) : (
            <>
              {todayTasks.length > 0 && (
                <div>
                  <div className="tasksec">{t('today')}</div>
                  {todayTasks.map((task: any) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={() => handleToggle(task.id)}
                      toggling={toggle.isPending}
                    />
                  ))}
                </div>
              )}

              {tomorrowTasks.length > 0 && (
                <div style={{ marginTop: todayTasks.length > 0 ? 20 : 0 }}>
                  <div className="tasksec">{t('tomorrow')}</div>
                  {tomorrowTasks.map((task: any) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={() => handleToggle(task.id)}
                      toggling={toggle.isPending}
                    />
                  ))}
                </div>
              )}

              {weekTasks.length > 0 && (
                <div style={{ marginTop: (todayTasks.length > 0 || tomorrowTasks.length > 0) ? 20 : 0 }}>
                  <div className="tasksec">На неделе</div>
                  {weekTasks.map((task: any) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={() => handleToggle(task.id)}
                      toggling={toggle.isPending}
                    />
                  ))}
                </div>
              )}

              {otherTasks.length > 0 && (
                <div style={{ marginTop: 20 }}>
                  <div className="tasksec">Остальные</div>
                  {otherTasks.map((task: any) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={() => handleToggle(task.id)}
                      toggling={toggle.isPending}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div className="modal__foot">
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
}
