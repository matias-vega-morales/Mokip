import React, { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import AdminMenu from './Partes/AdminMenu'
import { fetchUsers, updateUser, deleteUser } from '../Api/xano'

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

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

  async function handleToggleBlock(usuario) {
    try {
      const nuevoEstado = usuario.status === 'blocked' ? 'active' : 'blocked'
      
      // Enviar todos los campos necesarios del usuario con el estado actualizado
      const datosActualizados = {
        name: usuario.name || '',
        last_name: usuario.last_name || '',
        email: usuario.email || '',
        status: nuevoEstado,
        ...(usuario.role && { role: usuario.role }),
        ...(usuario.phone && { phone: usuario.phone }),
        ...(usuario.shipping_address && { shipping_address: usuario.shipping_address })
      }
      
      await updateUser(usuario.id, datosActualizados)
      
      // Actualizar el estado local
      setUsuarios(usuarios.map(u => 
        u.id === usuario.id ? { ...u, status: nuevoEstado } : u
      ))
    } catch (err) {
      console.error('Error al cambiar estado del usuario:', err)
      alert(`Error al cambiar el estado del usuario: ${err.message}`)
    }
  }

  async function handleDeleteUser(usuario) {
    try {
      await deleteUser(usuario.id)
      
      // Remover el usuario de la lista
      setUsuarios(usuarios.filter(u => u.id !== usuario.id))
    } catch (err) {
      console.error('Error al eliminar usuario:', err)
      alert(`Error al eliminar el usuario: ${err.message}`)
    }
  }

  // Filtrar usuarios basado en el término de búsqueda
  const filteredUsuarios = useMemo(() => {
    if (!searchTerm) return usuarios;
    return usuarios.filter(usuario => {
      const fullName = `${usuario.name || ''} ${usuario.last_name || ''}`.toLowerCase();
      const email = (usuario.email || '').toLowerCase();
      return fullName.includes(searchTerm.toLowerCase()) || email.includes(searchTerm.toLowerCase());
    });
  }, [usuarios, searchTerm]);

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
      <div className="main-content" style={{ marginLeft: '280px', minHeight: '100vh' }}>
        <div className="admin-header">
          <div>
            <h1>Gestión de Usuarios</h1>
            <p style={{ color: 'var(--gray-600)', margin: '0.5rem 0 0 0' }}>
              Administra los usuarios registrados en la plataforma
            </p>
          </div>
        </div>
        
        <main className="admin-content">
          <div className="usuarios-table card">
            <div className="card-header">
              <div>
                <h3 style={{ margin: 0 }}>Lista de Usuarios</h3>
                <small style={{ color: 'var(--gray-600)' }}>
                  {filteredUsuarios.length} de {usuarios.length} usuarios registrados
                </small>
              </div>
              <div className="search-bar-admin">
                <input
                  type="text"
                  placeholder="Buscar por nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Avatar</th>
                    <th>Nombre Completo</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th>Teléfono</th>
                    <th>Dirección</th>
                    <th>Registro</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsuarios.map(usuario => (
                    <tr key={usuario.id}>
                      <td>
                        <div style={{ 
                          width: '40px', 
                          height: '40px', 
                          borderRadius: '50%',
                          backgroundColor: 'var(--primary-blue)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: '600',
                          fontSize: '1.2rem'
                        }}>
                          {(usuario.name?.[0] || 'U').toUpperCase()}
                        </div>
                      </td>
                      <td>
                        <div>
                          <strong style={{ color: 'var(--gray-900)' }}>
                            {usuario.name} {usuario.last_name}
                          </strong>
                          <br />
                          <small style={{ color: 'var(--gray-500)' }}>
                            ID: {usuario.id?.slice(0, 8)}...
                          </small>
                        </div>
                      </td>
                      <td>
                        <span style={{ color: 'var(--gray-700)' }}>
                          {usuario.email}
                        </span>
                      </td>
                      <td>
                        <span className={`role-badge ${usuario.role || 'customer'}`}>
                          {usuario.role || 'customer'}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${usuario.status || 'active'}`}>
                          {usuario.status || 'active'}
                        </span>
                      </td>
                      <td>
                        <span style={{ color: 'var(--gray-600)' }}>
                          {usuario.phone || '-'}
                        </span>
                      </td>
                      <td style={{ maxWidth: '150px' }}>
                        <span style={{ 
                          color: 'var(--gray-600)',
                          fontSize: '0.9rem',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          display: 'block'
                        }}>
                          {usuario.shipping_address || '-'}
                        </span>
                      </td>
                      <td>
                        <span style={{ color: 'var(--gray-600)', fontSize: '0.9rem' }}>
                          {new Date(usuario.created_at).toLocaleDateString('es-ES')}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <Link to={`/admin/editar-usuario/${usuario.id}`}>
                            <button
                              className="btn-secondary"
                              style={{
                                padding: '0.25rem 0.5rem',
                                fontSize: '0.8rem'
                              }}
                            >
                              Editar
                            </button>
                          </Link>
                          <button 
                            className={usuario.status === 'blocked' ? "btn-secondary" : "btn-warning"}
                            onClick={() => handleToggleBlock(usuario)}
                            style={{ 
                              padding: '0.25rem 0.5rem',
                              fontSize: '0.8rem',
                              backgroundColor: usuario.status === 'blocked' ? 'var(--success)' : 'var(--warning)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            {usuario.status === 'blocked' ? 'Desbloquear' : 'Bloquear'}
                          </button>
                          <button 
                            className="btn-link" 
                            onClick={() => handleDeleteUser(usuario)}
                            style={{ 
                              padding: '0.25rem 0.5rem',
                              fontSize: '0.8rem',
                              color: 'var(--error)',
                              cursor: 'pointer'
                            }}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredUsuarios.length === 0 && !loading && (
                <p style={{ textAlign: 'center', padding: '2rem' }}>No se encontraron usuarios que coincidan con la búsqueda.</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
