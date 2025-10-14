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
      const res = await xanoSignup({
        name,
        last_name: lastName,
        email,
        password,
        phone,
        shipping_address: shippingAddress
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
      <main className="registro-main">
        <div className="registro-container">
          <form id="registroForm" autoComplete="off" onSubmit={(e) => { e.preventDefault(); }}>
            <h2>Crear cuenta</h2>
            <label htmlFor="reg-name">Nombre</label>
            <input id="reg-name" name="reg-name" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} required />

            <label htmlFor="reg-lastname">Apellido</label>
            <input id="reg-lastname" name="reg-lastname" placeholder="Apellido" value={lastName} onChange={(e) => setLastName(e.target.value)} />

            <label htmlFor="reg-email">Correo</label>
            <input type="email" id="reg-email" name="reg-email" placeholder="usuario@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} required />

            <label htmlFor="reg-password">Contraseña</label>
            <input type="password" id="reg-password" name="reg-password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />

            <label htmlFor="reg-phone">Teléfono</label>
            <input id="reg-phone" name="reg-phone" placeholder="Teléfono" value={phone} onChange={(e) => setPhone(e.target.value)} />

            <label htmlFor="reg-address">Dirección de envío</label>
            <input id="reg-address" name="reg-address" placeholder="Dirección de envío" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} />

            <button type="button" id="btnRegistrar" onClick={handleSignup} disabled={loading}>Registrarme</button>
          </form>

          <div id="registroMensaje">{message}</div>
        </div>
      </main>
    </>
  )
}


