import React, { useEffect, useState } from 'react'
import AdminMenu from './Partes/AdminMenu'
import { fetchUsers } from '../Api/xano'

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadUsuarios()
  }, [])

  async function loadUsuarios() {
    try {
      setLoading(true)
      const data = await fetchUsers()
      setUsuarios(data || [])
    } catch (err) {
      console.error('Error cargando usuarios:', err)
      setError('Error al cargar usuarios')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <>
      <AdminMenu />
      <div className="main-content">
        <div className="admin-header">
          <h1>Gestión de Usuarios</h1>
        </div>
        <div>Cargando usuarios...</div>
      </div>
    </>
  )

  if (error) return (
    <>
      <AdminMenu />
      <div className="main-content">
        <div className="admin-header">
          <h1>Gestión de Usuarios</h1>
        </div>
        <div>{error}</div>
      </div>
    </>
  )

  return (
    <>
      <AdminMenu />
      <div className="main-content">
        <div className="admin-header">
          <h1>Gestión de Usuarios</h1>
        </div>
        
        <main className="admin-content">
          <div className="usuarios-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Teléfono</th>
                  <th>Dirección</th>
                  <th>Fecha de Registro</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(usuario => (
                  <tr key={usuario.id}>
                    <td>{usuario.id}</td>
                    <td>{usuario.name}</td>
                    <td>{usuario.last_name}</td>
                    <td>{usuario.email}</td>
                    <td>
                      <span className={`role-badge ${usuario.role}`}>
                        {usuario.role || 'customer'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${usuario.status}`}>
                        {usuario.status || 'active'}
                      </span>
                    </td>
                    <td>{usuario.phone || '-'}</td>
                    <td>{usuario.shipping_address || '-'}</td>
                    <td>{new Date(usuario.created_at).toLocaleDateString()}</td>
                    <td>
                      <button className="btn-edit">Editar</button>
                      <button className="btn-delete">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </>
  )
}
