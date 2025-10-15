import React from 'react'
import Menu from './Partes/Menu'
import { Link } from 'react-router-dom'
import products from '../data/products'

export const Productos = () => {
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

                    <div className="products-grid">
                        {products.map(p => (
                            <Link to={`/productos/${p.id}`} key={p.id} className="product-card">
                                <img 
                                    src={p.img || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'} 
                                    alt={p.title} 
                                    className="img-producto" 
                                />
                                <div className="product-info">
                                    <h3 className="product-title">{p.title}</h3>
                                    <p className="product-price">{p.price}</p>
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