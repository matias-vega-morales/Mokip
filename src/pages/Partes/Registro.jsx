import React, { useState } from 'react'
import Menu from './Menu'
import AdminMenu from './AdminMenu'
import { useNavigate, useLocation } from 'react-router-dom'
import { signup as xanoSignup, createUser, updateUser } from '../../Api/xano'
import { Footer } from './Footer'

export default function Registro() {
  const navigate = useNavigate()
  const location = useLocation()
  const isAdminView = location.pathname.startsWith('/admin')

  const [name, setName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('customer') // Nuevo estado para el rol
  const [phone, setPhone] = useState('')
  const [shippingAddress, setShippingAddress] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  // Función para validar la contraseña
  const isPasswordValid = (pass) => {
    const hasUpperCase = /[A-Z]/.test(pass);
    const hasNumber = /\d/.test(pass);
    const isLongEnough = pass.length >= 8;
    return hasUpperCase && hasNumber && isLongEnough;
  };

  async function handleSignup() {
    if (!name || !email || !password) {
      setMessage('Por favor, completa todos los campos obligatorios (*).');
      return;
    }

    if (!isPasswordValid(password)) {
      setMessage('La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.');
      return;
    }

    setLoading(true)
    setMessage('')
    try {
      if (isAdminView) {
        // Lógica para el admin: usa createUser para enviar todos los datos en una sola petición POST.
        await createUser({
          name: name,
          email,
          password,
          last_name: lastName,
          role,
          status: 'active', // Los usuarios nuevos se crean como activos.
          phone,
          shipping_address: shippingAddress
        });
      } else {
        // Lógica para el usuario normal: usa signup
        const res = await xanoSignup({
          name: name,
          last_name: lastName,
          email,
          password,
          status: 'active'
        })
        // Si NO es un admin, inicia sesión con la nueva cuenta
        if (res && res.user) {
          localStorage.setItem('auth_user', JSON.stringify(res.user))
        }
      }

      setMessage(isAdminView ? 'Usuario creado exitosamente' : 'Cuenta creada con éxito')
      
      // Redirigir según el contexto
      setTimeout(() => {
        navigate(isAdminView ? '/admin/usuarios' : '/')
      }, 1500);
    } catch (err) {
      let errorMessage = isAdminView ? 'Error al crear el usuario' : 'Error al crear la cuenta';
      if (err.message && err.message.toLowerCase().includes('already in use')) {
        errorMessage = 'Error: El correo electrónico ya está registrado.';
      } else if (err.message && err.message.toLowerCase().includes('weak password')) {
        errorMessage = 'La contraseña es demasiado débil. Debe tener mayúsculas, minúsculas y números.';
      }
      setMessage(errorMessage);
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {isAdminView ? <AdminMenu /> : <Menu />}
      <div className={isAdminView ? "main-content" : ""} style={isAdminView ? { marginLeft: '280px' } : {}}>
        {isAdminView && (
          <div className="admin-header">
            <div>
              <h1>Crear Nuevo Usuario</h1>
              <p style={{ color: 'var(--gray-600)' }}>Añade un nuevo usuario a la plataforma.</p>
            </div>
          </div>
        )}
        <main 
          className={isAdminView ? "admin-content" : "registro-main"} 
          style={!isAdminView ? { 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            background: 'linear-gradient(135deg, var(--accent-orange), var(--accent-orange-light))',
            padding: '2rem 0',
            paddingTop: '100px'
          } : {}}
        >
          <div className="container" style={{ maxWidth: '600px', margin: isAdminView ? '0' : 'auto' }}>
          <div className="card fade-in">
            <div className="card-header text-center">
              {!isAdminView && <h1 style={{ color: 'var(--accent-orange)', marginBottom: '0.5rem' }}>MoKip</h1>}
              <h2>{isAdminView ? 'Datos del Nuevo Usuario' : 'Crear Cuenta'}</h2>
              {!isAdminView && <p style={{ color: 'var(--gray-600)', margin: 0 }}>Únete a nuestra comunidad</p>}
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
                    placeholder="Mínimo 8 caracteres, 1 mayúscula y 1 número" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    minLength="8"
                  />
                </div>

                {/* Campo de Rol solo para Admins */}
                {isAdminView && (
                  <div className="form-group">
                    <label htmlFor="reg-role">Rol del Usuario *</label>
                    <select
                      id="reg-role"
                      name="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="customer">Cliente</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>
                )}

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
                    {loading ? (isAdminView ? 'Creando usuario...' : 'Creando cuenta...') : (isAdminView ? 'Crear Usuario' : 'Crear mi cuenta')}
                  </button>
                </div>

                {!isAdminView && (
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
                )}

                {isAdminView && (
                   <div className="form-actions" style={{ justifyContent: 'flex-end', marginTop: '1rem' }}>
                     <button
                       type="button"
                       className="btn-secondary"
                       onClick={() => navigate('/admin/usuarios')}
                       disabled={loading}
                     >
                       Cancelar
                     </button>
                   </div>
                )}
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
      </div>
      {!isAdminView && <Footer />}
    </>
  )
}