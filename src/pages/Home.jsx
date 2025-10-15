import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Menu from './Partes/Menu'
import { Footer } from './Partes/Footer'
import { fetchProducts } from '../Api/xano'

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
        // Puedes ajustar esta lógica para productos realmente destacados
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

  // Función para obtener la URL de la imagen
  const getImageUrl = (product) => {
    if (product.images && product.images[0]) {
      return product.images[0].url || product.images[0]
    }
    if (product.image) return product.image
    if (product.img) return product.img
    return 'https://es.wikipedia.org/wiki/No_%28canción_de_Meghan_Trainor%29#/media/Archivo:No_(single)_logo.png'
  }

  // Función para obtener el nombre
  const getName = (product) => {
    return product.name || product.title || 'Producto sin nombre'
  }

  // Función para formatear precio
  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return `$${price.toLocaleString('es-CL')}`
    }
    if (typeof price === 'string') {
      return price.includes('$') ? price : `$${price}`
    }
    return '$0'
  }

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
          
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-3">Cargando productos destacados...</p>
            </div>
          ) : error ? (
            <div className="text-center py-5">
              <div className="alert alert-warning">
                <p>{error}</p>
              </div>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-5">
              <p>No hay productos destacados disponibles en este momento.</p>
              <Link to="/productos" className="btn-primary mt-3">
                Ver Todos los Productos
              </Link>
            </div>
          ) : (
            <>
              <div className="products-grid">
                {featuredProducts.map(product => (
                  <div key={product.id} className="product-card">
                    <img 
                      src={getImageUrl(product)} 
                      alt={getName(product)} 
                      className="img-producto" 
                      onError={(e) => {
                        e.target.src = 'https://es.wikipedia.org/wiki/No_%28canción_de_Meghan_Trainor%29#/media/Archivo:No_(single)_logo.png'
                      }}
                    />
                    <div className="product-info">
                      <h3 className="product-title">{getName(product)}</h3>
                      <p className="product-price">{formatPrice(product.price)}</p>
                      <Link 
                        to={`/productos/${product.id}`} 
                        className="add-to-cart"
                        style={{
                          display: 'block',
                          textDecoration: 'none',
                          textAlign: 'center'
                        }}
                      >
                        Ver Detalles
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-5">
                <Link to="/productos" className="btn-secondary">
                  Ver Todos los Productos
                </Link>
              </div>
            </>
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