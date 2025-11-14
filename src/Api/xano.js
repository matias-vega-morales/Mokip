// src/Api/xano.js

// 🔹 URLs COMPLETAS de Xano
const AUTH_BASE_URL = 'https://x8ki-letl-twmt.n7.xano.io/api:HJwsqpRg';
const BASE_URL = 'https://x8ki-letl-twmt.n7.xano.io/api:fOtP60Ek';

console.log('🔄 URLs configuradas en xano.js:');
console.log('AUTH_BASE_URL:', AUTH_BASE_URL);
console.log('BASE_URL:', BASE_URL);

// 🔹 Token storage
const TOKEN_KEY = 'auth_token';
export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || '';
}
export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// 🔹 AUTENTICACIÓN
export async function login({ email, password }) {
  try {
    const URL_COMPLETA = 'https://x8ki-letl-twmt.n7.xano.io/api:HJwsqpRg/auth/login';
    console.log('🎯 Enviando login a Xano...');
    
    const requestBody = {
      email: email,
      password: password
    };
    
    console.log('📦 Request body para Xano:', requestBody);
    
    const response = await fetch(URL_COMPLETA, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
    
    console.log('📊 Status:', response.status);
    
    const responseText = await response.text();
    console.log('📄 Response COMPLETA de Xano:', responseText);
    
    if (!response.ok) {
      console.error('❌ Error HTTP:', response.status);
      throw new Error(`Error en login: ${response.status} - ${responseText}`);
    }
    
    const data = JSON.parse(responseText);
    console.log('✅ Login exitoso - Datos COMPLETOS:', data);
    
    console.log('🔑 Token recibido:', data.authToken ? 'SÍ' : 'NO');
    console.log('👤 Datos del usuario:', data.user);
    if (data.user) {
      console.log('🔍 Campos del usuario:', Object.keys(data.user));
    }
    
    const { authToken } = data || {};
    if (!authToken) {
      throw new Error('No se recibió token de autenticación');
    }

    setToken(authToken);
    
    return { 
      token: authToken, 
      user: data.user || { email: email }
    };
    
  } catch (err) {
    console.error('❌ Error completo en login:', err);
    throw err;
  }
}

export async function signup({ name, last_name, email, password, status }) {
  try {
    const URL_COMPLETA = 'https://x8ki-letl-twmt.n7.xano.io/api:HJwsqpRg/auth/signup';
    console.log('📝 Intentando registro en Xano...');
    
    const requestBody = {
      name: name,
      last_name: last_name,
      email: email,
      password: password,
      status: status // Añadimos el estado al cuerpo de la petición
    };
    
    console.log('📦 Signup body para Xano:', requestBody);
    
    const response = await fetch(URL_COMPLETA, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
    
    console.log('📊 Status signup:', response.status);
    
    const responseText = await response.text();
    console.log('📄 Response signup:', responseText);
    
    if (!response.ok) {
      throw new Error(`Error en registro: ${response.status} - ${responseText}`);
    }
    
    const data = JSON.parse(responseText);
    console.log('✅ Signup exitoso:', data);
    
    const { authToken } = data || {};
    if (!authToken) throw new Error('No se recibió authToken');

    setToken(authToken);
    
    return data; // Devolver el objeto completo de Xano
  } catch (err) {
    console.error('❌ Error en signup:', err);
    throw err;
  }
}

export async function getCurrentUser() {
  const token = getToken();
  if (!token) {
    console.log('🔐 No hay token, usuario no autenticado');
    return null;
  }
  
  try {
    const response = await fetch('https://x8ki-letl-twmt.n7.xano.io/api:HJwsqpRg/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}`);
    }
    
    const userData = await response.json();
    return userData;
  } catch (err) {
    console.error('❌ Error obteniendo usuario:', err);
    return null;
  }
}

// 🔹 PRODUCTOS 
export async function fetchProducts(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const url = `${BASE_URL}/product${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
  return await response.json();
}

export async function fetchProductById(id) {
  const response = await fetch(`${BASE_URL}/product/${id}`);
  if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
  return await response.json();
}

export async function fetchRelatedProducts(category, limit = 5) {
  try {
    const queryString = new URLSearchParams({ 
      category: category,
      limit: limit 
    }).toString();
    
    const url = `${BASE_URL}/product?${queryString}`;
    console.log('🔍 Buscando productos relacionados:', url);
    
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
    
    const data = await response.json();
    console.log('✅ Productos relacionados encontrados:', data.length);
    return data;
  } catch (err) {
    console.error('❌ Error buscando productos relacionados:', err);
    return [];
  }
}

export async function createProduct(productData) {
  try {
    console.log('📦 Enviando datos del producto:', productData);
    
    // Crear FormData para enviar archivos
    const formData = new FormData();
    
    // Agregar campos de texto
    formData.append('name', productData.name);
    formData.append('description', productData.description || '');
    formData.append('price', productData.price.toString());
    formData.append('stock', productData.stock.toString());
    formData.append('brand', productData.brand || '');
    formData.append('category', productData.category || '');
    
    // Agregar SOLO LA PRIMERA imagen (Xano probablemente espera una sola)
    if (productData.images && productData.images.length > 0) {
      formData.append('images', productData.images[0]);
      console.log(`🖼️ Enviando imagen:`, productData.images[0].name);
    } else {
      console.log('ℹ️ No se enviarán imágenes');
    }
    
    const response = await fetch(`${BASE_URL}/product`, {
      method: 'POST',
      // NO incluir 'Content-Type' - se establece automáticamente con FormData
      body: formData
    });
    
    console.log('📊 Status de respuesta:', response.status);
    console.log('📋 Response OK:', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error del servidor:', errorText);
      throw new Error(`Error HTTP ${response.status}: ${errorText}`);
    }
    
    const result = await response.json();
    console.log('✅ Producto creado exitosamente:', result);
    return result;
    
  } catch (err) {
    console.error('❌ Error creando producto:', err);
    throw err;
  }
}

// 🔹 ACTUALIZAR PRODUCTO
export async function updateProduct(productId, updates) {
  try {
    console.log('🔄 Actualizando producto:', productId, updates);
    
    const response = await fetch(`${BASE_URL}/product/${productId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates)
    });
    
    console.log('📊 Status de actualización:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error HTTP ${response.status}: ${errorText}`);
    }
    
    const result = await response.json();
    console.log('✅ Producto actualizado exitosamente:', result);
    return result;
    
  } catch (err) {
    console.error('❌ Error actualizando producto:', err);
    throw err;
  }
}

