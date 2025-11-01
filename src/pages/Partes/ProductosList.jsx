// src/pages/Partes/ProductosList.jsx
import React from 'react'
import { Link } from 'react-router-dom'

export const ProductosList = ({ 
  products, 
  loading, 
  error, 
  title = "Nuestros Productos",
  subtitle = "Descubre nuestra amplia gama de productos de alta calidad",
  showCount = true,
  emptyMessage = "No hay productos disponibles en este momento.",
  loadingMessage = "Cargando productos...",
  gridClass = "products-grid",
  cardClass = "product-card"
}) => {
  
  // Función para obtener la URL de la imagen
  const getImageUrl = (product) => {
    if (product.images && product.images[0]) {
      return product.images[0].url || product.images[0]
    }
    if (product.image) return product.image
    if (product.img) return product.img
    return ''
  }

  // Función para obtener el nombre
  const getName = (product) => {
    return product.name || product.title || 'Producto sin nombre'
  }

  // Función para formatear precio
  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return `$${price.toFixed(2)}`
    }
    if (typeof price === 'string') {
      return price.includes('$') ? price : `$${price}`
    }
    return '$0.00'
  }

  // Mostrar loading
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">{loadingMessage}</p>
      </div>
    )
  }

  // Mostrar error
  if (error) {
    return (
      <div className="text-center py-5">
        <div className="alert alert-danger">
          {error}
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          Reintentar
        </button>
      </div>
    )
  }

  // Si no hay productos
  if (products.length === 0) {
    return (
      <div className="text-center py-5">
        <p>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <>
      <div className="text-center mb-5">
        <h1 className="productos-title">{title}</h1>
        <p style={{ color: 'var(--gray-600)', fontSize: '1.1rem' }}>
          {subtitle}
        </p>
        {showCount && (
          <small style={{ color: 'var(--gray-500)' }}>
            Mostrando {products.length} producto{products.length !== 1 ? 's' : ''}
          </small>
        )}
      </div>

      <div className={gridClass}>
        {products.map(product => (
          <Link 
            to={`/productos/${product.id}`} 
            key={product.id} 
            className={cardClass}
          >
            <img 
              src={getImageUrl(product)} 
              alt={getName(product)} 
              className="img-producto" 
              onError={(e) => {
                e.target.src = ''
              }}
            />
            <div className="product-info">
              <h3 className="product-title">{getName(product)}</h3>
              <p className="product-price">{formatPrice(product.price)}</p>
              <button className="add-to-cart">Ver Detalles</button>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}

export default ProductosList