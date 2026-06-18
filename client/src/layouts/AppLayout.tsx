import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, CalendarDays, Users, ClipboardList, Stethoscope, Wallet,
  Kanban, Package, Megaphone, BarChart3, ListChecks, UserCog, Settings,
  Bell, Menu, X, ChevronDown, LogOut, Plus, ListOrdered,
} from 'lucide-react'
import { useLang, LANGS } from '../i18n'
import { type AuthUser, logout } from '../lib/auth'
import api from '../lib/api'
import NewVisitModal from '../components/modals/NewVisitModal'
import AddPatientModal from '../components/modals/AddPatientModal'
import WaitlistModal from '../components/modals/WaitlistModal'
import TasksModal from '../components/modals/TasksModal'

interface Props {
  user: AuthUser | null
  onLogout: () => void
  children?: React.ReactNode
}

const NAV = [
  { Icon: LayoutDashboard, key: 'dashboard', path: '/dashboard' },
  { Icon: CalendarDays,    key: 'calendar',  path: '/calendar' },
  { Icon: Users,           key: 'patients',  path: '/patients' },
  { Icon: ClipboardList,   key: 'visits',    path: '/visits' },
  { Icon: Stethoscope,     key: 'treatment', path: '/treatment' },
  { Icon: Wallet,          key: 'finance',   path: '/finance' },
  { Icon: Kanban,          key: 'crm',       path: '/crm' },
  { Icon: Package,         key: 'inventory', path: '/inventory' },
  { Icon: Megaphone,       key: 'marketing', path: '/marketing' },
  { Icon: BarChart3,       key: 'reports',   path: '/reports' },
  { Icon: ListChecks,      key: 'services',  path: '/services' },
  { Icon: UserCog,         key: 'staff',     path: '/staff' },
  { Icon: Settings,        key: 'settings',  path: '/settings' },
] as const

