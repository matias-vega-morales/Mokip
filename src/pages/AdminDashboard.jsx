import React from 'react'
import AdminMenu from './Partes/AdminMenu'

export default function AdminDashboard() {
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
        </header>
        
        <main className="admin-dashboard" style={{ padding: '2rem' }}>
          <div className="dashboard-cards" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '2rem',
            marginBottom: '3rem'
          }}>
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
                  120
                </p>
                <small style={{ color: 'var(--gray-600)' }}>
                  +12% este mes
                </small>
              </div>
            </div>
            
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
                  45
                </p>
                <small style={{ color: 'var(--gray-600)' }}>
                  +8% este mes
                </small>
              </div>
            </div>
            
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
                  Pedidos Recientes
                </h2>
                <p style={{ 
                  fontSize: '2.5rem', 
                  fontWeight: '700', 
                  color: 'var(--success)',
                  margin: 0 
                }}>
                  8
                </p>
                <small style={{ color: 'var(--gray-600)' }}>
                  +3 hoy
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
                  Ventas del Mes
                </h4>
                <p style={{ 
                  fontSize: '2rem', 
                  fontWeight: '700', 
                  color: 'var(--primary-blue)',
                  margin: 0 
                }}>
                  $2,450,000
                </p>
                <small style={{ color: 'var(--success)' }}>
                  ↗ +15% vs mes anterior
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
                  color: 'var(--warning)',
                  margin: 0 
                }}>
                  95%
                </p>
                <small style={{ color: 'var(--gray-600)' }}>
                  Nivel de inventario
                </small>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <h4 style={{ color: 'var(--gray-900)', marginBottom: '1rem' }}>
                  Satisfacción
                </h4>
                <p style={{ 
                  fontSize: '2rem', 
                  fontWeight: '700', 
                  color: 'var(--success)',
                  margin: 0 
                }}>
                  4.8/5
                </p>
                <small style={{ color: 'var(--gray-600)' }}>
                  Promedio de reseñas
                </small>
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
          Administrador – MoKip © 2025
        </footer>
      </div>
    </>
  )
}
