import React from 'react'
import Menu from './Partes/Menu'

export default function Home() {
  return (
    <>
            <Menu />
        <section className="hero">
            <div className="container hero-content">
            <div className="hero-text">
                <h1>TIENDA MoKip</h1>
                <p>
                Nuestra tienda ofrece productos de calidad para todas las regiones. ¡Descubre
                nuestras ofertas y encuentra lo que buscas!
                </p>
                <a className="btn-primary" href="/productos.html">Ver productos</a>
            </div>

            <div className="hero-image">
                <img src="/assets/hero.jpg" alt="Imagen principal de la tienda" />
            </div>
            </div>
        </section>

        <section className="products-section">
            <div className="container">
            <h2>Productos Destacados</h2>
            <div className="products-grid">
                <div className="product-card">
                <img src="/img/producto1.png" alt="Producto 1" className="img-producto" />
                <h3>Producto 1</h3>
                <p className="price">$19.990</p>
                <button className="add-to-cart">Añadir al carrito</button>
                </div>

                <div className="product-card">
                <img src="/img/producto2.png" alt="Producto 2" className="img-producto" />
                <h3>Producto 2</h3>
                <p className="price">$24.990</p>
                <button className="add-to-cart">Añadir al carrito</button>
                </div>

                <div className="product-card">
                <img src="/img/producto3.png" alt="Producto 3" className="img-producto" />
                <h3>Producto 3</h3>
                <p className="price">$15.000</p>
                <button className="add-to-cart">Añadir al carrito</button>
                </div>

                <div className="product-card">
                <img src="/img/producto4.png" alt="Producto 4" className="img-producto" />
                <h3>Producto 4</h3>
                <p className="price">$29.990</p>
                <button className="add-to-cart">Añadir al carrito</button>
                </div>
            </div>
            </div>
                </section>
            </>
  )
}