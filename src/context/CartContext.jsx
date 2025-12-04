import { createContext, useContext, useMemo, useState, useEffect } from "react";
import apiService from "../services/apiService";

const CartCtx = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load cart from backend on mount (if user is logged in)
  useEffect(() => {
    loadCart();
  }, []);

  async function loadCart() {
    try {
      if (!apiService.token) return; // Not logged in, use local cart
      setLoading(true);
      const backendCart = await apiService.getCart();
      if (backendCart?.items) {
        const cartItems = backendCart.items.map(item => ({
          id: item.dishId,
          name: item.dish?.name || "Unknown Dish",
          price: item.priceSnap,
          qty: item.qty,
          restaurantId: item.dish?.restaurantId,
          restaurantName: item.dish?.restaurant?.name
        }));
        setCart(cartItems);
      }
    } catch (err) {
      console.error("Failed to load cart:", err);
      // Continue with local cart if backend fails
    } finally {
      setLoading(false);
    }
  }

  async function syncWithBackend(action, item, quantity = 1) {
    try {
      if (!apiService.token) return; // Not logged in, skip sync
      
      switch (action) {
        case 'add':
          await apiService.addToCart({
            dishId: item.id,
            qty: quantity,
            priceSnap: item.price
          });
          break;
        case 'update':
          // Find the cart item ID from backend
          const backendCart = await apiService.getCart();
          const cartItem = backendCart?.items?.find(i => i.dishId === item.id);
          if (cartItem) {
            await apiService.updateCartItem(cartItem.id, quantity);
          }
          break;
        case 'remove':
          const cart = await apiService.getCart();
          const itemToRemove = cart?.items?.find(i => i.dishId === item.id);
          if (itemToRemove) {
            await apiService.removeFromCart(itemToRemove.id);
          }
          break;
        case 'clear':
          await apiService.clearCart();
          break;
      }
    } catch (err) {
      console.error(`Failed to sync cart ${action}:`, err);
      setError(`Failed to update cart. Please try again.`);
      setTimeout(() => setError(""), 3000);
    }
  }

  function add(item) {
    setCart((c) => {
      // Check if adding from different restaurant
      if (c.length > 0 && c[0].restaurantId && item.restaurantId && c[0].restaurantId !== item.restaurantId) {
        // In a real app, you'd show a confirmation dialog
        console.warn("Items from different restaurants. Clearing cart.");
        const newCart = [{ ...item, qty: 1 }];
        syncWithBackend('clear').then(() => {
          syncWithBackend('add', item, 1);
        });
        return newCart;
      }

      const i = c.findIndex((x) => x.id === item.id);
      if (i > -1) {
        const copy = [...c];
        const newQty = (copy[i].qty || 1) + 1;
        copy[i] = { ...copy[i], qty: newQty };
        syncWithBackend('update', item, newQty);
        return copy;
      }
      
      const newCart = [...c, { ...item, qty: 1 }];
      syncWithBackend('add', item, 1);
      return newCart;
    });
  }

  function remove(id) {
    setCart((c) => {
      const i = c.findIndex((x) => x.id === id);
      if (i === -1) return c;
      
      const copy = [...c];
      const item = copy[i];
      const newQty = (copy[i].qty || 1) - 1;
      
      if (newQty <= 0) {
        copy.splice(i, 1);
        syncWithBackend('remove', item);
      } else {
        copy[i] = { ...copy[i], qty: newQty };
        syncWithBackend('update', item, newQty);
      }
      
      return copy;
    });
  }

  function updateQuantity(id, qty) {
    if (qty <= 0) {
      remove(id);
      return;
    }
    
    setCart((c) => {
      const i = c.findIndex((x) => x.id === id);
      if (i === -1) return c;
      
      const copy = [...c];
      const item = copy[i];
      copy[i] = { ...copy[i], qty };
      syncWithBackend('update', item, qty);
      return copy;
    });
  }

  function clear() { 
    setCart([]);
    syncWithBackend('clear');
  }

  // Calculate totals
  const totals = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const deliveryFee = cart.length > 0 ? 49 : 0;
    const tax = Math.round(subtotal * 0.05); // 5% tax
    const total = subtotal + deliveryFee + tax;
    
    return {
      subtotal,
      deliveryFee,
      tax,
      total,
      itemCount: cart.reduce((sum, item) => sum + item.qty, 0)
    };
  }, [cart]);

  const value = useMemo(() => ({ 
    cart, 
    add, 
    remove, 
    updateQuantity,
    clear, 
    loading,
    error,
    totals,
    isEmpty: cart.length === 0,
    restaurantId: cart.length > 0 ? cart[0].restaurantId : null,
    restaurantName: cart.length > 0 ? cart[0].restaurantName : null
  }), [cart, loading, error, totals]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
