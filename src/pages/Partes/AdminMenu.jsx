import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function AdminMenu() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    navigate('/login')
  }

  return (
    <aside className="sidebar" id="sidebar">
      <div className="sidebar-header">
        <Link to="/">Home</Link>
        <span className="sidebar-logo">🛒</span>
        <span className="sidebar-title">Company</span>
        <button className="sidebar-toggle" id="sidebarToggle" aria-label="Abrir/Cerrar menú">
          <span className="hamburger"></span>
          <span className="hamburger"></span>
          <span className="hamburger"></span>
        </button>
      </div>
      <nav className="sidebar-nav">
        <Link to="/admin" className="active">
          <span className="icon">📊</span> Dashboard
        </Link>
        <Link to="/admin/productos">
          <span className="icon">📦</span> Productos
        </Link>
        <Link to="/admin/usuarios">
          <span className="icon">👥</span> Usuarios
        </Link>
        <Link to="#">
          <span className="icon">⚙️</span> Configuración
        </Link>
        <button className="logout" id="btnLogout" onClick={handleLogout}>
          <span className="icon">🚪</span> Cerrar sesión
        </button>
      </nav>
    </aside>
  )
}
