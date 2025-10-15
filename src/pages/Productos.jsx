import React, { useState, useEffect } from 'react'
import Menu from './Partes/Menu'
import { Link } from 'react-router-dom'
import { fetchProducts } from '../Api/xano'

export const Productos = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Cargar productos desde Xano
    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true)
                console.log('🔄 Cargando productos desde Xano...')
                const productsData = await fetchProducts()
                console.log('✅ Productos cargados:', productsData)
                
                // Asegurarse de que sea un array
                if (Array.isArray(productsData)) {
                    setProducts(productsData)
                } else {
                    console.warn('⚠️ Los datos no son un array:', productsData)
                    setProducts([])
                }
            } catch (err) {
                console.error('❌ Error cargando productos:', err)
                setError('Error al cargar los productos')
            } finally {
                setLoading(false)
            }
        }

        loadProducts()
    }, [])

    // Función para obtener la URL de la imagen
    const getImageUrl = (product) => {
        if (product.images && product.images[0]) {
            return product.images[0].url || product.images[0]
        }
        if (product.image) return product.image
        if (product.img) return product.img
        return 'https://es.wikipedia.org/wiki/No_%28canción_de_Meghan_Trainor%29#/media/Archivo:No_(single)_logo.png'
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
            <>
                <Menu />
                <div className="main-content">
                    <div className="container">
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                            <p className="mt-3">Cargando productos...</p>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    // Mostrar error
    if (error) {
        return (
            <>
                <Menu />
                <div className="main-content">
                    <div className="container">
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
                    </div>
                </div>
            </>
        )
    }

    // Si no hay productos
    if (products.length === 0) {
        return (
            <>
                <Menu />
                <div className="main-content">
                    <div className="container">
                        <div className="text-center mb-5">
                            <h1 className="productos-title">Nuestros Productos</h1>
                            <p style={{ color: 'var(--gray-600)', fontSize: '1.1rem' }}>
                                Descubre nuestra amplia gama de productos de alta calidad
                            </p>
                        </div>
                        <div className="text-center py-5">
                            <p>No hay productos disponibles en este momento.</p>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <Menu />
            <div className="main-content">
                <div className="container">
                    <div className="text-center mb-5">
                        <h1 className="productos-title">Nuestros Productos</h1>
                        <p style={{ color: 'var(--gray-600)', fontSize: '1.1rem' }}>
                            Descubre nuestra amplia gama de productos de alta calidad
                        </p>
                        <small style={{ color: 'var(--gray-500)' }}>
                            Mostrando {products.length} productos
                        </small>
                    </div>

                    <div className="products-grid">
                        {products.map(product => (
                            <Link 
                                to={`/productos/${product.id}`} 
                                key={product.id} 
                                className="product-card"
                            >
                                <img 
                                    src={getImageUrl(product)} 
                                    alt={getName(product)} 
                                    className="img-producto" 
                                    onError={(e) => {
                                        e.target.src = 'https://es.wikipedia.org/wiki/No_%28canción_de_Meghan_Trainor%29#/media/Archivo:No_(single)_logo.png'
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
                </div>
            </div>
        </>
    )
}

export default Productos