import React, { useEffect, useState } from 'react'
import Menu from './Partes/Menu'
import { fetchCartByUser, fetchCartItems, updateCartItem, deleteCartItem, createCart } from '../Api/xano'
import { Link, useNavigate } from 'react-router-dom'

export default function Carrito() {
  const [cart, setCart] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // Obtener el usuario actual del localStorage
  const getCurrentUser = () => {
    const authUser = localStorage.getItem('auth_user')
    if (authUser) {
      try {
        const user = JSON.parse(authUser)
        return user
      } catch (err) {
        console.error('❌ Error parseando auth_user:', err)
        return null
      }
    }
    return null
  }

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        const currentUser = getCurrentUser()
        
        // Verificar si el usuario está logueado
        if (!currentUser) {
          console.log('❌ No hay usuario logueado')
          navigate('/login')
          return
        }

        const userId = currentUser.id
        
        if (!userId) {
          throw new Error('No se pudo obtener el ID del usuario')
        }

        console.log('🛒 Buscando carrito para usuario:', userId)
        
        // Obtener el carrito del usuario
        const carts = await fetchCartByUser(userId)
        console.log('📦 Carritos encontrados:', carts)
        
        let userCart = carts && carts.length ? carts[0] : null
        
        // Si no hay carrito, crear uno nuevo
        if (!userCart) {
          console.log('🆕 Creando nuevo carrito...')
          userCart = await createCart({
            user_id: userId,
            created_at: new Date().toISOString()
          })
          console.log('✅ Nuevo carrito creado:', userCart)
        }

        if (!mounted) return
        setCart(userCart)

        // Obtener los items del carrito
        console.log('📋 Buscando items para carrito:', userCart.id)
        const list = await fetchCartItems(userCart.id)
        console.log('🎁 Items encontrados:', list)
        
        if (!mounted) return
        setItems(list)

      } catch (err) {
        console.error('❌ Error cargando carrito:', err)
        if (mounted) {
          setError('Error cargando carrito: ' + err.message)
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [navigate])

  async function handleQuantityChange(itemId, delta) {
    try {
      const item = items.find(i => i.id === itemId)
      if (!item) return
      const newQty = Math.max(1, (item.quantity || 1) + delta)
      await updateCartItem(itemId, { quantity: newQty })
      setItems(items.map(i => i.id === itemId ? { ...i, quantity: newQty } : i))
    } catch (err) {
      console.error('Error actualizando cantidad:', err)
    }
  }

  async function handleRemove(itemId) {
    try {
      await deleteCartItem(itemId)
      setItems(items.filter(i => i.id !== itemId))
    } catch (err) {
      console.error('Error eliminando item:', err)
    }
  }

  const total = items.reduce((s, it) => s + ((it.price_at_purchase || it.product?.price || 0) * (it.quantity || 1)), 0)

  if (loading) return (
    <>
      <Menu />
      <main className="container">Cargando carrito...</main>
    </>
  )

  return (
    <>
      <Menu />
      <main className="carrito-main">
        <div className="container carrito-container">
          <h1>Mi carrito de compras</h1>
          <div className="carrito-content">
            {error ? (
              <div className="carrito-vacio">
                <p>{error}</p>
                <Link to="/productos" className="btn-seguir">Ir a comprar</Link>
              </div>
            ) : items.length === 0 ? (
              <div className="carrito-vacio">
                <p>Tu carrito está vacío</p>
                <Link to="/productos" className="btn-seguir">Descubrir productos</Link>
              </div>
            ) : (
              <>
                <div className="carrito-lista" id="carritoLista">
                  {items.map(item => (
                    <div className="carrito-item" key={item.id} data-id={item.id}>
                      <img 
                        src={item.product?.images?.[0] || item.product?.img || '/img/producto1.png'} 
                        alt={item.product?.name || item.product?.title} 
                        className="img-producto" 
                      />
                      <div className="carrito-info">
                        <h2>{item.product?.name || item.product?.title}</h2>
                        <p>{item.product?.description}</p>
                      </div>
                      <div className="carrito-precio">${(item.price_at_purchase || it.product?.price || 0).toFixed(2)}</div>
                      <div className="carrito-cantidad">
                        <button className="btn-cantidad menos" onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                        <input type="number" min="1" value={item.quantity || 1} readOnly className="input-cantidad" />
                        <button className="btn-cantidad mas" onClick={() => handleQuantityChange(item.id, +1)}>+</button>
                      </div>
                      <div className="carrito-subtotal">
                        ${((item.price_at_purchase || it.product?.price || 0) * (item.quantity || 1)).toFixed(2)}
                      </div>
                      <button className="btn-eliminar" onClick={() => handleRemove(item.id)}>Eliminar</button>
                    </div>
                  ))}
                </div>

                <aside className="carrito-resumen">
                  <div className="carrito-total">
                    <span>TOTAL:</span>
                    <span id="carritoTotal">${total.toFixed(2)}</span>
                  </div>
                  <div className="carrito-botones">
                    <Link to="/productos" className="btn-seguir">Seguir comprando</Link>
                    <button className="btn-pagar" id="btnPagar">Proceder al pago</button>
                  </div>
                </aside>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  )
}