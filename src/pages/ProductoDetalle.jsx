import React, { useEffect, useState, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Menu from './Partes/Menu'
import { fetchProductById, fetchRelatedProducts, fetchCartByUser, createCart, addCartItem } from '../Api/xano'
import { formatPriceCLP } from './format.js'
import { useCart } from './CartContext.jsx'

export default function ProductoDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [producto, setProducto] = useState(null)
  const [relacionados, setRelacionados] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [addingToCart, setAddingToCart] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [selectedImageUrl, setSelectedImageUrl] = useState(null)
  const { updateCartCount } = useCart() // Usamos el contexto del carrito

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError(null)

    fetchProductById(id)
      .then(data => {
        if (!mounted) return
        setProducto(data)
        // Al cargar el producto, establecer la primera imagen como seleccionada
        if (data?.images?.[0]?.url) {
          setSelectedImageUrl(data.images[0].url)
        }

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

  const getCurrentUser = useCallback(() => {
    try {
      const authUser = localStorage.getItem('auth_user')
      return authUser ? JSON.parse(authUser) : null
    } catch (err) {
      return null
    }
  }, [])

  const handleAddToCart = async () => {
    setAddingToCart(true)
    setError(null)

    const currentUser = getCurrentUser()
    if (!currentUser || !currentUser.id) {
      navigate('/login')
      return
    }

    try {
      // 1. Obtener o crear el carrito del usuario
      let userCart = await fetchCartByUser(currentUser.id)
      userCart = userCart?.[0] || await createCart({
        user_id: currentUser.id,
        created_at: new Date().toISOString()
      })

      if (!userCart || !userCart.id) {
        throw new Error('No se pudo obtener o crear el carrito.')
      }

      // 2. Añadir el item al carrito
      await addCartItem(userCart.id, producto.id, quantity)

      // 3. Actualizar el contador del menú
      await updateCartCount()

    } catch (err) {
      console.error('❌ Error añadiendo al carrito:', err)
      setError(err.message || 'No se pudo añadir el producto al carrito.')
    } finally {
      setAddingToCart(false)
    }
  }

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
      <div className="main-content" style={{ paddingTop: '100px' }}>
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
                  src={selectedImageUrl || '/img/placeholder-product.jpg'} 
                  alt={producto.name} 
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
                {(producto.images || []).slice(0,4).map((imageObj, i) => (
                  <img 
                    src={imageObj.url} 
                    alt={`Miniatura ${i+1}`} 
                    key={i} 
                    className="thumb img-producto"
                    style={{ 
                      width: '80px', 
                      height: '80px', 
                      objectFit: 'cover',
                      borderRadius: 'var(--border-radius-md)',
                      cursor: 'pointer',
                      // Resaltar el borde si la imagen está seleccionada
                      border: selectedImageUrl === imageObj.url ? '2px solid var(--primary-blue)' : '2px solid var(--gray-200)',
                      transition: 'border-color var(--transition-fast)'
                    }}
                    // Al hacer clic, cambia la imagen principal
                    onClick={() => setSelectedImageUrl(imageObj.url)}
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
                    {producto.name}
                  </h1>
                  
                  <div style={{ marginBottom: '1.5rem' }}>
                    <span className="detalle-precio" style={{ 
                      fontSize: '2.5rem', 
                      fontWeight: '700', 
                      color: 'var(--primary-blue)',
                      display: 'block',
                      marginBottom: '0.5rem'
                    }}>
                      {formatPriceCLP(producto.price)}
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
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
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
                        onClick={handleAddToCart}
                        disabled={addingToCart}
                        style={{ flex: '1', minWidth: '200px' }}
                      >
                        {addingToCart ? 'Añadiendo...' : '🛒 Añadir al carrito'}
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
                    src={r.images?.[0]?.url || '/img/placeholder-product.jpg'} 
                    alt={r.name} 
                    className="img-producto"
                    style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                  />
                  <div className="product-info">
                    <h4 className="product-title" style={{ fontSize: '1rem' }}>
                      {r.name}
                    </h4>
                    <p className="product-price" style={{ fontSize: '1.1rem' }}>
                      {formatPriceCLP(r.price)}
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
