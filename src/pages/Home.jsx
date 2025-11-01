import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Menu from './Partes/Menu'
import { Footer } from './Partes/Footer'
import { fetchProducts } from '../Api/xano'
import ProductosList from './Partes/ProductosList' // Importa el componente existente

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Cargar productos destacados desde Xano
  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        setLoading(true)
        console.log('🔄 Cargando productos destacados...')
        const productsData = await fetchProducts()
        console.log('✅ Productos cargados para home:', productsData)
        
        // Tomar los primeros 4 productos como destacados
        if (Array.isArray(productsData)) {
          const featured = productsData.slice(0, 4) // Primeros 4 productos
          setFeaturedProducts(featured)
        } else {
          setFeaturedProducts([])
        }
      } catch (err) {
        console.error('❌ Error cargando productos destacados:', err)
        setError('Error al cargar productos destacados')
      } finally {
        setLoading(false)
      }
    }

    loadFeaturedProducts()
  }, [])

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

          <div>
            <img 
              src="/src/assets/images/Closet.webp" 
              alt="Tienda moderna con productos de calidad" 
            />
          </div>
        </div>
      </section>

      {/* Productos Destacados usando el componente ProductosList existente */}
      <section className="products-section">
        <div className="container">
          <ProductosList 
            products={featuredProducts}
            loading={loading}
            error={error}
            title="Productos Destacados"
            subtitle="Los productos más populares y mejor valorados por nuestros clientes"
            showCount={false}
            emptyMessage={
              <>
                <p>No hay productos destacados disponibles en este momento.</p>
                <Link to="/productos" className="btn-primary mt-3">
                  Ver Todos los Productos
                </Link>
              </>
            }
            loadingMessage="Cargando productos destacados..."
          />
          
          {/* Botón Ver Todos los Productos */}
          {!loading && !error && featuredProducts.length > 0 && (
            <div className="text-center mt-5">
              <Link to="/productos" className="btn-secondary">
                Ver Todos los Productos
              </Link>
            </div>
          )}
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
      <Footer />
    </>
  )
}