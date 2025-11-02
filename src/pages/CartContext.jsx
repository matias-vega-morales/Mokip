import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { fetchCartByUser, fetchCartItems, createCart } from '../Api/xano';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItemCount, setCartItemCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const getCurrentUser = useCallback(() => {
    try {
      const authUser = localStorage.getItem('auth_user');
      return authUser ? JSON.parse(authUser) : null;
    } catch (err) {
      console.error('❌ Error parseando auth_user:', err);
      return null;
    }
  }, []);

  const updateCartCount = useCallback(async () => {
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.id) {
      setCartItemCount(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      let userCart = await fetchCartByUser(currentUser.id);
      userCart = userCart?.[0] || await createCart({ user_id: currentUser.id, created_at: new Date().toISOString() });
      
      if (userCart) {
        const items = await fetchCartItems(userCart.id);
        // Sumar las cantidades de cada item en lugar de solo contar los items.
        const totalQuantity = items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
        setCartItemCount(totalQuantity);
      } else {
        setCartItemCount(0);
      }
    } catch (error) {
      console.error("Error actualizando contador del carrito:", error);
      setCartItemCount(0);
    } finally {
      setLoading(false);
    }
  }, [getCurrentUser]);

  return <CartContext.Provider value={{ cartItemCount, updateCartCount, loading }}>{children}</CartContext.Provider>;
};