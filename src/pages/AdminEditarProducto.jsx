import React, { useState, useEffect } from 'react'
import AdminMenu from './Partes/AdminMenu'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchProductById, updateProduct } from '../Api/xano'

function AdminEditarProducto() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    brand: '',
    category: '',
    image: null
  })
  const [currentProduct, setCurrentProduct] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)

  // Cargar datos del producto
  useEffect(() => {
    async function loadProduct() {
      if (!id) return
      
      try {
        setLoading(true)
        const product = await fetchProductById(id)
        setCurrentProduct(product)
        
        // Llenar el formulario con los datos actuales
        setFormData({
          name: product.name || '',
          description: product.description || '',
          price: product.price || '',
          stock: product.stock || '',
          brand: product.brand || '',
          category: product.category || '',
          image: null
        })
        
        // Si ya tiene imagen, mostrar preview
        if (product.images && product.images.length > 0) {
          setImagePreview(product.images[0])
        }
        
      } catch (err) {
        console.error('Error cargando producto:', err)
        setMessage('❌ Error al cargar el producto')
      } finally {
        setLoading(false)
      }
    }
    
    loadProduct()
  }, [id])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    
    if (file) {
      console.log('📸 Nueva imagen seleccionada:', file.name)
      
      // Verificar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage('❌ La imagen es demasiado grande. Máximo 5MB.')
        return
      }
      
      const preview = URL.createObjectURL(file)
      setImagePreview(preview)
      setFormData(prev => ({ ...prev, image: file }))
    }
  }

  const removeImage = () => {
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview)
    }
    setFormData(prev => ({ ...prev, image: null }))
    setImagePreview(null)
    const fileInput = document.getElementById('image')
    if (fileInput) fileInput.value = ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.price || !formData.stock) {
      setMessage('❌ Por favor completa los campos requeridos')
      return
    }

    setLoading(true)
    setMessage('')
    
    try {
      // Preparar datos para actualizar
      const updates = {
        name: formData.name.trim(),
        description: formData.description.trim() || '',
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        brand: formData.brand.trim() || '',
        category: formData.category || '',
      }

      console.log('🔄 Actualizando producto...', updates)
      
      const result = await updateProduct(id, updates)
      console.log('✅ Producto actualizado:', result)
      
      setMessage('✅ Producto actualizado exitosamente!')
      
      // Redirigir después de 1 segundo
      setTimeout(() => {
        navigate('/admin/productos')
      }, 1000)
      
    } catch (err) {
      console.error('❌ Error actualizando producto:', err)
      setMessage('❌ Error al actualizar el producto: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading && !currentProduct) {
    return (
      <>
        <AdminMenu />
        <div className="main-content" style={{ marginLeft: '280px', minHeight: '100vh' }}>
          <div className="admin-header">
            <h1>Cargando producto...</h1>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <AdminMenu />
      <div className="main-content" style={{ marginLeft: '280px', minHeight: '100vh' }}>
        <div className="admin-header">
          <div>
            <h1>Editar Producto</h1>
            <p style={{ color: 'var(--gray-600)', margin: '0.5rem 0 0 0' }}>
              Modifica la información del producto
            </p>
          </div>
        </div>
        
        <main className="admin-content">
          <div className="card">
            <div className="card-header">
              <h3 style={{ margin: 0 }}>Información del Producto</h3>
              <small style={{ color: 'var(--gray-600)' }}>
                ID: {id}
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
                    disabled={loading}
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
                    disabled={loading}
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
                        min="0.01"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        style={{ paddingLeft: '2rem' }}
                        required
                        disabled={loading}
                      />
                    </div>
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
                      placeholder="0"
                      required
                      disabled={loading}
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
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="category">Categoría</label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      disabled={loading}
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
                  <label htmlFor="image">Imagen del Producto</label>
                  
                  {/* Mostrar imagen actual si existe */}
                  {currentProduct?.images?.[0] && !imagePreview && (
                    <div style={{ marginBottom: '1rem' }}>
                      <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)', marginBottom: '0.5rem' }}>
                        Imagen actual:
                      </p>
                      <img 
                        src={currentProduct.images[0]} // ← CAMBIAR images POR images[0]
                        alt="Actual"
                        style={{ 
                          width: '200px', 
                          height: '200px', 
                          objectFit: 'cover',
                          borderRadius: 'var(--border-radius-md)',
                          border: '2px solid var(--gray-300)'
                        }}
                      />
                    </div>
                  )}
                  
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={loading}
                    style={{ 
                      padding: '0.5rem',
                      border: '2px dashed var(--gray-300)',
                      borderRadius: 'var(--border-radius-md)',
                      backgroundColor: 'var(--gray-50)'
                    }}
                  />
                  <small style={{ color: 'var(--gray-500)', marginTop: '0.5rem', display: 'block' }}>
                    Selecciona una nueva imagen para reemplazar la actual
                  </small>
                  
                  {/* Preview de nueva imagen */}
                  {imagePreview && imagePreview.startsWith('blob:') && (
                    <div style={{ marginTop: '1rem' }}>
                      <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)', marginBottom: '0.5rem' }}>
                        Nueva imagen (se subirá cuando Xano lo permita):
                      </p>
                      <div style={{ position: 'relative', display: 'inline-block' }}>
                        <img 
                          src={imagePreview} 
                          alt="Nueva preview"
                          style={{ 
                            width: '200px', 
                            height: '200px', 
                            objectFit: 'cover',
                            borderRadius: 'var(--border-radius-md)',
                            border: '2px solid var(--success)'
                          }}
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          disabled={loading}
                          style={{
                            position: 'absolute',
                            top: '-10px',
                            right: '-10px',
                            background: 'var(--error)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '28px',
                            height: '28px',
                            fontSize: '16px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold'
                          }}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  )}
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
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="btn-primary" 
                    disabled={loading}
                    style={{ minWidth: '150px' }}
                  >
                    {loading ? 'Actualizando...' : 'Actualizar Producto'}
                  </button>
                </div>

                {message && (
                  <div 
                    className="message" 
                    style={{ 
                      marginTop: '1rem', 
                      padding: '0.75rem', 
                      borderRadius: 'var(--border-radius-md)',
                      backgroundColor: message.includes('❌') ? '#fef2f2' : '#f0fdf4',
                      color: message.includes('❌') ? 'var(--error)' : 'var(--success)',
                      textAlign: 'center',
                      fontWeight: '500',
                      border: message.includes('❌') ? '1px solid #fecaca' : '1px solid #bbf7d0'
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
export default AdminEditarProducto;