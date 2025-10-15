import React from 'react'
import Menu from './Partes/Menu'
import { Footer } from './Partes/Footer'

export default function Blogs() {
  return (
    <>
      <Menu />
      <main className="blogs-main">
        <div className="container">
          <h1 className="blogs-title">Últimas noticias y novedades</h1>
          <div className="blogs-grid">
            <div className="blog-card">
              <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop" alt="Blog 1" />
              <div className="blog-content">
                <h2>¿Cómo elegir el mejor producto para ti?</h2>
                <p>
                  Descubre consejos prácticos para seleccionar productos que se adapten a tus
                  necesidades y estilo de vida.
                </p>
                <a href="#" className="leer-mas">
                  Leer más
                </a>
              </div>
            </div>

            <div className="blog-card">
              <img src="/assets/blog2.jpg" alt="Blog 2" />
              <div className="blog-content">
                <h2>Novedades de la temporada</h2>
                <p>
                  Conoce los lanzamientos más recientes y las tendencias que están marcando el
                  mercado este año.
                </p>
                <a href="#" className="leer-mas">
                  Leer más
                </a>
              </div>
            </div>

            <div className="blog-card">
              <img src="/assets/blog3.jpg" alt="Blog 3" />
              <div className="blog-content">
                <h2>Tips para comprar online de forma segura</h2>
                <p>
                  Aprende a proteger tus datos y a identificar tiendas confiables para una
                  experiencia de compra segura.
                </p>
                <a href="#" className="leer-mas">
                  Leer más
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
