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
        description: formData.description || '',
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        brand: formData.brand || '',
        category: formData.category || ''
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
      <div className="main-content" style={{ marginLeft: '280px', minHeight: '100vh' }}>
        <div className="admin-header">
          <div>
            <h1>Crear Producto</h1>
            <p style={{ color: 'var(--gray-600)', margin: '0.5rem 0 0 0' }}>
              Agrega un nuevo producto al catálogo de la tienda
            </p>
          </div>
        </div>
        
        <main className="admin-content">
          <div className="card">
            <div className="card-header">
              <h3 style={{ margin: 0 }}>Información del Producto</h3>
              <small style={{ color: 'var(--gray-600)' }}>
                Completa todos los campos requeridos (*)
              </small>
            </div>
            
            <div className="card-body">
              <form onSubmit={handleSubmit} className="product-form">
                <div className="form-group">
                  <label htmlFor="name">Nombre del Producto *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ej: Auriculares Bluetooth Premium"
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
                    placeholder="Describe las características y beneficios del producto..."
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="price">Precio *</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ 
                        position: 'absolute', 
                        left: '0.75rem', 
                        top: '50%', 
                        transform: 'translateY(-50%)',
                        color: 'var(--gray-500)',
                        fontWeight: '600'
                      }}>
                        $
                      </span>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        style={{ paddingLeft: '2rem' }}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="stock">Stock Inicial *</label>
                    <input
                      type="number"
                      id="stock"
                      name="stock"
                      min="0"
                      value={formData.stock}
                      onChange={handleInputChange}
                      placeholder="0"
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
                      placeholder="Ej: Sony, Samsung, Apple"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="category">Categoría</label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                    >
                      <option value="">Seleccionar categoría</option>
                      <option value="tecnologia">Tecnología</option>
                      <option value="hogar">Hogar</option>
                      <option value="deportes">Deportes</option>
                      <option value="moda">Moda</option>
                      <option value="libros">Libros</option>
                      <option value="otros">Otros</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="images">Imágenes del Producto</label>
                  <input
                    type="file"
                    id="images"
                    name="images"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ 
                      padding: '0.5rem',
                      border: '2px dashed var(--gray-300)',
                      borderRadius: 'var(--border-radius-md)',
                      backgroundColor: 'var(--gray-50)'
                    }}
                  />
                  <small style={{ color: 'var(--gray-500)', marginTop: '0.5rem', display: 'block' }}>
                    Puedes seleccionar múltiples imágenes. Formatos: JPG, PNG, WebP
                  </small>
                </div>

                <div className="form-actions" style={{ 
                  display: 'flex', 
                  gap: '1rem', 
                  justifyContent: 'flex-end',
                  marginTop: '2rem',
                  paddingTop: '2rem',
                  borderTop: '1px solid var(--gray-200)'
                }}>
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={() => navigate('/admin/productos')}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="btn-primary" 
                    disabled={loading}
                    style={{ minWidth: '150px' }}
                  >
                    {loading ? 'Creando...' : 'Crear Producto'}
                  </button>
                </div>

                {message && (
                  <div 
                    className="message" 
                    style={{ 
                      marginTop: '1rem', 
                      padding: '0.75rem', 
                      borderRadius: 'var(--border-radius-md)',
                      backgroundColor: message.includes('Error') ? '#fef2f2' : '#f0fdf4',
                      color: message.includes('Error') ? 'var(--error)' : 'var(--success)',
                      textAlign: 'center',
                      fontWeight: '500'
                    }}
                  >
                    {message}
                  </div>
                )}
              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