export default function AppLayout({ user, onLogout, children }: Props) {
  const { t, lang, setLang } = useLang()
  const [open, setOpen] = useState(true)
  const [notifOpen, setNotifOpen] = useState(false)
  const [userMenu, setUserMenu] = useState(false)
  const [modals, setModals] = useState({ newVisit: false, addPatient: false, waitlist: false, tasks: false })
  const [notifications, setNotifications] = useState<{ text: string; icon: string }[]>([])

  useEffect(() => {
    async function loadNotifs() {
      try {
        const [appts, tasks, mats] = await Promise.all([
          api.get('/appointments', { params: { date: new Date().toISOString().split('T')[0] } }).then(r => r.data).catch(() => []),
          api.get('/crm/tasks').then(r => r.data).catch(() => []),
          api.get('/inventory/materials').then(r => r.data).catch(() => ({ items: [] })),
        ])
        const items: { text: string; icon: string }[] = []
        const todayAppts = Array.isArray(appts) ? appts : (appts?.items ?? [])
        const pendingTasks = Array.isArray(tasks) ? tasks.filter((t: any) => !t.done) : (tasks?.items?.filter((t: any) => !t.done) ?? [])
        const matsList = mats?.items ?? mats ?? []

        if (todayAppts.length > 0) {
          items.push({ text: `Записей на сегодня: ${todayAppts.length}`, icon: '📅' })
        }
        const lowStock = Array.isArray(matsList) ? matsList.filter((m: any) => (m.stock ?? 0) < (m.minStock ?? 0)) : []
        if (lowStock.length > 0) {
          items.push({ text: `Низкий остаток: ${lowStock.length} позиций`, icon: '⚠️' })
        }
        if (pendingTasks.length > 0) {
          items.push({ text: `Задач: ${pendingTasks.length}`, icon: '📋' })
        }
        if (items.length === 0) {
          items.push({ text: 'Новых уведомлений нет', icon: 'ℹ️' })
        }
        setNotifications(items)
      } catch {
        setNotifications([{ text: 'Новых уведомлений нет', icon: 'ℹ️' }])
      }
    }
    loadNotifs()
    const id = setInterval(loadNotifs, 60_000)
    return () => clearInterval(id)
  }, [])

  const openModal = (k: keyof typeof modals) => setModals(m => ({ ...m, [k]: true }))
  const closeModal = (k: keyof typeof modals) => setModals(m => ({ ...m, [k]: false }))

  const handleLogout = () => { logout(); onLogout() }

  const initial = user?.name?.[0]?.toUpperCase() ?? 'U'

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className={`sidebar ${open ? 'sidebar--open' : ''}`}>
        <div className="sidebar__logo">
          <img src="/logo-mark.png" alt="White Dental" style={{ width: 34, height: 'auto' }} />
          {open && <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink-900)', whiteSpace: 'nowrap', marginLeft: 10 }}>White Dental</span>}
        </div>

        <button className="sidebar__toggle iconbtn" onClick={() => setOpen(o => !o)} style={{ alignSelf: open ? 'flex-start' : 'center', marginLeft: open ? 6 : 0 }}>
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>

        <div className="sidebar__items">
          {NAV.map(({ Icon, key, path }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => `sidebar__item${isActive ? ' is-active' : ''}`}
              title={!open ? t(key) : undefined}
            >
              <Icon size={20} />
              {open && <span className="sidebar__label">{t(key)}</span>}
            </NavLink>
          ))}
        </div>
      </aside>

      {/* Main */}
      <div className="main">
        {/* TopBar */}
        <header className="topbar">
          <div className="topbar__search">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ color: 'var(--ink-500)' }}>
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <span>{t('search')}</span>
          </div>

          <div className="topbar__actions">
            <button className="tb-act" onClick={() => openModal('newVisit')}>
              <Plus size={16} /> {t('newVisit')}
            </button>
            <span className="tb-sep" />
            <button className="tb-act" onClick={() => openModal('addPatient')}>
              <Plus size={16} /> {t('addPatient')}
            </button>
            <span className="tb-sep" />
            <button className="tb-act" onClick={() => openModal('waitlist')}>
              <ListOrdered size={16} /> {t('waitlist')}
            </button>
            <span className="tb-sep" />
            <button className="tb-act" onClick={() => openModal('tasks')}>
              <ListChecks size={16} /> {t('tasks')}
            </button>
            <span className="tb-sep" />

            {/* Lang switch */}
            <div className="langswitch">
              {LANGS.map(l => (
                <button key={l} className={`langswitch__btn${lang === l ? ' is-active' : ''}`} onClick={() => setLang(l)}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Notifications */}
            <div className="notif-wrap">
              <button className={`iconbtn${notifOpen ? ' is-active' : ''}`} onClick={() => setNotifOpen(o => !o)}>
                <Bell size={18} />
                <span className="iconbtn__dot" />
              </button>
              {notifOpen && (
                <>
                  <div className="notif-scrim" onClick={() => setNotifOpen(false)} />
                  <div className="notif">
                    <div className="notif__head">
                      <b>{t('notifications')}</b>
                      <button className="notif__mark" onClick={() => setNotifOpen(false)}>{t('markAllRead')}</button>
                    </div>
                    <div className="notif__list">
                      {notifications.map((n, i) => (
                        <div key={i} className="notif__row">
                          <div className="notif__ic">{n.icon}</div>
                          <div className="notif__body"><div className="notif__txt">{n.text}</div></div>
                          <div className="notif__dot" />
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* User */}
            <div style={{ position: 'relative' }}>
              <button className="tb-user" onClick={() => setUserMenu(o => !o)}>
                <div className="avatar" style={{ width: 32, height: 32, borderColor: user?.color || '#0787c9', fontSize: 13, color: user?.color || '#0787c9' }}>
                  {initial}
                </div>
                <span style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</span>
                <ChevronDown size={14} />
              </button>
              {userMenu && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setUserMenu(false)} />
                  <div style={{ position: 'absolute', top: 40, right: 0, background: '#fff', border: '1px solid var(--line-300)', borderRadius: 10, boxShadow: 'var(--shadow-pop)', zIndex: 41, minWidth: 160 }}>
                    <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', width: '100%', font: '700 14px var(--font-sans)', color: 'var(--danger-500)', background: 'none', border: 'none', cursor: 'pointer' }}>
                      <LogOut size={15} /> {t('logout')}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <div className="content">
          {children}
        </div>
      </div>

      {modals.newVisit   && <NewVisitModal   open onClose={() => closeModal('newVisit')} />}
      {modals.addPatient && <AddPatientModal open onClose={() => closeModal('addPatient')} />}
      {modals.waitlist   && <WaitlistModal   open onClose={() => closeModal('waitlist')} />}
      {modals.tasks      && <TasksModal      open onClose={() => closeModal('tasks')} />}
    </div>
  )
}
