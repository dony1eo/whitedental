import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogIn, Eye, EyeOff } from 'lucide-react'
import { type AuthUser, login } from '../lib/auth'
import { useLang } from '../i18n'

interface Props {
  onLogin: (user: AuthUser) => void
}

export default function LoginPage({ onLogin }: Props) {
  const { t } = useLang()
  const navigate = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [showPw, setShowPw]     = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(email, password)
      onLogin(user)
      navigate('/dashboard', { replace: true })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ошибка авторизации'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-logo">
          <img src="/logo-mark.png" alt="White Dental" />
        </div>

        <h2 className="login-title">{t('login')}</h2>
        <p className="login-sub">Войдите в свою учётную запись</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">{t('email')}</label>
            <div className="form-input-wrap">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@whitedental.uz"
                required
                autoFocus
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t('password')}</label>
            <div className="form-input-wrap form-input-wrap--pw">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="pw-toggle"
                onClick={() => setShowPw(s => !s)}
                tabIndex={-1}
              >
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="alert alert--danger">{error}</div>
          )}

          <button
            type="submit"
            className="btn btn--primary btn--full btn--login"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner" />
            ) : (
              <LogIn size={18} />
            )}
            {loading ? 'Вход...' : t('login')}
          </button>
        </form>

        <p className="login-hint">
          Демо: <code>admin@whitedental.uz</code> / <code>admin123</code>
        </p>
      </div>

      <footer className="login-footer">
        &copy; {new Date().getFullYear()} White Dental Clinic
      </footer>
    </div>
  )
}
