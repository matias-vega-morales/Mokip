import React from 'react'
import { useParams, Link } from 'react-router-dom'
import products from '../data/products'
import Menu from './Partes/Menu'

export default function ProductoDetalle() {
  const { id } = useParams()
  const producto = products.find(p => String(p.id) === id)

  if (!producto) {
    return (
      <main className="container">
        <h1>Producto no encontrado</h1>
        <Link to="/productos">Volver a productos</Link>
      </main>
    )
  }

  return (

    <>
        <Menu />
        <div className="container detalle-container">
            <div className="detalle-galeria">
            <img src={producto.img} alt={producto.title} className="detalle-img-principal img-producto" />
            <div className="detalle-thumbs">
                {/* Thumbs estáticas por ahora */}
                <img src={producto.img} alt="Miniatura" className="thumb active img-producto" />
            </div>
            </div>

            <div className="detalle-info">
            <h1 className="detalle-titulo">{producto.title}</h1>
            <span className="detalle-precio">{producto.price}</span>
            <p className="detalle-desc">{producto.description}</p>

            <form className="detalle-form">
                <label htmlFor="cantidad">Cantidad</label>
                <input type="number" id="cantidad" name="cantidad" min="1" defaultValue={1} />
                <button type="button" className="btn-primary" id="btnAddCart">Añadir al carrito</button>
            </form>
            </div>
        </div>

        <div className="container relacionados-container">
            <h2>Productos relacionados</h2>
            <div className="relacionados-grid">
            {products.slice(0, 5).map(r => (
                <Link to={`/productos/${r.id}`} key={r.id} className="relacionado-card">
                <img src={r.img} alt={r.title} className="img-producto" />
                </Link>
            ))}
            </div>
        </div>
    </>
  )
}
