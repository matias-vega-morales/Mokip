import React, { useState, useEffect, useCallback, useMemo } from 'react'
import Menu from './Partes/Menu'
import { Link } from 'react-router-dom'
import { fetchProducts } from '../Api/xano'

// Componente de carga mejorado
const LoadingSpinner = () => (
  <div className="text-center py-5">
    <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
      <span className="visually-hidden">Cargando...</span>
    </div>
    <p className="mt-3 text-muted">Cargando productos...</p>
  </div>
)

// Componente de error mejorado
const ErrorMessage = ({ error, onRetry }) => (
  <div className="text-center py-5">
    <div className="alert alert-danger d-inline-block">
      <i className="fas fa-exclamation-triangle me-2"></i>
      {error}
    </div>
    <div className="mt-3">
      <button 
        className="btn btn-primary me-2"
        onClick={onRetry}
      >
        <i className="fas fa-redo me-2"></i>
        Reintentar
      </button>
      <Link to="/" className="btn btn-secondary">
        <i className="fas fa-home me-2"></i>
        Volver al inicio
      </Link>
    </div>
  </div>
)

// Componente de barra de búsqueda
const SearchBar = ({ searchTerm, onSearchChange, onClearSearch }) => (
  <div className="search-bar">
    <div className="search-input-container">
      <i className="fas fa-search search-icon"></i>
      <input
        type="text"
        placeholder="Buscar productos..."
        value={searchTerm}
        onChange={onSearchChange}
        className="search-input"
      />
      {searchTerm && (
        <button 
          className="clear-search-btn"
          onClick={onClearSearch}
          aria-label="Limpiar búsqueda"
        >
          <i className="fas fa-times"></i>
        </button>
      )}
    </div>
  </div>
)

// Componente de filtros de categoría
const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
  const categories = [
    { id: 'all', name: 'Todas las categorías', icon: 'fas fa-grid' },
    { id: 'tecnologia', name: 'Tecnología', icon: 'fas fa-laptop' },
    { id: 'hogar', name: 'Hogar', icon: 'fas fa-home' },
    { id: 'deportes', name: 'Deportes', icon: 'fas fa-running' },
    { id: 'moda', name: 'Moda', icon: 'fas fa-tshirt' },
    { id: 'libros', name: 'Libros', icon: 'fas fa-book' },
    { id: 'otros', name: 'Otros', icon: 'fas fa-ellipsis-h' }
  ]

  return (
    <div className="category-filter">
      <div className="category-scroll">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => onCategoryChange(category.id)}
          >
            <i className={category.icon}></i>
            <span>{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// Componente de producto individual
const ProductCard = React.memo(({ product }) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const imageUrl = useMemo(() => {
    if (product.images && product.images[0]) {
      return product.images[0].url || product.images[0]
    }
    if (product.image) return product.image
    if (product.img) return product.img
    return ''
  }, [product])

  const productName = useMemo(() => 
    product.name || product.title || 'Producto sin nombre'
  , [product])

  const formattedPrice = useMemo(() => {
    const price = product.price
    if (typeof price === 'number') {
      return `$${price.toFixed(2)}`
    }
    if (typeof price === 'string') {
      return price.includes('$') ? price : `$${price}`
    }
    return '$0.00'
  }, [product.price])

  const productCategory = useMemo(() => 
    product.category || product.categoria || 'otros'
  , [product])

  const handleImageError = useCallback(() => {
    setImageError(true)
    setImageLoading(false)
  }, [])

  const handleImageLoad = useCallback(() => {
    setImageLoading(false)
  }, [])

  const getCategoryIcon = (category) => {
    const icons = {
      tecnologia: 'fas fa-laptop',
      hogar: 'fas fa-home',
      deportes: 'fas fa-running',
      moda: 'fas fa-tshirt',
      libros: 'fas fa-book',
      otros: 'fas fa-ellipsis-h'
    }
    return icons[category] || icons.otros
  }

  return (
    <Link 
      to={`/productos/${product.id}`} 
      className="product-card fade-in"
    >
      <div className="product-image-container">
        {imageLoading && (
          <div className="image-placeholder">
            <div className="spinner-border spinner-border-sm text-primary" role="status">
              <span className="visually-hidden">Cargando imagen...</span>
            </div>
          </div>
        )}
        {!imageError && imageUrl ? (
          <img 
            src={imageUrl} 
            alt={productName}
            className={`img-producto ${imageLoading ? 'loading' : 'loaded'}`}
            onError={handleImageError}
            onLoad={handleImageLoad}
            loading="lazy"
          />
        ) : (
          <div className="image-placeholder">
            <i className="fas fa-image text-muted"></i>
            <span>Imagen no disponible</span>
          </div>
        )}
        
        {/* Badge de categoría */}
        <div className="product-category-badge">
          <i className={getCategoryIcon(productCategory)}></i>
          <span>{productCategory}</span>
        </div>
      </div>
      
      <div className="product-info">
        <h3 className="product-title" title={productName}>
          {productName}
        </h3>
        <p className="product-price">{formattedPrice}</p>
        <button className="add-to-cart">
          <i className="fas fa-eye me-2"></i>
          Ver Detalles
        </button>
      </div>
    </Link>
  )
})

ProductCard.displayName = 'ProductCard'

