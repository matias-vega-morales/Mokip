import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

export default function AdminMenu() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  // Detectar cambios en el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      // En desktop, la sidebar siempre está abierta
      if (!mobile) {
        setIsSidebarOpen(true)
      }
    }

    window.addEventListener('resize', handleResize)
    // Inicializar estado según el tamaño actual
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    navigate('/login')
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // Cerrar sidebar al hacer clic en un enlace (solo en móvil)
  const handleNavClick = () => {
    if (isMobile) {
      setIsSidebarOpen(false)
    }
  }

  // Verificar si la ruta actual coincide con el enlace
  const isActiveLink = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  return (
    <>
      {/* Overlay para móvil */}
      {isMobile && isSidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={toggleSidebar}
        ></div>
      )}
      
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`} id="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <span className="sidebar-logo">🛒</span>
            <span className="sidebar-title">Admin Panel</span>
          </div>
          <button 
            className="sidebar-toggle" 
            onClick={toggleSidebar}
            aria-label="Abrir/Cerrar menú"
          >
            <span className="hamburger"></span>
            <span className="hamburger"></span>
            <span className="hamburger"></span>
          </button>
        </div>
        
        
        
        <nav className="sidebar-nav">
          <Link 
            to="/admin" 
            className={isActiveLink('/admin') && location.pathname === '/admin' ? 'active' : ''}
            onClick={handleNavClick}
          >
            <span className="icon">📊</span> 
            <span className="nav-text">Dashboard</span>
          </Link>
          <Link 
            to="/admin/productos" 
            className={isActiveLink('/admin/productos') ? 'active' : ''}
            onClick={handleNavClick}
          >
            <span className="icon">📦</span> 
            <span className="nav-text">Productos</span>
          </Link>
          <Link 
            to="/admin/usuarios" 
            className={isActiveLink('/admin/usuarios') ? 'active' : ''}
            onClick={handleNavClick}
          >
            <span className="icon">👥</span> 
            <span className="nav-text">Usuarios</span>
          </Link>
         
          <Link 
            to="/admin/ventas" 
            className={isActiveLink('/admin/ventas') ? 'active' : ''}
            onClick={handleNavClick}
          >
            <span className="icon">💰</span> 
            <span className="nav-text">Ventas</span>
          </Link>
          
          <div className="nav-divider"></div>
          
          <Link 
            to="/" 
            className="nav-home"
            onClick={handleNavClick}
          >
            <span className="icon">🏠</span> 
            <span className="nav-text">Volver a la Tienda</span>
          </Link>
          
          <button 
            className="logout" 
            onClick={handleLogout}
          >
            <span className="icon">🚪</span> 
            <span className="nav-text">Cerrar sesión</span>
          </button>
        </nav>
      </aside>
    </>
  )
}