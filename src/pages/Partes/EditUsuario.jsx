import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import AdminMenu from './AdminMenu';
import Menu from './Menu';
import { Footer } from './Footer';
import { fetchUserById, updateUser } from '../../Api/xano';

export default function EditUsuario() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const isAdminView = location.pathname.startsWith('/admin');

  const [formData, setFormData] = useState({
    name: '',
    last_name: '',
    email: '',
    role: 'customer',
    status: 'active',
    phone: '',
    shipping_address: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const getCurrentUser = useCallback(() => {
    try {
      const authUser = localStorage.getItem('auth_user');
      return authUser ? JSON.parse(authUser) : null;
    } catch (err) {
      return null;
    }
  }, []);

  useEffect(() => {
    async function loadUserData() {
      if (!id) return;

      // Security Check: Ensure user is editing their own profile or is an admin
      const currentUser = getCurrentUser();
      if (!currentUser) {
        navigate('/login');
        return;
      }
      if (!isAdminView && currentUser.id.toString() !== id) {
        navigate('/'); // Redirect if trying to edit someone else's profile
        return;
      }

      try {
        setLoading(true);
        const userData = await fetchUserById(id);
        setFormData({
          name: userData.name || '',
          last_name: userData.last_name || '',
          email: userData.email || '',
          role: userData.role || 'customer',
          status: userData.status || 'active',
          phone: userData.phone || '',
          shipping_address: userData.shipping_address || ''
        });
      } catch (err) {
        setMessage('❌ Error al cargar los datos del usuario.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadUserData();
  }, [id, isAdminView, getCurrentUser, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setMessage('❌ El nombre y el email son obligatorios.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      let updates = { ...formData };
      if (!isAdminView) {
        // Users cannot change their own email, role, or status
        delete updates.email;
        delete updates.role;
        delete updates.status;
      }
      await updateUser(id, updates);

      if (!isAdminView) {
        const currentUser = getCurrentUser();
        localStorage.setItem('auth_user', JSON.stringify({ ...currentUser, ...updates }));
      }

      setMessage('✅ Usuario actualizado exitosamente!');
      if (isAdminView) setTimeout(() => navigate('/admin/usuarios'), 1500);
    } catch (err) {
      setMessage(`❌ Error al actualizar el usuario: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.name) {
    if (!isAdminView) {
      return (
        <>
          <Menu />
          <main className="container" style={{ padding: '2rem 0', textAlign: 'center' }}>
            <div className="spinner"></div>
            <p>Cargando tu perfil...</p>
          </main>
          <Footer />
        </>
      );
    }
    return (
      <>
        <AdminMenu />
        <div className="main-content" style={{ marginLeft: '280px' }}>
          <div className="admin-header"><h1>Cargando Usuario...</h1></div>
        </div>
      </>
    );
  }

  const pageTitle = isAdminView ? 'Editar Usuario' : 'Mi Perfil';
  const pageSubtitle = isAdminView ? 'Modifica los datos del usuario seleccionado.' : 'Actualiza tu información personal y de envío.';
  const mainContentStyle = isAdminView ? { marginLeft: '280px' } : {};
  const cardStyle = isAdminView ? {} : { maxWidth: '700px', margin: '0 auto' };

  return (
    <>
      {isAdminView ? <AdminMenu /> : <Menu />}
      <div className="main-content" style={mainContentStyle}>
        <div className="admin-header">
          <div>
            <h1>{pageTitle}</h1>
            <p style={{ color: 'var(--gray-600)' }}>{pageSubtitle}</p>
          </div>
        </div>

        <main className={isAdminView ? "admin-content" : "container"} style={{ padding: isAdminView ? '' : '2rem 0' }}>
          <div className="card" style={cardStyle}>
            <div className="card-header">
              <h3>Información de {formData.name} {formData.last_name}</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit} className="product-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Nombre *</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required disabled={loading} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="last_name">Apellido</label>
                    <input type="text" id="last_name" name="last_name" value={formData.last_name} onChange={handleInputChange} disabled={loading} />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email {isAdminView ? '*' : '(no se puede cambiar)'}</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required disabled={loading || !isAdminView} readOnly={!isAdminView} />
                </div>

                {isAdminView && (
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="role">Rol</label>
                      <select id="role" name="role" value={formData.role} onChange={handleInputChange} disabled={loading}>
                        <option value="customer">Cliente</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="status">Estado</label>
                      <select id="status" name="status" value={formData.status} onChange={handleInputChange} disabled={loading}>
                        <option value="active">Activo</option>
                        <option value="blocked">Bloqueado</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="phone">Teléfono</label>
                  <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} disabled={loading} />
                </div>

                <div className="form-group">
                  <label htmlFor="shipping_address">Dirección de Envío</label>
                  <textarea id="shipping_address" name="shipping_address" value={formData.shipping_address} onChange={handleInputChange} rows="3" disabled={loading} />
                </div>

                <div className="form-actions" style={{
                  display: 'flex',
                  gap: '1rem',
                  justifyContent: 'flex-end',
                  marginTop: '2rem',
                  paddingTop: '2rem',
                  borderTop: '1px solid var(--gray-200)'
                }}>
                  {isAdminView && (
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => navigate('/admin/usuarios')}
                      disabled={loading}
                    >
                      Cancelar
                    </button>
                  )}
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                    style={{ minWidth: '150px' }}
                  >
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                </div>

                {message && (
                  <div
                    className="message"
                    style={{
                      marginTop: '1rem',
                      padding: '0.75rem',
                      borderRadius: 'var(--border-radius-md)',
                      backgroundColor: message.includes('❌') ? '#fef2f2' : '#f0fdf4',
                      color: message.includes('❌') ? 'var(--error)' : 'var(--success)',
                      textAlign: 'center',
                      fontWeight: '500',
                      border: `1px solid ${message.includes('❌') ? '#fecaca' : '#bbf7d0'}`
                    }}
                  >
                    {message}
                  </div>
                )}
              </form>
            </div>
          </div>
        </main>
      </div>
      {!isAdminView && <Footer />}
    </>
  );
}