// 🔹 ELIMINAR PRODUCTO
export async function deleteProduct(productId) {
  try {
    console.log('🗑️ Eliminando producto:', productId);
    
    const response = await fetch(`${BASE_URL}/product/${productId}`, {
      method: 'DELETE'
    });
    
    console.log('📊 Status de eliminación:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error HTTP ${response.status}: ${errorText}`);
    }
    
    console.log('✅ Producto eliminado exitosamente');
    return true;
    
  } catch (err) {
    console.error('❌ Error eliminando producto:', err);
    throw err;
  }
}

// 🔹 CARRITO
export async function fetchCartByUser(userId) {
  const response = await fetch(`${BASE_URL}/cart?user_id=${userId}`);
  if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
  return await response.json();
}

export async function fetchCartItems(cartId) {
  const response = await fetch(`${BASE_URL}/cart_item?cart_id=${cartId}`);
  if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
  return await response.json();
}

export async function addCartItem(cartId, productId, quantity = 1) {
  const response = await fetch(`${BASE_URL}/cart_item`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      cart_id: cartId,
      product_id: productId,
      quantity: quantity
    })
  });
  if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
  return await response.json();
}

export async function updateCartItem(itemId, updates) {
  const response = await fetch(`${BASE_URL}/cart_item/${itemId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates)
  });
  if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
  return await response.json();
}

export async function deleteCartItem(itemId) {
  const response = await fetch(`${BASE_URL}/cart_item/${itemId}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
  return await response.json();
}

// 🔹 USUARIOS
export async function fetchUsers() {
  const response = await fetch(`${BASE_URL}/user`);
  if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
  return await response.json();
}

export async function fetchUserById(userId) {
  const response = await fetch(`${BASE_URL}/user/${userId}`);
  if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
  return await response.json();
}

export async function updateUser(userId, updates) {
  try {
    const token = getToken();
    console.log('🔄 Actualizando usuario:', userId, updates);
    console.log('🔑 Usando token:', token ? 'SÍ' : 'NO');
    console.log('🔍 ID del usuario:', userId);
    
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Usar el endpoint PATCH según la configuración de Xano: PATCH user/{user_id}
    const endpoint = `${BASE_URL}/user/${userId}`;
    console.log('🔍 Intentando PATCH en:', endpoint);
    
    const response = await fetch(endpoint, {
      method: 'PATCH',
      headers: headers,
      body: JSON.stringify(updates)
    });
    
    console.log('📊 Status:', response.status);
    
    if (!response.ok) {
      // Si PATCH falla, intentar con PUT como alternativa
      if (response.status === 404 || response.status === 405) {
        console.log('🔄 PATCH falló, intentando con PUT...');
        const putResponse = await fetch(endpoint, {
          method: 'PUT',
          headers: headers,
          body: JSON.stringify(updates)
        });
        
        if (putResponse.ok) {
          const result = await putResponse.json();
          console.log('✅ Usuario actualizado exitosamente con PUT:', result);
          return result;
        }
        
        const errorText = await putResponse.text();
        throw new Error(`Error HTTP ${putResponse.status}: ${errorText}`);
      }
      
      const errorText = await response.text();
      throw new Error(`Error HTTP ${response.status}: ${errorText}`);
    }
    
    const result = await response.json();
    console.log('✅ Usuario actualizado exitosamente con PATCH:', result);
    return result;
    
  } catch (err) {
    console.error('❌ Error actualizando usuario:', err);
    throw err;
  }
}

export async function createUser(userData) {
  try {
    const token = getToken(); // Un admin debe estar autenticado para crear usuarios
    const response = await fetch(`${BASE_URL}/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error HTTP ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (err) {
    console.error('Error creando usuario:', err);
    throw err;
  }
}

export async function deleteUser(userId) {
  try {
    const token = getToken();
    console.log('🗑️ Eliminando usuario:', userId);
    console.log('🔑 Usando token:', token ? 'SÍ' : 'NO');
    console.log('🔍 ID del usuario:', userId);
    
    const headers = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Usar el endpoint DELETE según la configuración de Xano: DELETE user/{user_id}
    const endpoint = `${BASE_URL}/user/${userId}`;
    console.log('🔍 Intentando DELETE en:', endpoint);
    
    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers: headers
    });
    
    console.log('📊 Status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error HTTP ${response.status}: ${errorText}`);
    }
    
    console.log('✅ Usuario eliminado exitosamente');
    return true;
    
  } catch (err) {
    console.error('❌ Error eliminando usuario:', err);
    throw err;
  }
}

