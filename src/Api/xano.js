import axios from "axios";

const BASE_URL = import.meta.env.VITE_XANO_BASE_URL || ''
const API_KEY = import.meta.env.VITE_XANO_API_KEY || ''

// Simple token storage
const TOKEN_KEY = 'auth_token'
export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || ''
}
export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

const api = axios.create({
	baseURL: BASE_URL,
	headers: {
		'Content-Type': 'application/json',
		...(API_KEY ? { 'Authorization': `Bearer ${API_KEY}` } : {})
	}
})

// Attach auth token if present
api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export async function fetchProductById(id) {
	// Xano table: product
	// Ajusta endpoint si en Xano tu collection usa /product/{id}
	const res = await api.get(`/product/${id}`)
	return res.data
}

export async function fetchProducts(params = {}) {
	const res = await api.get('/product', { params })
	return res.data
}

export async function createProduct(productData) {
	const res = await api.post('/product', productData)
	return res.data
}

export async function fetchRelatedProducts(category, limit = 5) {
	// Supone que Xano soporta filtrado por category
	const res = await api.get('/product', { params: { category, limit } })
	return res.data
}

// CART helpers
export async function fetchCartByUser(userId) {
	// returns array of carts for user
	const res = await api.get('/cart', { params: { user_id: userId } })
	return res.data
}

export async function fetchCartItems(cartId) {
	const res = await api.get('/cart_item', { params: { cart_id: cartId } })
	return res.data
}

export async function createCartForUser(userId) {
	const res = await api.post('/cart', { user_id: userId })
	return res.data
}

export async function addCartItem(cartId, productId, quantity = 1) {
	const res = await api.post('/cart_item', { cart_id: cartId, product_id: productId, quantity })
	return res.data
}

export async function updateCartItem(itemId, updates) {
	const res = await api.patch(`/cart_item/${itemId}`, updates)
	return res.data
}

export async function deleteCartItem(itemId) {
	const res = await api.delete(`/cart_item/${itemId}`)
	return res.data
}

// AUTH
// Base groups
const AUTH_BASE = import.meta.env.VITE_XANO_AUTH_BASE || '' // e.g. https://x8ki-.../api:HJwsqpRg

export async function login({ email, password }) {
  const base = AUTH_BASE || BASE_URL
  const res = await axios.post(`${base}/auth/login`, { email, password })
  const { authToken, user } = res.data || {}
  if (authToken) setToken(authToken)
  return { token: authToken, user }
}

export async function signup({ name, last_name, email, password, phone, shipping_address }) {
  const base = AUTH_BASE || BASE_URL
  const res = await axios.post(`${base}/auth/signup`, { name, last_name, email, password, phone, shipping_address })
  const { authToken, user } = res.data || {}
  if (authToken) setToken(authToken)
  return { token: authToken, user }
}

export async function me() {
  const base = AUTH_BASE || BASE_URL
  const token = getToken()
  if (!token) return null
  const res = await axios.get(`${base}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.data
}

export async function fetchUsers() {
  const res = await api.get('/user')
  return res.data
}

