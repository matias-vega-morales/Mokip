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
        // Redirect admin users to admin panel
        if (res.user.role === 'admin') {
          navigate('/admin')
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
      <main className="login-main">
        <div className="login-hero">
          <img src="/assets/hero.jpg" alt="Imagen principal de la tienda" />
          <h1 className="login-title">Tienda Online</h1>
        </div>

        <div className="login-container">
          <form id="loginForm" autoComplete="off" onSubmit={(e) => { e.preventDefault(); }}>
            <h2>Inicio de sesión</h2>
            <label htmlFor="login-email">Correo</label>
            <input type="email" id="login-email" name="login-email" placeholder="usuario@ejemplo.com" required value={email} onChange={(e) => setEmail(e.target.value)} />

            <label htmlFor="login-password">Contraseña</label>
            <input type="password" id="login-password" name="login-password" placeholder="Contraseña" required value={password} onChange={(e) => setPassword(e.target.value)} />

            <button type="button" className="btn-primary" id="btnLogin" onClick={handleLogin} disabled={loading}>Iniciar sesión</button>
            <button type="button" className="btn-secondary btn-crear-cuenta" id="btnCrearCuenta" onClick={() => navigate('/registro')} disabled={loading}>Crear cuenta</button>
            <button type="button" className="btn-link btn-recuperar" id="btnRecuperar">Recuperar contraseña</button>
          </form>

          <div id="loginExito" className="login-exito">{message}</div>
        </div>
      </main>
    </>
  )
}


