import React, { useEffect, useState } from 'react'
import Menu from './Partes/Menu'
import { fetchCartByUser, fetchCartItems, updateCartItem, deleteCartItem } from '../Api/xano'
import { Link } from 'react-router-dom'

// NOTE: this is a minimal UI-only implementation that calls Xano endpoints.
// Assumes you have a way to get current user id; for now we use a placeholder.
const CURRENT_USER_ID = import.meta.env.VITE_APP_USER_ID || null

export default function Carrito() {
  const [cart, setCart] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        if (!CURRENT_USER_ID) throw new Error('No user id configured')
        const carts = await fetchCartByUser(CURRENT_USER_ID)
        const userCart = carts && carts.length ? carts[0] : null
        if (!userCart) throw new Error('Carrito vacío')
        if (!mounted) return
        setCart(userCart)
        const list = await fetchCartItems(userCart.id)
        if (!mounted) return
        setItems(list)
      } catch (err) {
        console.error(err)
        if (mounted) setError(err.message || 'Error cargando carrito')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  async function handleQuantityChange(itemId, delta) {
    try {
      const item = items.find(i => i.id === itemId)
      if (!item) return
      const newQty = Math.max(1, (item.quantity || 1) + delta)
      await updateCartItem(itemId, { quantity: newQty })
      setItems(items.map(i => i.id === itemId ? { ...i, quantity: newQty } : i))
    } catch (err) {
      console.error(err)
    }
  }

  async function handleRemove(itemId) {
    try {
      await deleteCartItem(itemId)
      setItems(items.filter(i => i.id !== itemId))
    } catch (err) {
      console.error(err)
    }
  }

  const total = items.reduce((s, it) => s + ((it.price_at_purchase || it.price || 0) * (it.quantity || 1)), 0)

  if (loading) return <main className="container">Cargando carrito...</main>
  if (error) return <main className="container">{error}</main>

  return (
    <>
      <Menu />
      <main className="carrito-main">
        <div className="container carrito-container">
          <h1>Mi carrito de compras</h1>
          <div className="carrito-content">
            <div className="carrito-lista" id="carritoLista">
              {items.map(item => (
                <div className="carrito-item" key={item.id} data-id={item.id}>
                  <img src={item.product?.images?.[0] || item.product?.img || '/img/producto1.png'} alt={item.product?.name || item.product?.title} className="img-producto" />
                  <div className="carrito-info">
                    <h2>{item.product?.name || item.product?.title}</h2>
                    <p>{item.product?.description}</p>
                  </div>
                  <div className="carrito-precio">{item.price_at_purchase || item.product?.price}</div>
                  <div className="carrito-cantidad">
                    <button className="btn-cantidad menos" onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                    <input type="number" min="1" value={item.quantity} readOnly className="input-cantidad" />
                    <button className="btn-cantidad mas" onClick={() => handleQuantityChange(item.id, +1)}>+</button>
                  </div>
                  <div className="carrito-subtotal">{((item.price_at_purchase || item.product?.price) * (item.quantity || 1)).toFixed(2)}</div>
                  <button className="btn-eliminar" onClick={() => handleRemove(item.id)}>Eliminar</button>
                </div>
              ))}
            </div>

            <aside className="carrito-resumen">
              <div className="carrito-total">
                <span>TOTAL:</span>
                <span id="carritoTotal">{total.toFixed(2)}</span>
              </div>
              <div className="carrito-botones">
                <Link to="/productos" className="btn-seguir">Seguir comprando</Link>
                <button className="btn-pagar" id="btnPagar">Proceder al pago</button>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  )
}
