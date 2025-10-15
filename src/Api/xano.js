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
    console.log('📋 OK:', response.ok);
    
    const responseText = await response.text();
    console.log('📄 Response:', responseText);
    
    if (!response.ok) {
      console.error('❌ Error HTTP:', response.status);
      throw new Error(`Error en login: ${response.status} - ${responseText}`);
    }
    
    const data = JSON.parse(responseText);
    console.log('✅ Login exitoso:', data);
    
    const { authToken } = data || {};
    if (!authToken) {
      throw new Error('No se recibió token de autenticación');
    }

    console.log('🔑 Token recibido correctamente');
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

export async function signup({ name, email, password }) {
  try {
    const URL_COMPLETA = 'https://x8ki-letl-twmt.n7.xano.io/api:HJwsqpRg/auth/signup';
    console.log('📝 Intentando registro en Xano...');
    
    const requestBody = {
      name: name,
      email: email,
      password: password
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
    
    return { 
      token: authToken, 
      user: data.user || { name, email } 
    };
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
  const response = await fetch(`${BASE_URL}/product`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData)
  });
  if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
  return await response.json();
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

// 🔹 ENVÍOS
export async function fetchShipping() {
  const response = await fetch(`${BASE_URL}/shipping`);
  if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
  return await response.json();
}