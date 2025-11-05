import React, { useEffect, useState, useMemo } from 'react'
import AdminMenu from './Partes/AdminMenu'
import { fetchOrders, fetchUsers, updateOrder, fetchOrderItems } from '../Api/xano'
import { formatPriceCLP } from './format.js'

export default function AdminVentas() {
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true)
        const [ordersData, usersData, allOrderItems] = await Promise.all([
          fetchOrders(),
          fetchUsers(),
          fetchOrderItems() // Obtenemos todos los items de todas las órdenes
        ])
        
        // Agrupar items por order_id para fácil acceso
        const itemsByOrderId = allOrderItems.reduce((acc, item) => {
          if (!acc[item.order_id]) acc[item.order_id] = [];
          acc[item.order_id].push(item);
          return acc;
        }, {});

        // Enriquecer cada orden con sus items y calcular el total si no viene
        const enrichedOrders = (ordersData || []).map(order => {
          const items = itemsByOrderId[order.id] || [];
          const calculatedTotal = items.reduce((sum, item) => sum + (item.price_at_purchase * item.quantity), 0);
          return { ...order, items, total_price: order.total_price || calculatedTotal };
        });

        setOrders(enrichedOrders)
        setUsers(new Map(usersData.map(u => [u.id, u]))) // Guardar el objeto de usuario completo

      } catch (err) {
        console.error('Error cargando datos de ventas:', err)
        setError('Error al cargar los datos')
      } finally {
        setLoading(false)
      }
    }
    loadInitialData()
  }, [])

  const pendingOrders = useMemo(() => 
    orders.filter(order => order.status === 'pending_approval'), 
  [orders])

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateOrder(orderId, { status: newStatus });
      // Actualizar el estado local para que la orden desaparezca de la lista de pendientes
      setOrders(prevOrders => prevOrders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      alert(`Error al actualizar la orden: ${err.message}`);
    }
  }

  const handleApproveOrder = (orderId) => {
    handleUpdateOrderStatus(orderId, 'approved');
  }

  const handleRejectOrder = (orderId) => {
    handleUpdateOrderStatus(orderId, 'rejected');
  }

  if (loading) return (
    <>
      <AdminMenu />
      <div className="main-content">
        <div className="admin-header"><h1>Ventas</h1></div>
        <div>Cargando ventas...</div>
      </div>
    </>
  )

  if (error) return (
    <>
      <AdminMenu />
      <div className="main-content">
        <div className="admin-header"><h1>Ventas</h1></div>
        <div>{error}</div>
      </div>
    </>
  )

  return (
    <>
      <AdminMenu />
      <div className="main-content" style={{ marginLeft: '280px', minHeight: '100vh' }}>
        <div className="admin-header">
          <div>
            <h1>Gestión de Ventas</h1>
            <p style={{ color: 'var(--gray-600)', margin: '0.5rem 0 0 0' }}>
              Aprueba o rechaza las compras pendientes de los clientes
            </p>
          </div>
        </div>
        
        <main className="admin-content">
          <div className="productos-table card">
            <div className="card-header">
              <h3 style={{ margin: 0 }}>Ventas por Aprobar</h3>
              <small style={{ color: 'var(--gray-600)' }}>
                {pendingOrders.length} ventas pendientes
              </small>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>ID Orden</th>
                    <th>Cliente</th>
                    <th>Fecha</th>
                    <th>Dirección</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingOrders.map(order => {
                    const user = users.get(order.user_id);
                    return (
                      <tr key={order.id}>
                        <td><small>{order.id}</small></td>
                        <td>{user?.name || user?.email || 'Usuario desconocido'}</td>
                        <td>{new Date(order.created_at).toLocaleDateString()}</td>
                        <td style={{ maxWidth: '200px', whiteSpace: 'normal' }}>{user?.shipping_address || '-'}</td>
                        <td>{formatPriceCLP(order.total_price || 0)}</td>
                        <td>
                          <span className="status-pending">
                            {order.status === 'pending_approval' ? 'Pendiente' : order.status}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button 
                              onClick={() => handleApproveOrder(order.id)} 
                              className="btn-secondary btn-sm"
                              title="Aprobar Venta"
                              style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', '--bs-btn-bg': 'var(--success-light)', '--bs-btn-color': 'var(--success-dark)', '--bs-btn-border-color': 'var(--success)' }}
                            >
                              <span style={{ fontWeight: 'bold' }}>✓</span>
                              <span>Aprobar</span>
                            </button>
                            <button 
                              onClick={() => handleRejectOrder(order.id)} 
                              className="btn-secondary btn-sm"
                              title="Rechazar Venta"
                              style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', '--bs-btn-bg': 'var(--error-light)', '--bs-btn-color': 'var(--error-dark)', '--bs-btn-border-color': 'var(--error)' }}
                            >
                              <span style={{ fontWeight: 'bold' }}>×</span>
                              <span>Rechazar</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {pendingOrders.length === 0 && <p style={{textAlign: 'center', padding: '2rem'}}>No hay ventas pendientes de aprobación.</p>}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}