import React from 'react'
import { Link } from 'react-router-dom'

export default function Menu() {
    return (
        <header className="main-header">
            <div className="container nav-container">
                <div className="logo">
                    <img src="/img/logo.png" alt="Logo Tienda Online" className="logo-img" />
                    <span className="site-name">Tienda Online</span>
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
                            <span className="cart-count" aria-live="polite">0</span>
                        </Link>

                        <Link to="/login" className="login-link" title="Iniciar sesión">
                            <span className="login-icon" aria-hidden="true">👤</span>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    )
}