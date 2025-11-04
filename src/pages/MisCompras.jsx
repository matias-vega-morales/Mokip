import React, { useEffect, useState, useCallback } from 'react';
import Menu from './Partes/Menu';
import { Footer } from './Partes/Footer';
import { fetchOrders, fetchOrderItems, fetchProducts, deleteOrder } from '../Api/xano';
import { formatPriceCLP } from './format.js';
import { Link, useNavigate } from 'react-router-dom';

export default function MisCompras() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null); // Estado para la fila expandida
  const navigate = useNavigate();

  const getCurrentUser = useCallback(() => {
    try {
      const authUser = localStorage.getItem('auth_user');
      return authUser ? JSON.parse(authUser) : null;
    } catch (err) {
      return null;
    }
  }, []);

  useEffect(() => {
    const loadUserOrders = async () => {
      const currentUser = getCurrentUser();
      if (!currentUser || !currentUser.id) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const userOrders = await fetchOrders({ user_id: currentUser.id });
        
        if (userOrders.length > 0) {
            const allOrderItems = await fetchOrderItems();
            const allProducts = await fetchProducts();
            const productsMap = new Map(allProducts.map(p => [p.id, p]));

            const enrichedOrders = userOrders.map(order => {
                const items = allOrderItems.filter(item => item.order_id === order.id).map(item => ({
                    ...item,
                    product_data: productsMap.get(item.product_id) || {}
                }));
                const calculatedTotal = items.reduce((sum, item) => sum + (item.price_at_purchase * item.quantity), 0);
                return { ...order, items, total_price: order.total_price || calculatedTotal };
            });
            setOrders(enrichedOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
        }

      } catch (err) {
        setError('No se pudieron cargar tus compras.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadUserOrders();
  }, [getCurrentUser, navigate]);

  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending_approval': return { text: 'Pendiente', className: 'status-pending' };
      case 'approved': return { text: 'Aprobado', className: 'status-approved' };
      case 'rejected': return { text: 'Rechazado', className: 'status-rejected' };
      default: return { text: status, className: '' };
    }
  };

  const handleDeleteRejectedOrder = async (orderId) => {
    try {
      await deleteOrder(orderId);
      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
    } catch (err) {
      setError('No se pudo eliminar la orden.');
    }
  };

  // Función para expandir/colapsar detalles del pedido
  const handleToggleDetails = (orderId) => {
    setExpandedOrderId(prevId => (prevId === orderId ? null : orderId));
  };

  // Renderizar loading state
  if (loading) {
    return (
      <>
        <Menu />
        <main className="container" style={{ padding: '2rem 0', textAlign: 'center' }}>
          <div className="spinner"></div>
          <p style={{ marginTop: '1rem', color: 'var(--gray-600)' }}>Cargando tus compras...</p>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Menu />
      <main className="container" style={{ padding: '2rem 0' }}>
        <div className="page-header">
          <h1>Tus Pedidos</h1>
        </div>

        {error && (
          <div className="error-banner">
            <p>{error}</p>
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        {!loading && orders.length === 0 && (
          <div className="carrito-vacio">
            <div className="empty-icon">🛍️</div>
            <h2>Aún no tienes compras</h2>
            <p>¡Explora nuestros productos y encuentra algo que te encante!</p>
            <Link to="/productos" className="btn btn-primary">Explorar productos</Link>
          </div>
        )}

        <div className="orders-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map(order => {
            const statusInfo = getStatusInfo(order.status);
            return (
              <div className="card" key={order.id}>
                <div className="card-header">
                  <div className="order-header-info">
                    <strong>Pedido del {new Date(order.created_at).toLocaleDateString('es-ES')}</strong>
                    <span className={`status-badge ${statusInfo.className}`}>{statusInfo.text}</span>
                  </div>
                  {order.status === 'rejected' && (
                    <button
                      onClick={() => handleDeleteRejectedOrder(order.id)}
                      title="Eliminar orden del historial"
                      className="btn-remove-order"
                    >
                      ×
                    </button>
                  )}
                </div>
                <div className="card-body">
                  <div className="order-items-list">
                    {order.items?.map(item => (
                      <div key={item.id} className="order-item">
                        <img 
                          src={item.product_data?.images?.[0]?.url || '/img/placeholder-product.jpg'} 
                          alt={item.product_data?.name} 
                          className="order-item-image"
                        />
                        <div className="order-item-details">
                          <p className="item-name">{item.product_data?.name}</p>
                          <p className="item-meta">{item.quantity} x {formatPriceCLP(item.price_at_purchase)}</p>
                        </div>
                        <div className="order-item-subtotal">
                          {formatPriceCLP(item.price_at_purchase * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="order-total-summary">
                    <div className="summary-row">
                      <span>Total del Pedido</span>
                      <span className="total-price">{formatPriceCLP(order.total_price)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}