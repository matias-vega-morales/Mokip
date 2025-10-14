import React, { useEffect, useState } from 'react'
import AdminMenu from './Partes/AdminMenu'
import { Link } from 'react-router-dom'
import { fetchProducts } from '../Api/xano'

export default function AdminProductos() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
      <div className="main-content">
        <div className="admin-header">
          <h1>Gestión de Productos</h1>
          <Link to="/admin/crear-producto" className="btn-primary">
            Crear producto
          </Link>
        </div>
        
        <main className="admin-content">
          <div className="productos-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
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
                {productos.map(producto => (
                  <tr key={producto.id}>
                    <td>{producto.id}</td>
                    <td>{producto.name}</td>
                    <td>{producto.description}</td>
                    <td>${producto.price}</td>
                    <td>{producto.stock}</td>
                    <td>{producto.brand}</td>
                    <td>{producto.category}</td>
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
