import React from 'react'
import Menu from './Partes/Menu'
import { Link } from 'react-router-dom'
import products from '../data/products'

export const Productos = () => {
    return (
        <>
            <Menu />
            <div className="container">
                <h1 className="productos-title">PRODUCTOS</h1>

                <div className="productos-grid">
                    {products.map(p => (
                        <Link to={`/productos/${p.id}`} key={p.id} className="producto-card">
                            <img src={p.img} alt={p.title} className="img-producto" />
                            <h2>{p.title}</h2>
                            <p className="precio">{p.price}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Productos