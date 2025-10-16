import React, { useState } from 'react'
import Menu from './Partes/Menu'
import { Footer } from './Partes/Footer'

export default function Contacto() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El formato del email no es válido'
    }

    if (formData.telefono && !/^\+?[\d\s-()]{10,}$/.test(formData.telefono)) {
      newErrors.telefono = 'El formato del teléfono no es válido'
    }

    if (!formData.asunto.trim()) {
      newErrors.asunto = 'El asunto es obligatorio'
    }

    if (!formData.mensaje.trim()) {
      newErrors.mensaje = 'El mensaje es obligatorio'
    } else if (formData.mensaje.length < 10) {
      newErrors.mensaje = 'El mensaje debe tener al menos 10 caracteres'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simulación de envío del formulario
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Aquí iría la llamada real a la API
      console.log('Datos del formulario:', formData)
      
      setIsSubmitted(true)
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        asunto: '',
        mensaje: ''
      })
    } catch (error) {
      console.error('Error al enviar el formulario:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: '📧',
      title: 'Email',
      value: 'Mokito@gamil.com',
      link: 'mailto:Mokito@gmail.com'
    },
    {
      icon: '📞',
      title: 'Teléfono',
      value: '+56 2356 6574',
      link: 'tel:+15551234567'
    },
    {
      icon: '📍',
      title: 'Dirección',
      value: 'Av. Principal 123, Ciudad, País',
      link: 'https://maps.google.com'
    },
    {
      icon: '🕒',
      title: 'Horario',
      value: 'Lun-Vie: 9:00 - 18:00 Sav-Dom 9:00 - 14:00',
      link: null
    }
  ]

  const faqs = [
    {
      pregunta: "¿Cuánto tiempo tardan en responder?",
      respuesta: "Normalmente respondemos en menos de 24 horas durante días laborables."
    },
    {
      pregunta: "¿Ofrecen soporte técnico?",
      respuesta: "Sí, nuestro equipo de soporte está disponible para ayudarte con cualquier problema técnico."
    },
    {
      pregunta: "¿Puedo solicitar un presupuesto?",
      respuesta: "Por supuesto, contáctanos con los detalles de tu proyecto y te enviaremos un presupuesto personalizado."
    }
  ]

  if (isSubmitted) {
    return (
      <>
        <Menu />
        <main className="contacto-main">
          <div className="contacto-success">
            <div className="success-container">
              <div className="success-icon">✅</div>
              <h1>¡Mensaje Enviado con Éxito!</h1>
              <p>
                Hemos recibido tu mensaje y nos pondremos en contacto contigo 
                en las próximas 24 horas. Mientras tanto, puedes explorar 
                nuestras preguntas frecuentes.
              </p>
              <div className="success-actions">
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="btn-primary"
                >
                  Enviar otro mensaje
                </button>
                <a href="/" className="btn-secondary">
                  Volver al inicio
                </a>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Menu />
      <main className="contacto-main">
        {/* Hero Section */}
        <section className="contacto-hero">
          <div className="hero-background">
            <div className="hero-overlay"></div>
            <img 
              src="/assets/contact-hero.jpg" 
              alt="Equipo de atención al cliente" 
              className="hero-image"
            />
          </div>
          <div className="hero-content">
            <h1 className="hero-title">
              Estamos aquí para <span className="highlight">ayudarte</span>
            </h1>
            <p className="hero-subtitle">
              ¿Tienes preguntas, sugerencias o necesitas asistencia? 
              Nuestro equipo está listo para escucharte y brindarte la mejor atención.
            </p>
          </div>
        </section>

        <div className="container">
          <div className="contacto-grid">
            {/* Información de Contacto */}
            <div className="contacto-info">
              <div className="info-card">
                <h2>Información de Contacto</h2>
                <p className="info-description">
                  No dudes en contactarnos a través de cualquiera de estos medios. 
                  Estamos comprometidos a proporcionarte la mejor experiencia.
                </p>
                
                <div className="contact-methods">
                  {contactInfo.map((item, index) => (
                    <div key={index} className="contact-method">
                      <div className="method-icon">{item.icon}</div>
                      <div className="method-info">
                        <h3>{item.title}</h3>
                        {item.link ? (
                          <a href={item.link} className="method-link">
                            {item.value}
                          </a>
                        ) : (
                          <span>{item.value}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="social-links">
                  <h3>Síguenos en redes sociales</h3>
                  <div className="social-icons">
                    <a href="#" className="social-link" aria-label="Facebook">
                      📘
                    </a>
                    <a href="#" className="social-link" aria-label="Twitter">
                      🐦
                    </a>
                    <a href="#" className="social-link" aria-label="Instagram">
                      📷
                    </a>
                    <a href="#" className="social-link" aria-label="LinkedIn">
                      💼
                    </a>
                  </div>
                </div>
              </div>

              {/* FAQs */}
              <div className="faq-section">
                <h2>Preguntas Frecuentes</h2>
                <div className="faq-list">
                  {faqs.map((faq, index) => (
                    <div key={index} className="faq-item">
                      <h3>{faq.pregunta}</h3>
                      <p>{faq.respuesta}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Formulario de Contacto */}
            <div className="contacto-form-container">
              <form 
                id="contactoForm" 
                className="contacto-form"
                onSubmit={handleSubmit}
                noValidate
              >
                <div className="form-header">
                  <h2>Envíanos un Mensaje</h2>
                  <p>Completa el formulario y te responderemos a la brevedad.</p>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="nombre" className="form-label">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      placeholder="Tu nombre completo"
                      className={errors.nombre ? 'input-error' : ''}
                      required
                    />
                    {errors.nombre && (
                      <span className="error-message">{errors.nombre}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      Correo electrónico *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="usuario@ejemplo.com"
                      className={errors.email ? 'input-error' : ''}
                      required
                    />
                    {errors.email && (
                      <span className="error-message">{errors.email}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="telefono" className="form-label">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      placeholder="+1 (555) 123-4567"
                      className={errors.telefono ? 'input-error' : ''}
                    />
                    {errors.telefono && (
                      <span className="error-message">{errors.telefono}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="asunto" className="form-label">
                      Asunto *
                    </label>
                    <select
                      id="asunto"
                      name="asunto"
                      value={formData.asunto}
                      onChange={handleChange}
                      className={errors.asunto ? 'input-error' : ''}
                      required
                    >
                      <option value="">Selecciona un asunto</option>
                      <option value="soporte">Soporte técnico</option>
                      <option value="ventas">Consulta de ventas</option>
                      <option value="facturacion">Facturación</option>
                      <option value="sugerencia">Sugerencia</option>
                      <option value="otros">Otros</option>
                    </select>
                    {errors.asunto && (
                      <span className="error-message">{errors.asunto}</span>
                    )}
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="mensaje" className="form-label">
                      Mensaje *
                    </label>
                    <textarea
                      id="mensaje"
                      name="mensaje"
                      value={formData.mensaje}
                      onChange={handleChange}
                      placeholder="Describe tu consulta o mensaje..."
                      rows="6"
                      maxLength={500}
                      className={errors.mensaje ? 'input-error' : ''}
                      required
                    />
                    <div className="textarea-footer">
                      <span className="char-count">
                        {formData.mensaje.length}/500 caracteres
                      </span>
                    </div>
                    {errors.mensaje && (
                      <span className="error-message">{errors.mensaje}</span>
                    )}
                  </div>
                </div>

                <button 
                  type="submit" 
                  className={`btn-primary submit-btn ${isSubmitting ? 'loading' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner"></div>
                      Enviando...
                    </>
                  ) : (
                    'Enviar mensaje'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}