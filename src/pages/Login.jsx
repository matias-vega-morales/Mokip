import React, { useState } from 'react'
import Menu from './Partes/Menu'
import { useNavigate } from 'react-router-dom'
import { login as xanoLogin, signup as xanoSignup, getCurrentUser, fetchUsers } from '../Api/xano'
import { Footer } from './Partes/Footer'

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

      console.log('🔍 Respuesta COMPLETA del login:', res)
      console.log('🔑 Token recibido:', res.token ? 'SÍ' : 'NO')
      
      if (res && res.token) {
        // El login fue exitoso, ahora necesitamos obtener los datos completos del usuario
        // para verificar su estado (el endpoint de login solo devuelve el token)
        try {
          // Obtener todos los usuarios y buscar el que coincide por email
          const usuarios = await fetchUsers()
          const usuarioCompleto = usuarios.find(u => 
            u.email && u.email.toLowerCase() === email.toLowerCase()
          )
          
          console.log('👤 Usuario completo encontrado:', usuarioCompleto)
          console.log('📊 Estado del usuario:', usuarioCompleto?.status)
          
          if (usuarioCompleto) {
            // Verificar si el usuario está bloqueado (comparación más flexible)
            const statusUsuario = String(usuarioCompleto.status || '').toLowerCase().trim()
            const estaBloqueado = statusUsuario === 'blocked' || statusUsuario === 'banneado' || statusUsuario === 'bloqueado'
            
            console.log('🚫 Usuario bloqueado?:', estaBloqueado)
            
            if (estaBloqueado) {
              console.log('❌ Usuario bloqueado detectado, bloqueando acceso...')
              setMessage('⚠️ Tu cuenta ha sido bloqueada. Por favor, contacta al administrador.')
              setLoading(false)
              // Limpiar el token y usuario
              localStorage.removeItem('auth_token')
              localStorage.removeItem('auth_user')
              return
            }
            
            // Si el usuario no está bloqueado, proceder con el login
            console.log('✅ Usuario no bloqueado, permitiendo acceso...')
            // Guardar los datos completos del usuario
            localStorage.setItem('auth_user', JSON.stringify(usuarioCompleto))
            // Verificar si es admin (por email por ahora, hasta que Xano devuelva el campo role)
            if (usuarioCompleto.email === 'admin@mokip.com' || usuarioCompleto.email === 'admin@duocuc.cl') {
              navigate('/')
            } else {
              navigate('/')
            }
            setMessage('¡Bienvenido!')
          } else {
            console.warn('⚠️ No se encontró el usuario en la base de datos')
            // Si no encontramos el usuario, usar los datos mínimos del login
            const usuarioMinimo = res.user || { email: email }
            localStorage.setItem('auth_user', JSON.stringify(usuarioMinimo))
            navigate('/')
            setMessage('¡Bienvenido!')
          }
        } catch (fetchErr) {
          console.error('Error obteniendo datos completos del usuario:', fetchErr)
          // Si falla obtener los datos completos, proceder con los datos mínimos del login
          const usuarioMinimo = res.user || { email: email }
          localStorage.setItem('auth_user', JSON.stringify(usuarioMinimo))
          navigate('/')
          setMessage('¡Bienvenido!')
        }
      } else {
        setMessage('Error: No se recibió token de autenticación')
      }
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
                    backgroundColor: message.includes('Error') || message.includes('bloqueada') ? '#fef2f2' : '#f0fdf4',
                    color: message.includes('Error') || message.includes('bloqueada') ? 'var(--error)' : 'var(--success)',
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
      <Footer />
    </>
  )
}


