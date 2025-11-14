import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { CartProvider } from './pages/CartContext.jsx'
import './assets/styles/main.css'
import Productos from './pages/Productos.jsx'
import Home from './pages/Home.jsx'
import Blogs from './pages/Blogs.jsx'
import Contacto from './pages/Contacto.jsx'
import ProductoDetalle from './pages/ProductoDetalle.jsx'
import Carrito from './pages/Carrito.jsx'
import Login from './pages/Login.jsx'
import MisCompras from './pages/MisCompras.jsx'
import Registro from './pages/Partes/Registro.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import AdminProductos from './pages/AdminProductos.jsx'
import AdminCrearProducto from './pages/AdminCrearProducto.jsx'
import AdminVentas from './pages/AdminVentas.jsx'
import AdminUsuarios from './pages/AdminUsuarios.jsx'
import EditUsuario from './pages/Partes/EditUsuario.jsx'
import AdminEditarProducto from './pages/AdminEditarProducto.jsx'

function NoMatch() {
  const location = useLocation()
  return <div>No match — pathname: {location.pathname}</div>
}

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <CartProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="productos" element={<Productos />} />
        <Route path="productos/:id" element={<ProductoDetalle />} />
        <Route path="carrito" element={<Carrito />} />
        <Route path="login" element={<Login />} />
        <Route path="perfil/:id" element={<EditUsuario />} />
        <Route path="mis-compras" element={<MisCompras />} />
        <Route path="registro" element={<Registro />} />
        <Route path="admin/crear-usuario" element={<Registro />} />
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="admin/productos" element={<AdminProductos />} />
        <Route path="admin/crear-producto" element={<AdminCrearProducto />} />
        <Route path="admin/ventas" element={<AdminVentas />} />
        <Route path="admin/usuarios" element={<AdminUsuarios />} />
        <Route path="admin/editar-usuario/:id" element={<EditUsuario />} />
        <Route path="blogs" element={<Blogs />} />
        <Route path="contacto" element={<Contacto />} />
        <Route path="*" element={<NoMatch />} />
        <Route path="/admin/editar-producto/:id" element={<AdminEditarProducto />} />
      </Routes>
    </CartProvider>
  </BrowserRouter>
)