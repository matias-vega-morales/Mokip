import React, { useState } from 'react'
import Menu from './Partes/Menu'
import { useNavigate } from 'react-router-dom'
import { signup as xanoSignup } from '../Api/xano'

export default function Registro() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [shippingAddress, setShippingAddress] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignup() {
    if (!name || !email || !password) return
    setLoading(true)
    setMessage('')
    try {
      // Xano solo acepta campos básicos en signup: name, email, password
      const res = await xanoSignup({
        name: `${name} ${lastName}`.trim(),
        email,
        password
      })
      if (res && res.user) {
        localStorage.setItem('auth_user', JSON.stringify(res.user))
      }
      setMessage('Cuenta creada con éxito')
      navigate('/')
    } catch (err) {
      setMessage('Error al crear la cuenta')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Menu />
      <main className="registro-main" style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        background: 'linear-gradient(135deg, var(--accent-orange), var(--accent-orange-light))',
        padding: '2rem 0'
      }}>
        <div className="container" style={{ maxWidth: '500px' }}>
          <div className="card fade-in">
            <div className="card-header text-center">
              <h1 style={{ color: 'var(--accent-orange)', marginBottom: '0.5rem' }}>MoKip</h1>
              <h2>Crear Cuenta</h2>
              <p style={{ color: 'var(--gray-600)', margin: 0 }}>
                Únete a nuestra comunidad y disfruta de los mejores productos
              </p>
            </div>

            <div className="card-body">
              <form id="registroForm" autoComplete="off" onSubmit={(e) => { e.preventDefault(); }}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="reg-name">Nombre *</label>
                    <input 
                      id="reg-name" 
                      name="reg-name" 
                      placeholder="Tu nombre" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="reg-lastname">Apellido</label>
                    <input 
                      id="reg-lastname" 
                      name="reg-lastname" 
                      placeholder="Tu apellido" 
                      value={lastName} 
                      onChange={(e) => setLastName(e.target.value)} 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="reg-email">Correo electrónico *</label>
                  <input 
                    type="email" 
                    id="reg-email" 
                    name="reg-email" 
                    placeholder="usuario@ejemplo.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="reg-password">Contraseña *</label>
                  <input 
                    type="password" 
                    id="reg-password" 
                    name="reg-password" 
                    placeholder="Mínimo 8 caracteres y almenos una mayuscula " 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    minLength="8"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="reg-phone">Teléfono</label>
                    <input 
                      id="reg-phone" 
                      name="reg-phone" 
                      placeholder="+56 9 1234 5678" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="reg-address">Dirección de envío</label>
                    <input 
                      id="reg-address" 
                      name="reg-address" 
                      placeholder="Dirección completa" 
                      value={shippingAddress} 
                      onChange={(e) => setShippingAddress(e.target.value)} 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <button 
                    type="button" 
                    id="btnRegistrar" 
                    onClick={handleSignup} 
                    disabled={loading}
                    className="btn-primary"
                    style={{ width: '100%', marginBottom: '1rem' }}
                  >
                    {loading ? 'Creando cuenta...' : 'Crear mi cuenta'}
                  </button>
                </div>

                <div style={{ 
                  borderTop: '1px solid var(--gray-200)', 
                  paddingTop: '1rem', 
                  textAlign: 'center' 
                }}>
                  <p style={{ marginBottom: '1rem', color: 'var(--gray-600)' }}>
                    ¿Ya tienes cuenta?
                  </p>
                  <button 
                    type="button" 
                    className="btn-secondary" 
                    onClick={() => navigate('/login')}
                    style={{ width: '100%' }}
                  >
                    Iniciar sesión
                  </button>
                </div>
              </form>

              {message && (
                <div 
                  id="registroMensaje" 
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


