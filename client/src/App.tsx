import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LangCtx, type Lang, makeT, createLangState } from './i18n'
import { getStoredUser, type AuthUser } from './lib/auth'
import AppLayout from './layouts/AppLayout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import CalendarPage from './pages/CalendarPage'
import PatientsPage from './pages/PatientsPage'
import PatientCard from './pages/PatientCard'
import VisitsPage from './pages/VisitsPage'
import TreatmentPage from './pages/TreatmentPage'
import FinancePage from './pages/FinancePage'
import CrmPage from './pages/CrmPage'
import InventoryPage from './pages/InventoryPage'
import MarketingPage from './pages/MarketingPage'
import ReportsPage from './pages/ReportsPage'
import ServicesPage from './pages/ServicesPage'
import StaffPage from './pages/StaffPage'
import SettingsPage from './pages/SettingsPage'

export default function App() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [lang, setLangState] = useState<Lang>(() => createLangState('ru'))

  useEffect(() => {
    const stored = getStoredUser()
    if (stored) setUser(stored)
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    localStorage.setItem('lang', l)
  }

  const handleLogin = (u: AuthUser) => setUser(u)
  const handleLogout = () => {
    setUser(null)
  }

  return (
    <LangCtx.Provider value={{ lang, setLang, t: makeT(lang) }}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              user ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={handleLogin} />
            }
          />
          <Route
            path="/"
            element={
              user ? (
                <AppLayout user={user} onLogout={handleLogout}>
                  <Navigate to="/dashboard" replace />
                </AppLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/*"
            element={
              user ? (
                <AppLayout user={user} onLogout={handleLogout}>
                  <Routes>
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="calendar" element={<CalendarPage />} />
                    <Route path="patients" element={<PatientsPage />} />
                    <Route path="patients/:id" element={<PatientCard />} />
                    <Route path="visits" element={<VisitsPage />} />
                    <Route path="treatment" element={<TreatmentPage />} />
                    <Route path="finance" element={<FinancePage />} />
                    <Route path="crm" element={<CrmPage />} />
                    <Route path="inventory" element={<InventoryPage />} />
                    <Route path="marketing" element={<MarketingPage />} />
                    <Route path="reports" element={<ReportsPage />} />
                    <Route path="services" element={<ServicesPage />} />
                    <Route path="staff" element={<StaffPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route path="*" element={<Navigate to="dashboard" replace />} />
                  </Routes>
                </AppLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </LangCtx.Provider>
  )
}
