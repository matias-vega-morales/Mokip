import React, { useState } from 'react'
import AdminMenu from './Partes/AdminMenu'
import { useNavigate } from 'react-router-dom'
import { createProduct } from '../Api/xano'

export default function AdminCrearProducto() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    brand: '',
    category: '',
    images: []
  })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    setFormData(prev => ({
      ...prev,
      images: files
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.price || !formData.stock) {
      setMessage('Por favor completa los campos requeridos')
      return
    }

    setLoading(true)
    setMessage('')
    
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        brand: formData.brand,
        category: formData.category
      }

      await createProduct(productData)
      setMessage('Producto creado exitosamente')
      navigate('/admin/productos')
    } catch (err) {
      console.error('Error creando producto:', err)
      setMessage('Error al crear el producto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <AdminMenu />
      <div className="main-content">
        <div className="admin-header">
          <h1>Crear Producto</h1>
        </div>
        
        <main className="admin-content">
          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-group">
              <label htmlFor="name">Nombre *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Descripción</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Precio *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="stock">Stock *</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  min="0"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="brand">Marca</label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Categoría</label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="images">Imágenes</label>
              <input
                type="file"
                id="images"
                name="images"
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Creando...' : 'Crear Producto'}
              </button>
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => navigate('/admin/productos')}
              >
                Cancelar
              </button>
            </div>

            {message && <div className="message">{message}</div>}
          </form>
        </main>
      </div>
    </>
  )
}