// 🔹 ÓRDENES
export async function fetchOrders() {
  const response = await fetch(`${BASE_URL}/order`);
  if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
  return await response.json();
}

export async function createOrder(orderData) {
  const response = await fetch(`${BASE_URL}/order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData)
  });
  if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
  return await response.json();
}

export async function fetchOrderItems() {
  const response = await fetch(`${BASE_URL}/order_item`);
  if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
  return await response.json();
}

export async function addOrderItem(orderItemData) {
  try {
    console.log('📦 Creando item de orden:', orderItemData);
    const response = await fetch(`${BASE_URL}/order_item`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderItemData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error HTTP ${response.status}: ${errorText}`);
    }

    const newOrderItem = await response.json();
    console.log('✅ Item de orden creado:', newOrderItem);
    return newOrderItem;

  } catch (err) {
    console.error('❌ Error creando item de orden:', err);
    throw err;
  }
}

export async function updateOrder(orderId, updates) {
  try {
    const response = await fetch(`${BASE_URL}/order/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates)
    });
    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}: ${await response.text()}`);
    }
    return await response.json();
  } catch (err) {
    console.error(`Error actualizando orden ${orderId}:`, err);
    throw err;
  }
}

export async function deleteOrder(orderId) {
  try {
    const response = await fetch(`${BASE_URL}/order/${orderId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error HTTP ${response.status}: ${errorText}`);
    }

    return true; // Indica que la eliminación fue exitosa
  } catch (err) {
    console.error(`Error eliminando orden ${orderId}:`, err);
    throw err;
  }
}

// 🔹 ENVÍOS
export async function fetchShipping() {
  const response = await fetch(`${BASE_URL}/shipping`);
  if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
  return await response.json();
}

// 🔹 CREAR CARRITO
export async function createCart(cartData) {
  try {
    console.log('🛒 Creando nuevo carrito:', cartData);
    const response = await fetch(`${BASE_URL}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cartData)
    });
    
    if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
    
    const newCart = await response.json();
    console.log('✅ Carrito creado exitosamente:', newCart);
    return newCart;
    
  } catch (err) {
    console.error('❌ Error creando carrito:', err);
    throw err;
  }
}

// 🔹 SUBIR IMAGEN A XANO
export async function uploadImageToXano(imageFile) {
  try {
    console.log('🖼️ Subiendo imagen a Xano...', imageFile.name);
    
    const formData = new FormData();
    formData.append('file', imageFile);
    
    // Usa el endpoint /upload que creaste en Xano
    const response = await fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      body: formData  // NO incluir Content-Type header
    });
    
    console.log('📊 Status de upload:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error subiendo imagen: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    console.log('✅ Imagen subida exitosamente:', result);
    
    // Xano devuelve { url: "https://..." } o directamente la URL
    return result.url || result;
    
  } catch (err) {
    console.error('❌ Error subiendo imagen:', err);
    throw err;
  }
}

// 🔹 ACTUALIZAR PRODUCTO CON IMAGEN
export async function updateProductWithImage(productId, updates, imageFile = null) {
  try {
    console.log('🔄 Actualizando producto con imagen...', productId);
    
    let finalUpdates = { ...updates };
    
    // Si hay nueva imagen, subirla primero
    if (imageFile) {
      console.log('📤 Subiendo nueva imagen...');
      const imageUrl = await uploadImageToXano(imageFile);
      finalUpdates.images = [imageUrl]; // Reemplazar array de imágenes
      console.log('✅ Imagen subida, URL:', imageUrl);
    }
    
    console.log('📦 Datos finales para actualizar:', finalUpdates);
    
    const response = await fetch(`${BASE_URL}/product/${productId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(finalUpdates)
    });
    
    console.log('📊 Status de actualización:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error HTTP ${response.status}: ${errorText}`);
    }
    
    const result = await response.json();
    console.log('✅ Producto actualizado exitosamente:', result);
    return result;
    
  } catch (err) {
    console.error('❌ Error actualizando producto con imagen:', err);
    throw err;
  }
}