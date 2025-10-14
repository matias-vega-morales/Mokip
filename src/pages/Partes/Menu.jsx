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

                                <nav className="main-nav">
                                    <Link to="/">Home</Link>
                                    <Link to="/productos">Productos</Link>
                                    <Link to="/blogs">Blogs</Link>
                                    <Link to="/contacto">Contacto</Link>
                                </nav>

                <div className="cart">
                    <a href="/carrito.html" className="cart-link">
                        <span className="cart-icon">🛍️</span>
                        <span className="cart-count">0</span>
                    </a>

                    <a href="/login.html" className="login-link" title="Iniciar sesión">
                        <span className="login-icon">👤</span>
                    </a>
                </div>
            </div>
        </header>
    )
}