import React, { useState } from 'react'
import Menu from './Partes/Menu'
import { useNavigate } from 'react-router-dom'
import { login as xanoLogin, signup as xanoSignup } from '../Api/xano'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    if (!email || !password) return
    setLoading(true)
    setMessage('')
    try {
      const res = await xanoLogin({ email, password })
      if (res && res.user) {
        localStorage.setItem('auth_user', JSON.stringify(res.user))
        // Verificar si es admin (por email por ahora, hasta que Xano devuelva el campo role)
        if (res.user.email === 'admin@mokip.com' || res.user.email === 'admin@duocuc.cl') {
          navigate('/')
        } else {
          navigate('/')
        }
      }
      setMessage('¡Bienvenido!')
    } catch (err) {
      setMessage('Error al iniciar sesión')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleSignup() {
    if (!email || !password) return
    setLoading(true)
    setMessage('')
    try {
      const res = await xanoSignup({ name: email.split('@')[0], email, password })
      if (res && res.user) {
        localStorage.setItem('auth_user', JSON.stringify(res.user))
      }
      setMessage('Cuenta creada, ¡bienvenido!')
      navigate('/')
    } catch (err) {
      setMessage('Error al crear cuenta')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Menu />
      <main className="login-main" style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        background: 'linear-gradient(135deg, var(--primary-blue), var(--primary-blue-light))',
        padding: '2rem 0'
      }}>
        <div className="container" style={{ maxWidth: '400px' }}>
          <div className="card fade-in">
            <div className="card-header text-center">
              <h1 style={{ color: 'var(--primary-blue)', marginBottom: '0.5rem' }}>MoKip</h1>
              <h2>Iniciar Sesión</h2>
              <p style={{ color: 'var(--gray-600)', margin: 0 }}>
                Accede a tu cuenta para continuar
              </p>
            </div>

            <div className="card-body">
              <form id="loginForm" autoComplete="off" onSubmit={(e) => { e.preventDefault(); }}>
                <div className="form-group">
                  <label htmlFor="login-email">Correo electrónico</label>
                  <input 
                    type="email" 
                    id="login-email" 
                    name="login-email" 
                    placeholder="usuario@ejemplo.com" 
                    required 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="login-password">Contraseña</label>
                  <input 
                    type="password" 
                    id="login-password" 
                    name="login-password" 
                    placeholder="Tu contraseña" 
                    required 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                  />
                </div>

                <div className="form-group">
                  <button 
                    type="button" 
                    className="btn-primary" 
                    id="btnLogin" 
                    onClick={handleLogin} 
                    disabled={loading}
                    style={{ width: '100%', marginBottom: '1rem' }}
                  >
                    {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                  </button>
                </div>

                <div className="text-center">
                  <button 
                    type="button" 
                    className="btn-link" 
                    id="btnRecuperar"
                    style={{ marginBottom: '1rem' }}
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                <div style={{ 
                  borderTop: '1px solid var(--gray-200)', 
                  paddingTop: '1rem', 
                  textAlign: 'center' 
                }}>
                  <p style={{ marginBottom: '1rem', color: 'var(--gray-600)' }}>
                    ¿No tienes cuenta?
                  </p>
                  <button 
                    type="button" 
                    className="btn-secondary" 
                    id="btnCrearCuenta" 
                    onClick={() => navigate('/registro')} 
                    disabled={loading}
                    style={{ width: '100%' }}
                  >
                    Crear cuenta nueva
                  </button>
                </div>
              </form>

              {message && (
                <div 
                  id="loginExito" 
                  className="message" 
                  style={{ 
                    marginTop: '1rem', 
                    padding: '0.75rem', 
                    borderRadius: 'var(--border-radius-md)',
                    backgroundColor: message.includes('Error') ? '#fef2f2' : '#f0fdf4',
                    color: message.includes('Error') ? 'var(--error)' : 'var(--success)',
                    textAlign: 'center',
                    fontWeight: '500'
                  }}
                >
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}


