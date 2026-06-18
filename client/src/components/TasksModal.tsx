import { X, CheckCircle2, Circle } from 'lucide-react'
import { useTasks, useToggleTask } from '../lib/queries'
import { useLang } from '../i18n'

interface Props {
  onClose: () => void
}

interface Task {
  id: number
  title: string
  done: boolean
  dueDate?: string
  assignee?: string
  priority?: 'high' | 'normal' | 'low'
}

const PRIORITY_COLOR: Record<string, string> = {
  high:   '#e53935',
  normal: '#0787c9',
  low:    '#6c757d',
}

export default function TasksModal({ onClose }: Props) {
  const { t } = useLang()
  const { data, isLoading } = useTasks()
  const { mutate: toggleTask } = useToggleTask()

  const tasks: Task[] = data?.items ?? data ?? []

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal--wide" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h3 className="modal__title">{t('tasks')}</h3>
          <button className="btn btn--ghost btn--icon" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="modal__body">
          {isLoading ? (
            <div className="loading-center">Загрузка...</div>
          ) : tasks.length === 0 ? (
            <div className="empty-state"><p>Задач нет</p></div>
          ) : (
            <ul className="task-list">
              {tasks.map(task => (
                <li
                  key={task.id}
                  className={`task-list__item ${task.done ? 'task-list__item--done' : ''}`}
                >
                  <button
                    className="task-list__check"
                    onClick={() => toggleTask(task.id)}
                    style={{ color: task.done ? '#1f8a4d' : '#adb5bd' }}
                  >
                    {task.done
                      ? <CheckCircle2 size={20} />
                      : <Circle size={20} />
                    }
                  </button>

                  <div className="task-list__body">
                    <span className="task-list__title">{task.title}</span>
                    <div className="task-list__meta">
                      {task.dueDate && (
                        <span className="task-list__due">{task.dueDate}</span>
                      )}
                      {task.assignee && (
                        <span className="task-list__assignee">{task.assignee}</span>
                      )}
                    </div>
                  </div>

                  {task.priority && (
                    <div
                      className="task-list__priority"
                      style={{ background: PRIORITY_COLOR[task.priority] + '22', color: PRIORITY_COLOR[task.priority] }}
                    >
                      {task.priority === 'high' ? '!' : task.priority === 'low' ? '↓' : '·'}
                    </div>
                  )}
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
