import React from 'react'


export const Footer = () => {
	return (
        <>
            <footer className="main-footer">
                <div className="container footer-content">
                    <div className="footer-left">© 2025 Tienda Online. Todos los derechos reservados.</div>

                    <div className="footer-center">
                        <img src="/img/logo.png" alt="Logo Tienda Online" className="logo-img-footer" />
                        <br />
                        <a href="/contacto.html">Contacto</a> |
                        <a href="#">Instagram</a> |
                        <a href="#">Facebook</a>
                    </div>

                    <div className="footer-right">
                        <form className="newsletter-form">
                            <input type="email" placeholder="Tu email" required />
                            <button type="submit">Suscribirse</button>
                        </form>
                    </div>
                </div>
            </footer>
        </>
	)
}

