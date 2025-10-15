import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export const Footer = () => {
    const [email, setEmail] = useState('')
    const [subscribed, setSubscribed] = useState(false)

    const handleSubscribe = (e) => {
        e.preventDefault()
        if (email) {
            console.log('Email suscrito:', email)
            setSubscribed(true)
            setEmail('')
           
            setTimeout(() => setSubscribed(false), 3000)
        }
    }

    return (
        <>
            <footer className="main-footer">
                <div className="container">
                    {/* Sección principal del footer */}
                    <div className="footer-main">
                        {/* Columna 1: Logo y descripción */}
                        <div className="footer-column">
                            <div className="footer-brand">
                                <img 
                                    src="https://upload.wikimedia.org/wikipedia/commons/7/72/Gengar_face.png" 
                                    alt="MoKip - Tienda Online" 
                                    className="footer-logo"
                                />
                                <p className="footer-description">
                                    Tu tienda online de confianza. Ofrecemos productos de calidad 
                                    con la mejor experiencia de compra.
                                </p>
                            </div>
                            <div className="social-links">
                                <a href="#" className="social-link" aria-label="Facebook">
                                    <i className="bi bi-facebook"></i>
                                </a>
                                <a href="#" className="social-link" aria-label="Instagram">
                                    <i className="bi bi-instagram"></i>
                                </a>
                                <a href="#" className="social-link" aria-label="Twitter">
                                    <i className="bi bi-twitter"></i>
                                </a>
                                <a href="#" className="social-link" aria-label="LinkedIn">
                                    <i className="bi bi-linkedin"></i>
                                </a>
                            </div>
                        </div>

                        {/* Columna 2: Enlaces rápidos */}
                        <div className="footer-column">
                            <h4 className="footer-title">Enlaces Rápidos</h4>
                            <ul className="footer-links">
                                <li><Link to="/" className="footer-link">Inicio</Link></li>
                                <li><Link to="/productos" className="footer-link">Productos</Link></li>
                                <li><Link to="/categorias" className="footer-link">Categorías</Link></li>
                                <li><Link to="/ofertas" className="footer-link">Ofertas</Link></li>
                                <li><Link to="/nuevos" className="footer-link">Nuevos Productos</Link></li>
                            </ul>
                        </div>

                        {/* Columna 3: Soporte */}
                        <div className="footer-column">
                            <h4 className="footer-title">Soporte</h4>
                            <ul className="footer-links">
                                <li><Link to="/contacto" className="footer-link">Contacto</Link></li>
                                <li><Link to="/faq" className="footer-link">Preguntas Frecuentes</Link></li>
                                <li><Link to="/envios" className="footer-link">Envíos y Entregas</Link></li>
                                <li><Link to="/devoluciones" className="footer-link">Devoluciones</Link></li>
                                <li><Link to="/terminos" className="footer-link">Términos y Condiciones</Link></li>
                            </ul>
                        </div>

                        {/* Columna 4: Newsletter */}
                        <div className="footer-column">
                            <h4 className="footer-title">Newsletter</h4>
                            <p className="footer-newsletter-text">
                                Suscríbete para recibir ofertas exclusivas y novedades.
                            </p>
                            <form className="newsletter-form" onSubmit={handleSubscribe}>
                                <div className="input-group">
                                    <input 
                                        type="email" 
                                        placeholder="Tu email" 
                                        required 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="newsletter-input"
                                    />
                                    <button type="submit" className="newsletter-btn">
                                        {subscribed ? '✓' : '→'}
                                    </button>
                                </div>
                                {subscribed && (
                                    <p className="success-message">
                                        ¡Gracias por suscribirte!
                                    </p>
                                )}
                            </form>
                            <div className="payment-methods">
                                <h5>Métodos de Pago</h5>
                                <div className="payment-icons">
                                    <span className="payment-icon">💳</span>
                                    <span className="payment-icon">📱</span>
                                    <span className="payment-icon">🔗</span>
                                    <span className="payment-icon">🏦</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Línea separadora */}
                    <div className="footer-divider"></div>

                    {/* Footer inferior */}
                    <div className="footer-bottom">
                        <div className="footer-copyright">
                            © 2025 <strong>MoKip</strong>. Todos los derechos reservados.
                        </div>
                        <div className="footer-legal">
                            <Link to="/privacidad" className="legal-link">Política de Privacidad</Link>
                            <Link to="/cookies" className="legal-link">Cookies</Link>
                            <Link to="/aviso-legal" className="legal-link">Aviso Legal</Link>
                        </div>
                    </div>
                </div>
            </footer>

            <style jsx>{`
                .main-footer {
                    background: linear-gradient(135deg, var(--gray-900) 0%, var(--gray-800) 100%);
                    color: var(--gray-300);
                    padding: 3rem 0 1rem;
                    margin-top: auto;
                }

                .footer-main {
                    display: grid;
                    grid-template-columns: 2fr 1fr 1fr 1.5fr;
                    gap: 3rem;
                    margin-bottom: 2rem;
                }

                .footer-column {
                    display: flex;
                    flex-direction: column;
                }

                .footer-brand {
                    margin-bottom: 1.5rem;
                }

                .footer-logo {
                    height: 40px;
                    margin-bottom: 1rem;
                    filter: brightness(0) invert(1);
                }

                .footer-description {
                    line-height: 1.6;
                    margin-bottom: 1.5rem;
                    color: var(--gray-400);
                }

                .social-links {
                    display: flex;
                    gap: 1rem;
                }

                .social-link {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 40px;
                    height: 40px;
                    background: var(--gray-700);
                    border-radius: 50%;
                    color: var(--gray-300);
                    text-decoration: none;
                    transition: all 0.3s ease;
                }

                .social-link:hover {
                    background: var(--primary-blue);
                    color: white;
                    transform: translateY(-2px);
                }

                .footer-title {
                    color: white;
                    font-size: 1.1rem;
                    font-weight: 600;
                    margin-bottom: 1.5rem;
                    position: relative;
                }

                .footer-title::after {
                    content: '';
                    position: absolute;
                    bottom: -0.5rem;
                    left: 0;
                    width: 30px;
                    height: 2px;
                    background: var(--primary-blue);
                }

                .footer-links {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .footer-links li {
                    margin-bottom: 0.75rem;
                }

                .footer-link {
                    color: var(--gray-400);
                    text-decoration: none;
                    transition: color 0.3s ease;
                    font-size: 0.9rem;
                }

                .footer-link:hover {
                    color: var(--primary-blue);
                }

                .footer-newsletter-text {
                    color: var(--gray-400);
                    margin-bottom: 1.5rem;
                    line-height: 1.5;
                }

                .newsletter-form {
                    margin-bottom: 2rem;
                }

                .input-group {
                    display: flex;
                    background: var(--gray-700);
                    border-radius: var(--border-radius-md);
                    overflow: hidden;
                    border: 1px solid var(--gray-600);
                    transition: border-color 0.3s ease;
                }

                .input-group:focus-within {
                    border-color: var(--primary-blue);
                }

                .newsletter-input {
                    flex: 1;
                    background: transparent;
                    border: none;
                    padding: 0.75rem 1rem;
                    color: white;
                    font-size: 0.9rem;
                }

                .newsletter-input::placeholder {
                    color: var(--gray-500);
                }

                .newsletter-input:focus {
                    outline: none;
                }

                .newsletter-btn {
                    background: var(--primary-blue);
                    border: none;
                    color: white;
                    padding: 0.75rem 1rem;
                    cursor: pointer;
                    transition: background 0.3s ease;
                    font-weight: 600;
                }

                .newsletter-btn:hover {
                    background: var(--primary-blue-dark);
                }

                .success-message {
                    color: var(--success);
                    font-size: 0.8rem;
                    margin-top: 0.5rem;
                    font-weight: 600;
                }

                .payment-methods {
                    margin-top: auto;
                }

                .payment-methods h5 {
                    color: var(--gray-400);
                    font-size: 0.9rem;
                    margin-bottom: 0.75rem;
                    font-weight: 600;
                }

                .payment-icons {
                    display: flex;
                    gap: 0.5rem;
                }

                .payment-icon {
                    font-size: 1.5rem;
                    opacity: 0.8;
                }

                .footer-divider {
                    height: 1px;
                    background: linear-gradient(90deg, transparent 0%, var(--gray-700) 50%, transparent 100%);
                    margin: 2rem 0;
                }

                .footer-bottom {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 1rem;
                    border-top: 1px solid var(--gray-700);
                }

                .footer-copyright {
                    color: var(--gray-500);
                    font-size: 0.9rem;
                }

                .footer-legal {
                    display: flex;
                    gap: 1.5rem;
                }

                .legal-link {
                    color: var(--gray-500);
                    text-decoration: none;
                    font-size: 0.8rem;
                    transition: color 0.3s ease;
                }

                .legal-link:hover {
                    color: var(--primary-blue);
                }

                /* Responsive */
                @media (max-width: 1024px) {
                    .footer-main {
                        grid-template-columns: 1fr 1fr;
                        gap: 2rem;
                    }
                }

                @media (max-width: 768px) {
                    .footer-main {
                        grid-template-columns: 1fr;
                        gap: 2rem;
                    }

                    .footer-bottom {
                        flex-direction: column;
                        gap: 1rem;
                        text-align: center;
                    }

                    .footer-legal {
                        justify-content: center;
                    }
                }

                @media (max-width: 480px) {
                    .main-footer {
                        padding: 2rem 0 1rem;
                    }

                    .footer-legal {
                        flex-direction: column;
                        gap: 0.5rem;
                    align-items: center;
                    margin-top: 1rem;
                    margin-bottom: 1rem;
                    padding-top: 1rem;
                    border-top: 1px solid var(--gray-700);
                    width: 100%;
                    order: -1;
                    margin-bottom: 1rem;
                }

                    .footer-bottom {
                        flex-direction: column;
                        gap: 1rem;
                    text-align: center;
                    padding-top: 0;
                        border-top: none;
                    }

                    .footer-copyright {
                        order: 1;
                    }
                }
            `}</style>
        </>
    )
}