import React, { useState, useEffect } from 'react'
import Menu from './Partes/Menu'
import { Footer } from './Partes/Footer'

export default function Blogs() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  // Simulación de carga de datos
  useEffect(() => {
    const fetchBlogs = async () => {
      // En una aplicación real, esto sería una llamada a la API
      setTimeout(() => {
        setBlogs([
          {
            id: 1,
            title: "¿Cómo elegir el mejor regalo?",
            excerpt: "Descubre consejos prácticos para seleccionar reaglos que se adapten a a los gustos de cada uno.",
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
            image: "/src/assets/images/Calendario.jpeg",
            date: "12 Mar 2025",
            
            category: "Novedades",
            author: "Carlos López"
          },
          {
            id: 3,
            title: "Tips para comprar online en la tienda ",
            excerpt: "Aprende a proteger tus datos y a identificar tiendas confiables para una experiencia de compra segura.",
            image: "/src/assets/images/Compras.jpeg",
            date: "10 Mar 2025",
           
            category: "Compras",
            author: "María González"
          },
          {
            id: 4,
            title: "Devolucion de dinero",
            excerpt: "Aprende los siguientes paso para que puedas pedir una devolucion.",
            image: "/src/assets/images/Devolucion.jpg",
            date: "8 Mar 2025",
            category: "Sostenibilidad",
            author: "David Rodríguez"
          },
          {
            id: 5,
            title: "¿Como se manejaran tus datos?",
            excerpt: "Descubre el uso que le daremos tus datos y como estaran seguros .",
            image: "/src/assets/images/Datos.jpg",
            date: "5 Mar 2025",
            category: "Tecnología",
            author: "Laura Sánchez"
          },
          {
            id: 6,
            title: "Guía completa de devoluciones y garantías",
            excerpt: "Todo lo que necesitas saber sobre políticas de devolución y cómo ejercer tus derechos como consumidor.",
            image: "/src/assets/images/Guia.webp",
            date: "1 Mar 202",
           
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
          {featuredBlog && (
            <section className="featured-blog">
              <div className="featured-card">
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
                  <p className="featured-excerpt">{featuredBlog.excerpt}</p>
                  <div className="author-info">
                    <div className="author-avatar">
                      {featuredBlog.author.charAt(0)}
                    </div>
                    <span className="author-name">Por {featuredBlog.author}</span>
                  </div>
                  <a href={`/blog/${featuredBlog.id}`} className="btn-primary">
                    Leer artículo completo
                  </a>
                </div>
              </div>
            </section>
          )}

          {/* Grid de Blogs */}
          <section className="blogs-section">
            <h2 className="section-title">Últimos Artículos</h2>
            <div className="blogs-grid">
              {regularBlogs.map(blog => (
                <article key={blog.id} className="blog-card">
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
                    <p className="blog-excerpt">{blog.excerpt}</p>
                    <div className="blog-footer">
                      <div className="author">
                        <span>Por {blog.author}</span>
                      </div>
                      <a href={`/blog/${blog.id}`} className="read-more">
                        Leer más →
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}