import React, { useState, useEffect } from 'react'
import Menu from './Partes/Menu'
import { Footer } from './Partes/Footer'
import { Link } from 'react-router-dom'

export default function Blogs() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedBlogId, setExpandedBlogId] = useState(null) // Estado para controlar la expansión

  // Simulación de carga de datos
  useEffect(() => {
    const fetchBlogs = async () => {
      // En una aplicación real, esto sería una llamada a la API
      setTimeout(() => {
        setBlogs([
          {
            id: 1,
            title: "¿Cómo elegir el mejor regalo?",
            excerpt: "Descubre consejos prácticos para seleccionar regalos que se adapten a los gustos de cada persona y dejen una impresión duradera.",
            fullText: "Elegir el regalo perfecto puede ser un desafío, pero con un poco de planificación, puedes encontrar algo que realmente sorprenda y deleite. Primero, piensa en los hobbies e intereses de la persona. ¿Le gusta la tecnología, la lectura, el deporte o la jardinería? Observa qué cosas le emocionan en su día a día. Un buen punto de partida es escuchar atentamente sus conversaciones; a menudo mencionan cosas que necesitan o desean. \n\nSegundo, considera experiencias en lugar de objetos. Un viaje de fin de semana, una cena en un restaurante exclusivo o una clase para aprender una nueva habilidad pueden crear recuerdos inolvidables que perduran mucho más que un objeto material. Finalmente, no subestimes el poder de un regalo personalizado. Un objeto con un grabado especial, un álbum de fotos cuidadosamente seleccionado o una pieza de arte hecha a medida demuestran un nivel de dedicación y afecto que lo convierte en algo verdaderamente único.",
            image: "/src/assets/images/Regalos.jpeg",
            date: "15 Mar 2025",
            category: "Consejos",
            author: "Ana Martínez",
            featured: true
          },
          {
            id: 2,
            title: "Novedades de la temporada",
            excerpt: "Conoce los lanzamientos más recientes y las tendencias que están marcando el mercado este año.",
            fullText: "Esta temporada viene cargada de innovaciones. En tecnología, los dispositivos plegables se consolidan como una opción real para el consumidor. En moda, los colores vibrantes y los tejidos sostenibles son los protagonistas. No te pierdas nuestra selección de productos que marcan tendencia y que están diseñados para mejorar tu día a día con estilo y funcionalidad.",
            image: "/src/assets/images/Calendario.jpeg",
            date: "12 Mar 2025",
            category: "Novedades",
            author: "Carlos López"
          },
          {
            id: 3,
            title: "Tips para comprar online en la tienda ",
            excerpt: "Aprende a proteger tus datos y a identificar tiendas confiables para una experiencia de compra segura.",
            fullText: "Comprar en línea es cómodo, pero la seguridad es primordial. Utiliza siempre conexiones seguras (busca el candado en la barra de direcciones), crea contraseñas robustas y únicas para cada tienda, y desconfía de ofertas que parezcan demasiado buenas para ser verdad. En MoKip, utilizamos encriptación de extremo a extremo y pasarelas de pago certificadas para garantizar que tu información esté siempre protegida.",
            image: "/src/assets/images/Compras.jpeg",
            date: "10 Mar 2025",
            category: "Compras",
            author: "María González"
          },
          {
            id: 4,
            title: "Devolucion de dinero",
            excerpt: "Aprende los siguientes paso para que puedas pedir una devolucion.",
            fullText: "Si no estás satisfecho con tu compra, nuestro proceso de devolución es sencillo. Tienes 30 días para solicitar una devolución desde tu panel de usuario. Simplemente selecciona el pedido, elige el producto a devolver y el motivo. Recibirás una etiqueta de envío prepagada para que nos envíes el producto sin coste alguno. Una vez recibido y verificado, procesaremos tu reembolso en un plazo de 3 a 5 días hábiles.",
            image: "/src/assets/images/Devolucion.jpg",
            date: "8 Mar 2025",
            category: "Sostenibilidad",
            author: "David Rodríguez"
          },
          {
            id: 5,
            title: "¿Como se manejaran tus datos?",
            excerpt: "Descubre el uso que le daremos tus datos y como estaran seguros .",
            fullText: "Tu privacidad es nuestra máxima prioridad. Los datos que nos proporcionas, como tu nombre, dirección y correo electrónico, se utilizan exclusivamente para procesar tus pedidos y mejorar tu experiencia de compra. Nunca compartiremos tu información con terceros sin tu consentimiento explícito. Todos los datos se almacenan en servidores seguros con múltiples capas de protección para garantizar su confidencialidad.",
            image: "/src/assets/images/Datos.jpg",
            date: "5 Mar 2025",
            category: "Tecnología",
            author: "Laura Sánchez"
          },
          {
            id: 6,
            title: "Guía completa de devoluciones y garantías",
            excerpt: "Todo lo que necesitas saber sobre políticas de devolución y cómo ejercer tus derechos como consumidor.",
            fullText: "Todos nuestros productos cuentan con una garantía de 2 años contra defectos de fabricación. Si tu producto presenta un fallo, contacta con nuestro servicio de atención al cliente y te guiaremos en el proceso de reparación o sustitución. Además, nuestra política de devoluciones te permite cambiar de opinión en los primeros 30 días. Queremos que tu compra sea 100% satisfactoria.",
            image: "/src/assets/images/Guia.webp",
            date: "1 Mar 2025",
            category: "Guías",
            author: "Pedro Gómez"
          }
        ])
        setLoading(false)
      }, 1000)
    }

    fetchBlogs()
  }, [])

  const featuredBlog = blogs.find(blog => blog.featured)
  const regularBlogs = blogs.filter(blog => !blog.featured)

  // Función para manejar la expansión/colapso de los blogs
  const handleToggleExpand = (blogId) => {
    setExpandedBlogId(prevId => (prevId === blogId ? null : blogId));
  };

  if (loading) {
    return (
      <>
        <Menu />
        <main className="blogs-main">
          <div className="container">
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Cargando artículos...</p>
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
      <main className="blogs-main">
        {/* Hero Section */}
        <section className="blogs-hero">
          <div className="container">
            <div className="hero-content">
              <h1 className="hero-title">
                Nuestro <span className="highlight">Blog</span>
              </h1>
              
              <div className="hero-stats">
                <div className="stat">
                  <span className="stat-number">{blogs.length}+</span>
                  <span className="stat-label">Artículos</span>
                </div>
                <div className="stat">
                  <span className="stat-number">5k+</span>
                  <span className="stat-label">Clientes</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container">
          {/* Blog Destacado */}
          {featuredBlog && (() => {
            const isFeaturedExpanded = expandedBlogId === featuredBlog.id;
            return (
            <section className="featured-blog">
              <div className={`featured-card ${isFeaturedExpanded ? 'expanded' : ''}`}>
                <div className="featured-image">
                  <img src={featuredBlog.image} alt={featuredBlog.title} />
                  <div className="featured-badge">Destacado</div>
                </div>
                <div className="featured-content">
                  <div className="blog-meta">
                    <span className="category featured-category">{featuredBlog.category}</span>
                    <span className="date">{featuredBlog.date}</span>
                    <span className="read-time">{featuredBlog.readTime} de lectura</span>
                  </div>
                  <h2 className="featured-title">{featuredBlog.title}</h2>
                  <p className="featured-excerpt">{isFeaturedExpanded ? featuredBlog.fullText : featuredBlog.excerpt}</p>
                  <div className="author-info">
                    <div className="author-avatar">
                      {featuredBlog.author.charAt(0)}
                    </div>
                    <span className="author-name">Por {featuredBlog.author}</span>
                  </div>
                  <button onClick={() => handleToggleExpand(featuredBlog.id)} className="btn-primary">
                    {isFeaturedExpanded ? 'Leer menos' : 'Leer artículo completo'}
                  </button>
                </div>
              </div>
            </section>
            )
          })()}

          {/* Grid de Blogs */}
          <section className="blogs-section">
            <h2 className="section-title">Últimos Artículos</h2>
            <div className="blogs-grid">
              {regularBlogs.map(blog => {
                const isExpanded = expandedBlogId === blog.id;
                return (
                <article key={blog.id} className={`blog-card ${isExpanded ? 'expanded' : ''}`}>
                  <div className="blog-image">
                    <img src={blog.image} alt={blog.title} />
                    <div className="category-badge">{blog.category}</div>
                  </div>
                  <div className="blog-content">
                    <div className="blog-meta">
                      <span className="date">{blog.date}</span>
                      <span className="read-time">{blog.readTime}</span>
                    </div>
                    <h3 className="blog-title">{blog.title}</h3>
                    <p className="blog-text">{isExpanded ? blog.fullText : blog.excerpt}</p>
                    <div className="blog-footer">
                      <div className="author">
                        <span>Por {blog.author}</span>
                      </div>
                      <button 
                        onClick={() => handleToggleExpand(blog.id)} 
                        className="btn-secondary"
                        style={{ 
                          padding: '0.25rem 0.75rem', 
                          fontSize: '0.8rem' 
                        }}>
                        {isExpanded ? 'Leer menos' : 'Leer más'}
                      </button>
                    </div>
                  </div>
                </article>
                )
              })}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}