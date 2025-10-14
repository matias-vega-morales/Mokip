import React from 'react'
import Menu from './Partes/Menu'

export default function Contacto() {
  return (
    <>
      <Menu />
      <main className="contacto-main">
        <div className="contacto-hero">
          <img src="/assets/hero.jpg" alt="Imagen principal de la tienda" />
          <h1 className="contacto-title">Contáctanos</h1>
        </div>

        <div className="contacto-container">
          <form id="contactoForm" autoComplete="off">
            <h2>Formulario de Contactos</h2>
            <label htmlFor="nombre">Nombre completo</label>
            <input type="text" id="nombre" name="nombre" placeholder="Tu nombre" required />

            <label htmlFor="email">Correo</label>
            <input type="email" id="email" name="email" placeholder="usuario@ejemplo.com" required />

            <label htmlFor="comentario">Comentario</label>
            <textarea id="comentario" name="comentario" placeholder="Escribe tu mensaje..." maxLength={500} required />

            <button type="submit" className="btn-primary">Enviar mensaje</button>
          </form>

          <div id="contactoExito" className="contacto-exito" style={{ display: 'none' }}>
            Mensaje enviado con éxito
          </div>
        </div>
      </main>
    </>
  )
}
