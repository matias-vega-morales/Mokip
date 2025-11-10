import React, { useEffect, useState, useMemo } from 'react'
import AdminMenu from './Partes/AdminMenu'
import { Link } from 'react-router-dom'
import { fetchProducts, deleteProduct } from '../Api/xano'
import { formatPriceCLP } from './format.js'

export default function AdminProductos() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadProductos()
  }, [])

  async function loadProductos() {
    try {
      setLoading(true)
      const data = await fetchProducts()
      setProductos(data || [])
    } catch (err) {
      console.error('Error cargando productos:', err)
      setError('Error al cargar productos')
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteProduct(producto) {
    try {
      await deleteProduct(producto.id)
      
      // Remover el producto de la lista
      setProductos(productos.filter(p => p.id !== producto.id))
    } catch (err) {
      console.error('Error al eliminar producto:', err)
      alert(`Error al eliminar el producto: ${err.message}`)
    }
  }

  // Filtrar productos basado en el término de búsqueda
  const filteredProductos = useMemo(() => {
    if (!searchTerm) return productos;
    return productos.filter(producto =>
      producto.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [productos, searchTerm]);

  if (loading) return (
    <>
      <AdminMenu />
      <div className="main-content">
        <div className="admin-header">
          <h1>Gestión de Productos</h1>
        </div>
        <div>Cargando productos...</div>
      </div>
    </>
  )

  if (error) return (
    <>
      <AdminMenu />
      <div className="main-content">
        <div className="admin-header">
          <h1>Gestión de Productos</h1>
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
            <h1>Gestión de Productos</h1>
            <p style={{ color: 'var(--gray-600)', margin: '0.5rem 0 0 0' }}>
              Administra el catálogo de productos de la tienda
            </p>
          </div>
          <Link to="/admin/crear-producto" className="btn-primary">
            + Crear Producto
          </Link>
        </div>
        
        <main className="admin-content">
          <div className="productos-table card">
            <div className="card-header">
              <div>
                <h3 style={{ margin: 0 }}>Lista de Productos</h3>
                <small style={{ color: 'var(--gray-600)' }}>
                  {filteredProductos.length} de {productos.length} productos encontrados
                </small>
              </div>
              <div className="search-bar-admin">
                <input
                  type="text"
                  placeholder="Buscar por nombre..."
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
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Marca</th>
                    <th>Categoría</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProductos.map(producto => (
                    <tr key={producto.id}>
                      <td>
                        <img 
                          src={producto.images?.[0]?.url || '/img/placeholder-product.jpg'} 
                          alt={producto.name}
                          style={{ 
                            width: '50px', 
                            height: '50px', 
                            objectFit: 'cover', 
                            borderRadius: 'var(--border-radius-md)' 
                          }}
                        />
                      </td>
                      <td>
                        <strong style={{ color: 'var(--gray-900)' }}>
                          {producto.name}
                        </strong>
                        <br />
                        <small style={{ color: 'var(--gray-500)' }}>
                          ID: {producto.id?.slice(0, 8)}...
                        </small>
                      </td>
                      <td style={{ maxWidth: '200px' }}>
                        <p style={{ 
                          margin: 0, 
                          fontSize: '0.9rem',
                          color: 'var(--gray-600)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {producto.description || 'Sin descripción'}
                        </p>
                      </td>
                      <td>
                        <span style={{ 
                          fontWeight: '700', 
                          color: 'var(--primary-blue)',
                          fontSize: '1.1rem'
                        }}>
                          {formatPriceCLP(producto.price)}
                        </span>
                      </td>
                      <td>
                        <span style={{ 
                          padding: '0.25rem 0.5rem',
                          borderRadius: 'var(--border-radius-sm)',
                          backgroundColor: producto.stock > 10 ? '#d1fae5' : '#fef3c7',
                          color: producto.stock > 10 ? '#065f46' : '#92400e',
                          fontWeight: '600',
                          fontSize: '0.9rem'
                        }}>
                          {producto.stock} unidades
                        </span>
                      </td>
                      <td>
                        <span style={{ color: 'var(--gray-600)' }}>
                          {producto.brand || '-'}
                        </span>
                      </td>
                      <td>
                        <span style={{ 
                          padding: '0.25rem 0.5rem',
                          borderRadius: 'var(--border-radius-sm)',
                          backgroundColor: 'var(--gray-100)',
                          color: 'var(--gray-700)',
                          fontSize: '0.9rem'
                        }}>
                          {producto.category || 'Sin categoría'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <Link to={`/admin/editar-producto/${producto.id}`}>
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
                            className="btn-link" 
                            onClick={() => handleDeleteProduct(producto)}
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
              {filteredProductos.length === 0 && !loading && (
                <p style={{ textAlign: 'center', padding: '2rem' }}>No se encontraron productos que coincidan con la búsqueda.</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}