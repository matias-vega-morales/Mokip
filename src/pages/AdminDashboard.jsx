import React from 'react'
import AdminMenu from './Partes/AdminMenu'

export default function AdminDashboard() {
  return (
    <>
      <AdminMenu />
      <div className="main-content">
        <header className="admin-header">
          <h1>Panel de Administración</h1>
        </header>
        
        <main className="admin-dashboard">
          <div className="dashboard-cards">
            <div className="dashboard-card" data-section="Productos activos">
              <h2>Productos activos</h2>
              <p>120</p>
            </div>
            
            <div className="dashboard-card" data-section="Usuarios registrados">
              <h2>Usuarios registrados</h2>
              <p>45</p>
            </div>
            
            <div className="dashboard-card" data-section="Pedidos recientes">
              <h2>Pedidos recientes</h2>
              <p>8</p>
            </div>
          </div>
        </main>
        
        <footer className="admin-footer">
          Administrador – Tienda Online © 2025
        </footer>
      </div>
    </>
  )
}
