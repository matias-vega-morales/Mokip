import React, { useState, useEffect } from 'react'
import AdminMenu from './Partes/AdminMenu'
import { fetchProducts, fetchUsers, fetchOrders } from '../Api/xano'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    recentOrders: 0,
    monthlySales: 0,
    stockLevel: 0,
    loading: true,
    error: null
  })

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true, error: null }))
      
      console.log('🔄 Cargando datos del dashboard...')
      
      // Cargar datos en paralelo
      const [productsData, usersData, ordersData] = await Promise.all([
        fetchProducts().catch(err => {
          console.error('Error cargando productos:', err)
          return []
        }),
        fetchUsers().catch(err => {
          console.error('Error cargando usuarios:', err)
          return []
        }),
        fetchOrders().catch(err => {
          console.error('Error cargando pedidos:', err)
          return []
        })
      ])

      console.log('✅ Datos cargados:', {
        productos: productsData.length,
        usuarios: usersData.length,
        pedidos: ordersData.length
      })

      // Calcular estadísticas
      const totalProducts = Array.isArray(productsData) ? productsData.length : 0
      const totalUsers = Array.isArray(usersData) ? usersData.length : 0
      const totalOrders = Array.isArray(ordersData) ? ordersData.length : 0
      
      // Pedidos recientes (últimos 7 días)
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      
      const recentOrders = Array.isArray(ordersData) ? ordersData.filter(order => {
        const orderDate = new Date(order.created_at || order.date || order.createdAt)
        return orderDate >= oneWeekAgo
      }).length : 0

      // Calcular ventas mensuales (ejemplo - ajusta según tu estructura de órdenes)
      const monthlySales = Array.isArray(ordersData) ? ordersData.reduce((total, order) => {
        return total + (order.total_amount || order.total || order.amount || 0)
      }, 0) : 0

      // Calcular nivel de stock (productos con stock > 0)
      const productsWithStock = Array.isArray(productsData) ? 
        productsData.filter(product => (product.stock || 0) > 0).length : 0
      
      const stockLevel = totalProducts > 0 ? 
        Math.round((productsWithStock / totalProducts) * 100) : 0

      setStats({
        totalProducts,
        totalUsers,
        totalOrders,
        recentOrders,
        monthlySales,
        stockLevel,
        loading: false,
        error: null
      })

    } catch (error) {
      console.error('❌ Error cargando dashboard:', error)
      setStats(prev => ({
        ...prev,
        loading: false,
        error: 'Error al cargar los datos del dashboard'
      }))
    }
  }

  // Formatear moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount)
  }

  // Calcular tendencias (ejemplo simple)
  const calculateTrend = (current, previous = 0) => {
    if (previous === 0) return '+0%'
    const change = ((current - previous) / previous) * 100
    return `${change >= 0 ? '+' : ''}${Math.round(change)}%`
  }

  if (stats.loading) {
    return (
      <>
        <AdminMenu />
        <div className="main-content" style={{ marginLeft: '280px', minHeight: '100vh' }}>
          <header className="admin-header">
            <div>
              <h1>Panel de Administración</h1>
              <p style={{ color: 'var(--gray-600)', margin: '0.5rem 0 0 0' }}>
                Cargando datos...
              </p>
            </div>
          </header>
          
          <main className="admin-dashboard" style={{ padding: '2rem' }}>
            <div className="text-center py-5">
              <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-3">Cargando datos del dashboard...</p>
            </div>
          </main>
        </div>
      </>
    )
  }

  if (stats.error) {
    return (
      <>
        <AdminMenu />
        <div className="main-content" style={{ marginLeft: '280px', minHeight: '100vh' }}>
          <header className="admin-header">
            <div>
              <h1>Panel de Administración</h1>
              <p style={{ color: 'var(--gray-600)', margin: '0.5rem 0 0 0' }}>
                Error al cargar datos
              </p>
            </div>
          </header>
          
          <main className="admin-dashboard" style={{ padding: '2rem' }}>
            <div className="alert alert-danger">
              <h4>Error</h4>
              <p>{stats.error}</p>
              <button className="btn btn-primary" onClick={loadDashboardData}>
                Reintentar
              </button>
            </div>
          </main>
        </div>
      </>
    )
  }

  return (
    <>
      <AdminMenu />
      <div className="main-content" style={{ marginLeft: '280px', minHeight: '100vh' }}>
        <header className="admin-header">
          <div>
            <h1>Panel de Administración</h1>
            <p style={{ color: 'var(--gray-600)', margin: '0.5rem 0 0 0' }}>
              Bienvenido al centro de control de MoKip
            </p>
          </div>
          <button 
            className="btn btn-outline-primary btn-sm"
            onClick={loadDashboardData}
            title="Actualizar datos"
          >
            🔄 Actualizar
          </button>
        </header>
        
        <main className="admin-dashboard" style={{ padding: '2rem' }}>
          {/* Cards principales */}
          <div className="dashboard-cards" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            {/* Productos Activos */}
            <div className="dashboard-card card" data-section="Productos activos">
              <div className="card-body text-center">
                <div style={{ 
                  fontSize: '3rem', 
                  color: 'var(--primary-blue)', 
                  marginBottom: '1rem' 
                }}>
                  📦
                </div>
                <h2 style={{ color: 'var(--gray-900)', marginBottom: '0.5rem' }}>
                  Productos Activos
                </h2>
                <p style={{ 
                  fontSize: '2.5rem', 
                  fontWeight: '700', 
                  color: 'var(--primary-blue)',
                  margin: 0 
                }}>
                  {stats.totalProducts}
                </p>
                <small style={{ color: 'var(--gray-600)' }}>
                  Total en catálogo
                </small>
              </div>
            </div>
            
            {/* Usuarios Registrados */}
            <div className="dashboard-card card" data-section="Usuarios registrados">
              <div className="card-body text-center">
                <div style={{ 
                  fontSize: '3rem', 
                  color: 'var(--accent-orange)', 
                  marginBottom: '1rem' 
                }}>
                  👥
                </div>
                <h2 style={{ color: 'var(--gray-900)', marginBottom: '0.5rem' }}>
                  Usuarios Registrados
                </h2>
                <p style={{ 
                  fontSize: '2.5rem', 
                  fontWeight: '700', 
                  color: 'var(--accent-orange)',
                  margin: 0 
                }}>
                  {stats.totalUsers}
                </p>
                <small style={{ color: 'var(--gray-600)' }}>
                  Cuentas activas
                </small>
              </div>
            </div>
            
            {/* Pedidos Recientes */}
            <div className="dashboard-card card" data-section="Pedidos recientes">
              <div className="card-body text-center">
                <div style={{ 
                  fontSize: '3rem', 
                  color: 'var(--success)', 
                  marginBottom: '1rem' 
                }}>
                  🛒
                </div>
                <h2 style={{ color: 'var(--gray-900)', marginBottom: '0.5rem' }}>
                  Pedidos Totales
                </h2>
                <p style={{ 
                  fontSize: '2.5rem', 
                  fontWeight: '700', 
                  color: 'var(--success)',
                  margin: 0 
                }}>
                  {stats.totalOrders}
                </p>
                <small style={{ color: 'var(--gray-600)' }}>
                  {stats.recentOrders} pedidos recientes
                </small>
              </div>
            </div>
          </div>

          {/* Estadísticas adicionales */}
          <div className="stats-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '1.5rem' 
          }}>
            <div className="card">
              <div className="card-body">
                <h4 style={{ color: 'var(--gray-900)', marginBottom: '1rem' }}>
                  Ventas Totales
                </h4>
                <p style={{ 
                  fontSize: '2rem', 
                  fontWeight: '700', 
                  color: 'var(--primary-blue)',
                  margin: 0 
                }}>
                  {formatCurrency(stats.monthlySales)}
                </p>
                <small style={{ color: 'var(--gray-600)' }}>
                  Ingresos acumulados
                </small>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <h4 style={{ color: 'var(--gray-900)', marginBottom: '1rem' }}>
                  Productos en Stock
                </h4>
                <p style={{ 
                  fontSize: '2rem', 
                  fontWeight: '700', 
                  color: stats.stockLevel > 80 ? 'var(--success)' : 
                         stats.stockLevel > 50 ? 'var(--warning)' : 'var(--danger)',
                  margin: 0 
                }}>
                  {stats.stockLevel}%
                </p>
                <small style={{ color: 'var(--gray-600)' }}>
                  Nivel de inventario
                </small>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <h4 style={{ color: 'var(--gray-900)', marginBottom: '1rem' }}>
                  Tasa de Conversión
                </h4>
                <p style={{ 
                  fontSize: '2rem', 
                  fontWeight: '700', 
                  color: 'var(--success)',
                  margin: 0 
                }}>
                  {stats.totalUsers > 0 ? 
                    Math.round((stats.totalOrders / stats.totalUsers) * 100) : 0
                  }%
                </p>
                <small style={{ color: 'var(--gray-600)' }}>
                  Pedidos por usuario
                </small>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <h4 style={{ color: 'var(--gray-900)', marginBottom: '1rem' }}>
                  Valor Promedio
                </h4>
                <p style={{ 
                  fontSize: '2rem', 
                  fontWeight: '700', 
                  color: 'var(--accent-orange)',
                  margin: 0 
                }}>
                  {stats.totalOrders > 0 ? 
                    formatCurrency(stats.monthlySales / stats.totalOrders) : 
                    formatCurrency(0)
                  }
                </p>
                <small style={{ color: 'var(--gray-600)' }}>
                  Por pedido
                </small>
              </div>
            </div>
          </div>

          {/* Información del sistema */}
          <div className="row mt-4">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <h5 style={{ color: 'var(--gray-900)', marginBottom: '1rem' }}>
                    Resumen del Sistema
                  </h5>
                  <div className="row text-center">
                    <div className="col-md-3">
                      <small style={{ color: 'var(--gray-600)' }}>Productos sin stock</small>
                      <p style={{ 
                        fontSize: '1.5rem', 
                        fontWeight: '700', 
                        color: 'var(--danger)',
                        margin: '0.5rem 0 0 0'
                      }}>
                        {stats.totalProducts - Math.round((stats.stockLevel / 100) * stats.totalProducts)}
                      </p>
                    </div>
                    <div className="col-md-3">
                      <small style={{ color: 'var(--gray-600)' }}>Pedidos hoy</small>
                      <p style={{ 
                        fontSize: '1.5rem', 
                        fontWeight: '700', 
                        color: 'var(--success)',
                        margin: '0.5rem 0 0 0'
                      }}>
                        {Math.round(stats.recentOrders / 7)} {/* Estimado */}
                      </p>
                    </div>
                    <div className="col-md-3">
                      <small style={{ color: 'var(--gray-600)' }}>Usuarios nuevos</small>
                      <p style={{ 
                        fontSize: '1.5rem', 
                        fontWeight: '700', 
                        color: 'var(--accent-orange)',
                        margin: '0.5rem 0 0 0'
                      }}>
                        {Math.round(stats.totalUsers * 0.1)} {/* Estimado */}
                      </p>
                    </div>
                    <div className="col-md-3">
                      <small style={{ color: 'var(--gray-600)' }}>Última actualización</small>
                      <p style={{ 
                        fontSize: '1.1rem', 
                        fontWeight: '600', 
                        color: 'var(--gray-700)',
                        margin: '0.5rem 0 0 0'
                      }}>
                        {new Date().toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <footer className="admin-footer" style={{ 
          padding: '2rem', 
          textAlign: 'center', 
          color: 'var(--gray-600)',
          borderTop: '1px solid var(--gray-200)',
          background: 'var(--gray-50)'
        }}>
          Administrador – MoKip © 2025 | 
          <small style={{ marginLeft: '1rem' }}>
            Datos en tiempo real desde Xano API
          </small>
        </footer>
      </div>

      {/* Estilos adicionales */}
      <style jsx>{`
        .dashboard-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          border: 1px solid var(--gray-200);
        }
        
        .dashboard-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.1);
        }
        
        .card {
          border: 1px solid var(--gray-200);
          border-radius: var(--border-radius-lg);
        }
        
        .card-body {
          padding: 2rem;
        }
        
        @media (max-width: 768px) {
          .admin-dashboard {
            padding: 1rem;
          }
          
          .dashboard-cards {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  )
}