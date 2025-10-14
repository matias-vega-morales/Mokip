import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Productos from './pages/Productos.jsx'
import Home from './pages/Home.jsx'
import Blogs from './pages/Blogs.jsx'
import Contacto from './pages/Contacto.jsx'
import ProductoDetalle from './pages/ProductoDetalle.jsx'

function NoMatch() {
  const location = useLocation()
  return <div>No match — pathname: {location.pathname}</div>
}

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
  <Route path="/" element={<Home />} />
  <Route path="productos" element={<Productos />} />
  <Route path="productos/:id" element={<ProductoDetalle />} />
  <Route path="blogs" element={<Blogs />} />
  <Route path="contacto" element={<Contacto />} />
  <Route path="*" element={<NoMatch />} />
    </Routes>
  </BrowserRouter>
)
