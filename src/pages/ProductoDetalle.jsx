import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Menu from './Partes/Menu'
import { fetchProductById, fetchRelatedProducts } from '../Api/xano'

export default function ProductoDetalle() {
  const { id } = useParams()
  const [producto, setProducto] = useState(null)
  const [relacionados, setRelacionados] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError(null)

    fetchProductById(id)
      .then(data => {
        if (!mounted) return
        setProducto(data)
        // try to fetch related by category if available
        const category = data?.category || null
        if (category) {
          fetchRelatedProducts(category, 5).then(list => {
            if (!mounted) return
            setRelacionados(list.filter(p => String(p.id) !== String(id)))
          }).catch(() => {})
        }
      })
      .catch(err => {
        console.error(err)
        if (mounted) setError('No se pudo cargar el producto')
      })
      .finally(() => { if (mounted) setLoading(false) })

    return () => { mounted = false }
  }, [id])

  if (loading) return <main className="container">Cargando...</main>
  if (error) return <main className="container">{error}</main>
  if (!producto) {
    return (
      <main className="container">
        <h1>Producto no encontrado</h1>
        <Link to="/productos">Volver a productos</Link>
      </main>
    )
  }

  return (
    <>
      <Menu />
      <div className="main-content">
        <div className="container">
          <div className="detalle-container" style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '3rem', 
            marginBottom: '4rem',
            alignItems: 'start'
          }}>
            <div className="detalle-galeria">
              <div className="card" style={{ overflow: 'hidden' }}>
                <img 
                  src={producto.images?.[0] || producto.img || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=600&fit=crop'} 
                  alt={producto.name || producto.title} 
                  className="detalle-img-principal img-producto"
                  style={{ width: '100%', height: '400px', objectFit: 'cover' }}
                />
              </div>
              
              <div className="detalle-thumbs" style={{ 
                display: 'flex', 
                gap: '0.5rem', 
                marginTop: '1rem',
                overflowX: 'auto'
              }}>
                {(producto.images || [producto.img]).slice(0,4).map((src, i) => (
                  <img 
                    src={src} 
                    alt={`Miniatura ${i+1}`} 
                    key={i} 
                    className="thumb img-producto"
                    style={{ 
                      width: '80px', 
                      height: '80px', 
                      objectFit: 'cover',
                      borderRadius: 'var(--border-radius-md)',
                      cursor: 'pointer',
                      border: '2px solid var(--gray-200)',
                      transition: 'border-color var(--transition-fast)'
                    }}
                    onMouseOver={(e) => e.target.style.borderColor = 'var(--primary-blue)'}
                    onMouseOut={(e) => e.target.style.borderColor = 'var(--gray-200)'}
                  />
                ))}
              </div>
            </div>

            <div className="detalle-info">
              <div className="card">
                <div className="card-body">
                  <h1 className="detalle-titulo" style={{ 
                    color: 'var(--gray-900)', 
                    marginBottom: '1rem',
                    fontSize: '2rem'
                  }}>
                    {producto.name || producto.title}
                  </h1>
                  
                  <div style={{ marginBottom: '1.5rem' }}>
                    <span className="detalle-precio" style={{ 
                      fontSize: '2.5rem', 
                      fontWeight: '700', 
                      color: 'var(--primary-blue)',
                      display: 'block',
                      marginBottom: '0.5rem'
                    }}>
                      {producto.price}
                    </span>
                    <small style={{ color: 'var(--gray-600)' }}>
                      Precio incluye IVA
                    </small>
                  </div>
                  
                  <p className="detalle-desc" style={{ 
                    color: 'var(--gray-600)', 
                    lineHeight: '1.6',
                    marginBottom: '2rem'
                  }}>
                    {producto.description || 'Descripción no disponible para este producto.'}
                  </p>

                  <form className="detalle-form">
                    <div className="form-group">
                      <label htmlFor="cantidad" style={{ 
                        fontWeight: '600', 
                        color: 'var(--gray-700)',
                        marginBottom: '0.5rem',
                        display: 'block'
                      }}>
                        Cantidad
                      </label>
                      <input 
                        type="number" 
                        id="cantidad" 
                        name="cantidad" 
                        min="1" 
                        defaultValue={1}
                        style={{ 
                          width: '100px', 
                          marginBottom: '1.5rem',
                          textAlign: 'center'
                        }}
                      />
                    </div>
                    
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <button 
                        type="button" 
                        className="btn-primary" 
                        id="btnAddCart"
                        style={{ flex: '1', minWidth: '200px' }}
                      >
                        🛒 Añadir al carrito
                      </button>
                      <button 
                        type="button" 
                        className="btn-secondary"
                        style={{ flex: '1', minWidth: '200px' }}
                      >
                        ❤️ Favoritos
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <div className="relacionados-container">
            <div className="text-center mb-4">
              <h2 style={{ color: 'var(--gray-900)', marginBottom: '0.5rem' }}>
                Productos Relacionados
              </h2>
              <p style={{ color: 'var(--gray-600)' }}>
                Otros productos que podrían interesarte
              </p>
            </div>
            
            <div className="relacionados-grid" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '1.5rem' 
            }}>
              {relacionados.map(r => (
                <Link to={`/productos/${r.id}`} key={r.id} className="relacionado-card product-card">
                  <img 
                    src={r.images?.[0] || r.img || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop'} 
                    alt={r.name || r.title} 
                    className="img-producto"
                    style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                  />
                  <div className="product-info">
                    <h4 className="product-title" style={{ fontSize: '1rem' }}>
                      {r.name || r.title}
                    </h4>
                    <p className="product-price" style={{ fontSize: '1.1rem' }}>
                      {r.price}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
