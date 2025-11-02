import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../CartContext.jsx'

export default function Menu() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [user, setUser] = useState(null)
    const navigate = useNavigate()
    const { cartItemCount, updateCartCount } = useCart()

    // Verificar si hay usuario logueado
    useEffect(() => {
        const authUser = localStorage.getItem('auth_user')
        if (authUser) {
            setUser(JSON.parse(authUser))
            // Cargar el conteo inicial del carrito cuando el usuario está disponible
            updateCartCount();
        }
    }, [updateCartCount])

    // Cerrar sesión
    const handleLogout = () => {
        localStorage.removeItem('auth_user')
        localStorage.removeItem('auth_token')
        setUser(null)
        setIsMenuOpen(false)
        updateCartCount(); // Resetea el contador a 0
        navigate('/')
    }

    // Verificar si es admin
    const isAdmin = user && (user.email === 'admin@mokip.com' || user.email === 'admin@duocuc.cl')

    // Cerrar menú al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.user-menu-container')) {
                setIsMenuOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <header className="main-header">
            <div className="container nav-container">
                <div className="logo">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/7/72/Gengar_face.png"
                     alt="Logo Tienda Online"
                      className="logo-img" />
                    <span className="site-name">Tienda MoKip</span>
                </div>

                <div className="nav-main" role="navigation" aria-label="Main navigation">
                    <nav className="main-nav nav-center">
                        <Link to="/">Home</Link>
                        <Link to="/productos">Productos</Link>
                        <Link to="/blogs">Blogs</Link>
                        <Link to="/contacto">Contacto</Link>
                    </nav>

                    <div className="nav-actions">
                        <Link to="/carrito" className="cart-link" title="Ver carrito" aria-label="Ver carrito">
                            <span className="cart-icon" aria-hidden="true">🛍️</span>
                            {cartItemCount > 0 && (
                                <span className="cart-count" aria-live="polite">{cartItemCount}</span>
                            )}
                        </Link>

                        <div className="user-menu-container" style={{ position: 'relative' }}>
                            <button 
                                className="user-menu-button"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '8px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = 'var(--gray-100)'}
                                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                                title={user ? `Hola, ${user.name || user.email}` : 'Iniciar sesión'}
                            >
                                <span 
                                    className="user-icon" 
                                    aria-hidden="true"
                                    style={{
                                        fontSize: '1.5rem',
                                        color: 'var(--gray-700)'
                                    }}
                                >
                                    👤
                                </span>
                            </button>

                            {isMenuOpen && (
                                <div 
                                    className="user-dropdown-menu"
                                    style={{
                                        position: 'absolute',
                                        top: '100%',
                                        right: 0,
                                        backgroundColor: 'white',
                                        border: '1px solid var(--gray-200)',
                                        borderRadius: 'var(--border-radius-md)',
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                        padding: '0.5rem 0',
                                        minWidth: '180px',
                                        zIndex: 1000,
                                        marginTop: '0.5rem'
                                    }}
                                >
                                    {!user ? (
                                        // Menú cuando NO hay usuario logueado
                                        <Link 
                                            to="/login" 
                                            className="dropdown-item"
                                            onClick={() => setIsMenuOpen(false)}
                                            style={{
                                                display: 'block',
                                                padding: '0.75rem 1rem',
                                                color: 'var(--gray-700)',
                                                textDecoration: 'none',
                                                transition: 'background-color 0.2s',
                                                border: 'none',
                                                background: 'none',
                                                width: '100%',
                                                textAlign: 'left',
                                                cursor: 'pointer'
                                            }}
                                            onMouseOver={(e) => e.target.style.backgroundColor = 'var(--gray-100)'}
                                            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                                        >
                                            Iniciar Sesión
                                        </Link>
                                    ) : (
                                        // Menú cuando SÍ hay usuario logueado
                                        <>
                                            <div 
                                                style={{
                                                    padding: '0.75rem 1rem',
                                                    borderBottom: '1px solid var(--gray-100)',
                                                    color: 'var(--gray-600)',
                                                    fontSize: '0.875rem'
                                                }}
                                            >
                                                Hola, <strong>{user.name || user.email.split('@')[0]}</strong>
                                            </div>
                                            
                                            {isAdmin && (
                                                <Link 
                                                    to="/admin" 
                                                    className="dropdown-item"
                                                    onClick={() => setIsMenuOpen(false)}
                                                    style={{
                                                        display: 'block',
                                                        padding: '0.75rem 1rem',
                                                        color: 'var(--gray-700)',
                                                        textDecoration: 'none',
                                                        transition: 'background-color 0.2s',
                                                        border: 'none',
                                                        background: 'none',
                                                        width: '100%',
                                                        textAlign: 'left',
                                                        cursor: 'pointer'
                                                    }}
                                                    onMouseOver={(e) => e.target.style.backgroundColor = 'var(--gray-100)'}
                                                    onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                                                >
                                                    🛠️ Admin
                                                </Link>
                                            )}
                                            
                                            <button 
                                                onClick={handleLogout}
                                                className="dropdown-item"
                                                style={{
                                                    display: 'block',
                                                    padding: '0.75rem 1rem',
                                                    color: 'var(--error)',
                                                    textDecoration: 'none',
                                                    transition: 'background-color 0.2s',
                                                    border: 'none',
                                                    background: 'none',
                                                    width: '100%',
                                                    textAlign: 'left',
                                                    cursor: 'pointer'
                                                }}
                                                onMouseOver={(e) => e.target.style.backgroundColor = 'var(--gray-100)'}
                                                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                                            >
                                                🚪 Cerrar Sesión
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}