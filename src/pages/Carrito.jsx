import React, { useEffect, useState, useCallback } from 'react'
import Menu from './Partes/Menu'
import { fetchCartByUser, fetchCartItems, updateCartItem, deleteCartItem, createCart } from '../Api/xano'
import { Link, useNavigate } from 'react-router-dom'
import { Footer } from './Partes/Footer'

export default function Carrito() {
  const [cart, setCart] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatingItems, setUpdatingItems] = useState(new Set()) // Para evitar múltiples updates
  const navigate = useNavigate()

  // Memoizar la función para evitar recreaciones
  const getCurrentUser = useCallback(() => {
    try {
      const authUser = localStorage.getItem('auth_user')
      return authUser ? JSON.parse(authUser) : null
    } catch (err) {
      console.error('❌ Error parseando auth_user:', err)
      return null
    }
  }, [])

  // Cargar carrito y items
  useEffect(() => {
    let mounted = true
    
    const loadCartData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const currentUser = getCurrentUser()
        
        if (!currentUser) {
          console.log('🔒 Usuario no autenticado, redirigiendo...')
          navigate('/login', { replace: true })
          return
        }

        const userId = currentUser.id
        if (!userId) throw new Error('ID de usuario no disponible')

        console.log('🛒 Cargando carrito para usuario:', userId)
        
        // Obtener o crear carrito
        let userCart = await fetchCartByUser(userId)
        userCart = userCart?.[0] || await createCart({
          user_id: userId,
          created_at: new Date().toISOString()
        })

        if (!mounted) return
        setCart(userCart)

        // Cargar items del carrito
        const cartItems = await fetchCartItems(userCart.id)
        if (!mounted) return
        setItems(cartItems || [])

      } catch (err) {
        console.error('❌ Error cargando carrito:', err)
        if (mounted) {
          setError(err.message || 'Error al cargar el carrito')
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadCartData()
    
    return () => { mounted = false }
  }, [navigate, getCurrentUser])

  // Manejar cambio de cantidad con debounce implícito
  const handleQuantityChange = async (itemId, delta) => {
    if (updatingItems.has(itemId)) return // Evitar updates simultáneos
    
    try {
      setUpdatingItems(prev => new Set(prev).add(itemId))
      
      const item = items.find(i => i.id === itemId)
      if (!item) return
      
      const currentQty = item.quantity || 1
      const newQty = Math.max(1, currentQty + delta)
      
      // Optimistic update
      setItems(prev => prev.map(i => 
        i.id === itemId ? { ...i, quantity: newQty } : i
      ))
      
      await updateCartItem(itemId, { quantity: newQty })
      
    } catch (err) {
      console.error('❌ Error actualizando cantidad:', err)
      // Revertir optimistic update
      setItems(prev => prev.map(i => 
        i.id === itemId ? { ...i, quantity: item.quantity } : i
      ))
      setError('Error al actualizar la cantidad')
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        return newSet
      })
    }
  }

  // Eliminar item del carrito
  const handleRemove = async (itemId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto del carrito?')) {
      return
    }

    try {
      // Optimistic update
      const itemToRemove = items.find(i => i.id === itemId)
      setItems(prev => prev.filter(i => i.id !== itemId))
      
      await deleteCartItem(itemId)
      
    } catch (err) {
      console.error('❌ Error eliminando item:', err)
      // Revertir optimistic update
      setItems(prev => [...prev, itemToRemove].sort((a, b) => a.id - b.id))
      setError('Error al eliminar el producto')
    }
  }

  // Proceder al pago
  const handleCheckout = () => {
    if (items.length === 0) {
      setError('El carrito está vacío')
      return
    }
    
    // Aquí puedes redirigir a la página de checkout
    console.log('Procediendo al pago con items:', items)
    // navigate('/checkout')
    alert('Funcionalidad de pago en desarrollo')
  }

  // Calcular total de forma eficiente
  const total = items.reduce((sum, item) => {
    const price = item.price_at_purchase || item.product?.price || 0
    const quantity = item.quantity || 1
    return sum + (price * quantity)
  }, 0)

  // Renderizar loading state
  if (loading) {
    return (
      <>
        <Menu />
        <main className="container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Cargando tu carrito...</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Menu />
      <main className="carrito-main">
        <div className="container carrito-container">
          <div className="carrito-header">
            <h1>Mi Carrito de Compras</h1>
            <span className="items-count">{items.length} producto{items.length !== 1 ? 's' : ''}</span>
          </div>

          <div className="carrito-content">
            {error && (
              <div className="error-banner">
                <p>{error}</p>
                <button onClick={() => setError(null)}>×</button>
              </div>
            )}

            {items.length === 0 ? (
              <div className="carrito-vacio">
                <div className="empty-icon">🛒</div>
                <h2>Tu carrito está vacío</h2>
                <p>Descubre nuestros productos y encuentra algo especial</p>
                <Link to="/productos" className="btn btn-primary">
                  Descubrir Productos
                </Link>
              </div>
            ) : (
              <>
                <div className="carrito-lista">
                  {items.map(item => {
                    const price = item.price_at_purchase || item.product?.price || 0
                    const quantity = item.quantity || 1
                    const subtotal = price * quantity
                    const isUpdating = updatingItems.has(item.id)
                    
                    return (
                      <div 
                        className={`carrito-item ${isUpdating ? 'updating' : ''}`} 
                        key={item.id}
                      >
                        <div className="item-image">
                          <img 
                            src={item.product?.images?.[0]?.url || item.product?.image || '/img/placeholder-product.jpg'} 
                            alt={item.product?.name || 'Producto'} 
                            loading="lazy"
                          />
                        </div>
                        
                        <div className="item-details">
                          <h3>{item.product?.name || 'Producto sin nombre'}</h3>
                          <p className="item-description">
                            {item.product?.description || 'Sin descripción disponible'}
                          </p>
                          <div className="item-price-mobile">
                            ${price.toFixed(2)} c/u
                          </div>
                        </div>

                        <div className="item-quantity">
                          <button 
                            className="btn-quantity" 
                            onClick={() => handleQuantityChange(item.id, -1)}
                            disabled={isUpdating || quantity <= 1}
                          >
                            -
                          </button>
                          <span className="quantity-display">
                            {isUpdating ? '...' : quantity}
                          </span>
                          <button 
                            className="btn-quantity" 
                            onClick={() => handleQuantityChange(item.id, 1)}
                            disabled={isUpdating}
                          >
                            +
                          </button>
                        </div>

                        <div className="item-price">
                          ${price.toFixed(2)}
                        </div>

                        <div className="item-subtotal">
                          ${subtotal.toFixed(2)}
                        </div>

                        <button 
                          className="btn-remove"
                          onClick={() => handleRemove(item.id)}
                          disabled={isUpdating}
                          title="Eliminar producto"
                        >
          🗑️
                        </button>
                      </div>
                    )
                  })}
                </div>

                <aside className="carrito-summary">
                  <div className="summary-card">
                    <h3>Resumen del Pedido</h3>
                    
                    <div className="summary-row">
                      <span>Subtotal ({items.length} productos):</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    
                    <div className="summary-row">
                      <span>Envío:</span>
                      <span className="free-shipping">Gratis</span>
                    </div>
                    
                    <div className="summary-divider"></div>
                    
                    <div className="summary-total">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>

                    <div className="summary-actions">
                      <Link to="/productos" className="btn btn-secondary">
                        Seguir Comprando
                      </Link>
                      <button 
                        className="btn btn-primary" 
                        onClick={handleCheckout}
                      >
                        Proceder al Pago
                      </button>
                    </div>
                    
                    <div className="security-notice">
                      🔒 Compra 100% segura y protegida
                    </div>
                  </div>
                </aside>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}