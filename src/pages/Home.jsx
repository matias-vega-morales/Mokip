import React from 'react'
import { Link } from 'react-router-dom'
import Menu from './Partes/Menu'

export default function Home() {
  return (
    <>
      <Menu />
      
      {/* Hero Section - Sección principal con llamada a la acción */}
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-text fade-in">
            <h1>Bienvenido a MoKip</h1>
            <p>
              Descubre una amplia gama de productos de alta calidad a precios increíbles. 
              Desde tecnología hasta hogar, tenemos todo lo que necesitas en un solo lugar.
            </p>
            <Link to="/productos" className="btn-primary">
              Explorar Productos
            </Link>
          </div>

          <div className="hero-image fade-in">
            <img 
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop" 
              alt="Tienda moderna con productos de calidad" 
            />
          </div>
        </div>
      </section>

      {/* Productos Destacados - Sección de productos principales */}
      <section className="products-section">
        <div className="container">
          <div className="text-center mb-5">
            <h2>Productos Destacados</h2>
            <p>Los productos más populares y mejor valorados por nuestros clientes</p>
          </div>
          
          <div className="products-grid">
            <div className="product-card">
              <img 
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop" 
                alt="Auriculares premium" 
                className="img-producto" 
              />
              <div className="product-info">
                <h3 className="product-title">Auriculares Premium</h3>
                <p className="product-price">$19.990</p>
                <button className="add-to-cart">Añadir al carrito</button>
              </div>
            </div>

            <div className="product-card">
              <img 
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop" 
                alt="Reloj inteligente" 
                className="img-producto" 
              />
              <div className="product-info">
                <h3 className="product-title">Reloj Inteligente</h3>
                <p className="product-price">$24.990</p>
                <button className="add-to-cart">Añadir al carrito</button>
              </div>
            </div>

            <div className="product-card">
              <img 
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop" 
                alt="Zapatillas deportivas" 
                className="img-producto" 
              />
              <div className="product-info">
                <h3 className="product-title">Zapatillas Deportivas</h3>
                <p className="product-price">$15.000</p>
                <button className="add-to-cart">Añadir al carrito</button>
              </div>
            </div>

            <div className="product-card">
              <img 
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop" 
                alt="Cámara digital" 
                className="img-producto" 
              />
              <div className="product-info">
                <h3 className="product-title">Cámara Digital</h3>
                <p className="product-price">$29.990</p>
                <button className="add-to-cart">Añadir al carrito</button>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-5">
            <Link to="/productos" className="btn-secondary">
              Ver Todos los Productos
            </Link>
          </div>
        </div>
      </section>

      {/* Características - Sección de beneficios */}
      <section className="features-section" style={{ padding: '4rem 0', background: 'var(--gray-50)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2>¿Por qué elegir MoKip?</h2>
            <p>Ofrecemos la mejor experiencia de compra online</p>
          </div>
          
          <div className="features-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '2rem' 
          }}>
            <div className="feature-card card text-center">
              <div className="card-body">
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚚</div>
                <h4>Envío Gratis</h4>
                <p>Envío gratuito en compras superiores a $50.000</p>
              </div>
            </div>
            
            <div className="feature-card card text-center">
              <div className="card-body">
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
                <h4>Compra Segura</h4>
                <p>Protección total de tus datos y pagos</p>
              </div>
            </div>
            
            <div className="feature-card card text-center">
              <div className="card-body">
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>↩️</div>
                <h4>Devoluciones</h4>
                <p>30 días para devolver cualquier producto</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}