export const Productos = () => {
    const [products, setProducts] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [retryCount, setRetryCount] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')

    // Cargar productos desde Xano
    const loadProducts = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            console.log('🔄 Cargando productos desde Xano...')
            
            const productsData = await fetchProducts()
            console.log('✅ Productos cargados:', productsData)
            
            // Validación más robusta de los datos
            if (Array.isArray(productsData)) {
                const validProducts = productsData.filter(product => 
                    product && product.id && (product.name || product.title)
                )
                setProducts(validProducts)
                
                if (validProducts.length === 0) {
                    console.warn('⚠️ No se encontraron productos válidos')
                }
            } else {
                console.warn('⚠️ Los datos no son un array:', productsData)
                setProducts([])
                throw new Error('Formato de datos inválido')
            }
        } catch (err) {
            console.error('❌ Error cargando productos:', err)
            const errorMessage = err.message || 'Error al cargar los productos'
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        loadProducts()
    }, [loadProducts, retryCount])

    // Filtrar productos basado en búsqueda y categoría
    useEffect(() => {
        if (products.length === 0) {
            setFilteredProducts([])
            return
        }

        let filtered = products

        // Filtrar por categoría
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(product => {
                const category = product.category || product.categoria || 'otros'
                return category.toLowerCase() === selectedCategory.toLowerCase()
            })
        }

        // Filtrar por término de búsqueda
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase().trim()
            filtered = filtered.filter(product => {
                const name = product.name || product.title || ''
                const description = product.description || product.descripcion || ''
                const category = product.category || product.categoria || ''
                
                return (
                    name.toLowerCase().includes(term) ||
                    description.toLowerCase().includes(term) ||
                    category.toLowerCase().includes(term)
                )
            })
        }

        setFilteredProducts(filtered)
    }, [products, searchTerm, selectedCategory])

    const handleSearchChange = useCallback((e) => {
        setSearchTerm(e.target.value)
    }, [])

    const handleClearSearch = useCallback(() => {
        setSearchTerm('')
    }, [])

    const handleCategoryChange = useCallback((category) => {
        setSelectedCategory(category)
    }, [])

    const handleRetry = useCallback(() => {
        setRetryCount(prev => prev + 1)
        setSearchTerm('')
        setSelectedCategory('all')
    }, [])

    // Estadísticas para mostrar
    const stats = useMemo(() => {
        return {
            total: products.length,
            filtered: filteredProducts.length,
            hasFilters: searchTerm || selectedCategory !== 'all'
        }
    }, [products.length, filteredProducts.length, searchTerm, selectedCategory])

    // Mostrar loading
    if (loading && products.length === 0) {
        return (
            <>
                <Menu />
                <div className="main-content">
                    <div className="container">
                        <LoadingSpinner />
                    </div>
                </div>
            </>
        )
    }

    // Mostrar error
    if (error && products.length === 0) {
        return (
            <>
                <Menu />
                <div className="main-content">
                    <div className="container">
                        <ErrorMessage error={error} onRetry={handleRetry} />
                    </div>
                </div>
            </>
        )
    }

    return (
        <div className="products-page"> {/* CLASE AGREGADA AQUÍ */}
            <Menu />
            
            {/* Hero Section compacta */}
            <section className="products-hero">
                <div className="container">
                    <div className="hero-content">
                        <h1 className="hero-title">
                            Nuestros <span className="highlight">Productos</span>
                        </h1>
                        <p className="hero-subtitle">
                            Descubre nuestra amplia gama de productos de alta calidad
                        </p>
                    </div>
                </div>
            </section>

            <div className="main-content">
                <div className="container">
                    {/* Barra de búsqueda y filtros */}
                    <div className="products-filters-section">
                        <div className="filters-header">
                            <SearchBar 
                                searchTerm={searchTerm}
                                onSearchChange={handleSearchChange}
                                onClearSearch={handleClearSearch}
                            />
                            
                            {/* Contador de productos */}
                            <div className="filters-info">
                                <div className="products-count">
                                    <span className="count-number">{stats.filtered}</span>
                                    <span className="count-label">
                                        {stats.filtered === 1 ? 'producto encontrado' : 'productos encontrados'}
                                        {stats.hasFilters && ` de ${stats.total}`}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <CategoryFilter 
                            selectedCategory={selectedCategory}
                            onCategoryChange={handleCategoryChange}
                        />
                    </div>

                    {/* Información del estado de carga */}
                    {loading && products.length > 0 && (
                        <div className="d-flex justify-content-center align-items-center mb-3">
                            <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                                <span className="visually-hidden">Actualizando...</span>
                            </div>
                            <small className="text-muted">Actualizando productos...</small>
                        </div>
                    )}

                    {/* Grid de productos */}
                    {filteredProducts.length > 0 ? (
                        <div className="products-grid">
                            {filteredProducts.map(product => (
                                <ProductCard 
                                    key={product.id} 
                                    product={product} 
                                />
                            ))}
                        </div>
                    ) : (
                        !loading && (
                            <div className="text-center py-5">
                                <div className="empty-state">
                                    <i className="fas fa-search fa-3x text-muted mb-3"></i>
                                    <h4 className="text-muted">
                                        {stats.hasFilters ? 'No se encontraron productos' : 'No hay productos disponibles'}
                                    </h4>
                                    <p className="text-muted">
                                        {stats.hasFilters 
                                            ? 'Intenta con otros términos de búsqueda o categorías.'
                                            : 'Vuelve a intentarlo más tarde o contacta con soporte.'
                                        }
                                    </p>
                                    {stats.hasFilters && (
                                        <button 
                                            className="btn btn-primary mt-2"
                                            onClick={() => {
                                                setSearchTerm('')
                                                setSelectedCategory('all')
                                            }}
                                        >
                                            <i className="fas fa-times me-2"></i>
                                            Mostrar todos los productos
                                        </button>
                                    )}
                                    <button 
                                        className="btn btn-secondary mt-2 ms-2"
                                        onClick={handleRetry}
                                    >
                                        <i className="fas fa-redo me-2"></i>
                                        Reintentar
                                    </button>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div> // CIERRE DE LA CLASE products-page - SIN </div> EXTRA
    )
}

export default Productos