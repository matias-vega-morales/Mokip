import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Menu from './Partes/Menu'
import { fetchProductById, fetchRelatedProducts } from '../Api/xano'

export default function ProductoDetalle() {
  const { id } = useParams()
  const [producto, setProducto] = useState(null)
  const [relacionados, setRelacionados] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError(null)

    fetchProductById(id)
      .then(data => {
        if (!mounted) return
        setProducto(data)
        // try to fetch related by category if available
        const category = data?.category || null
        if (category) {
          fetchRelatedProducts(category, 5).then(list => {
            if (!mounted) return
            setRelacionados(list.filter(p => String(p.id) !== String(id)))
          }).catch(() => {})
        }
      })
      .catch(err => {
        console.error(err)
        if (mounted) setError('No se pudo cargar el producto')
      })
      .finally(() => { if (mounted) setLoading(false) })

    return () => { mounted = false }
  }, [id])

  if (loading) return <main className="container">Cargando...</main>
  if (error) return <main className="container">{error}</main>
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
          <img src={producto.images?.[0] || producto.img || '/img/producto1.png'} alt={producto.name || producto.title} className="detalle-img-principal img-producto" />
          <div className="detalle-thumbs">
            {/* Thumbs estáticas por ahora */}
            {(producto.images || [producto.img]).slice(0,4).map((src, i) => (
              <img src={src} alt={`Miniatura ${i+1}`} key={i} className="thumb img-producto" />
            ))}
          </div>
        </div>

        <div className="detalle-info">
          <h1 className="detalle-titulo">{producto.name || producto.title}</h1>
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
          {relacionados.map(r => (
            <Link to={`/productos/${r.id}`} key={r.id} className="relacionado-card">
              <img src={r.images?.[0] || r.img} alt={r.name || r.title} className="img-producto" />
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
