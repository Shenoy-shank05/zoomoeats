import {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import apiService from "../services/apiService";

const CartCtx = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], restaurantId: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load cart once on mount
  useEffect(() => {
    loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadCart() {
    try {
      if (!apiService.token) return;
      setLoading(true);

      const backendCart = await apiService.getCart();

      if (backendCart?.items) {
        const cartItems = backendCart.items.map((item) => ({
          id: item.dishId,
          name: item.dish?.name || "Unknown Dish",
          price: item.dish?.price ?? 0,
          qty: item.quantity,
          restaurantId: item.dish?.restaurantId,
          restaurantName: item.dish?.restaurant?.name,
        }));

        const restaurantId =
          backendCart.items.length > 0
            ? backendCart.items[0].dish.restaurantId
            : null;

        setCart({ items: cartItems, restaurantId });
      }
    } catch (err) {
      console.error("Failed to load cart:", err);
    } finally {
      setLoading(false);
    }
  }

  async function syncWithBackend(action, item, quantity = 1) {
    try {
      if (!apiService.token) return;

      switch (action) {
        case "setQuantity": {
          await apiService.addToCart({
            dishId: item.id,
            quantity, // FINAL quantity
          });
          break;
        }
        case "remove": {
          const backendCart = await apiService.getCart();
          const cartItem = backendCart?.items?.find(
            (i) => i.dishId === item.id
          );
          if (cartItem) {
            await apiService.removeFromCart(cartItem.id);
          }
          break;
        }
        case "clear": {
          await apiService.clearCart();
          break;
        }
        default:
          break;
      }
    } catch (err) {
      console.error(`Failed to sync cart (${action}):`, err);
      setError("Failed to update cart. Please try again.");
      setTimeout(() => setError(""), 3000);
    }
  }

  // ------------ PUBLIC API ------------

  function add(item) {
    // 1) Compute new quantity based on CURRENT state
    const existing = cart.items.find((x) => x.id === item.id);
    const newQty = existing ? existing.qty + 1 : 1;

    // 2) Update local state (pure)
    setCart((prev) => {
      const idx = prev.items.findIndex((x) => x.id === item.id);
      let nextItems;

      if (idx > -1) {
        nextItems = prev.items.map((x, i) =>
          i === idx ? { ...x, qty: newQty } : x
        );
      } else {
        const newItem = {
          ...item,
          qty: 1,
        };
        nextItems = [...prev.items, newItem];
      }

      return {
        ...prev,
        items: nextItems,
        restaurantId: prev.restaurantId || item.restaurantId,
      };
    });

    // 3) One single backend call
    syncWithBackend("setQuantity", item, newQty);
  }

  function remove(item) {
    const existing = cart.items.find((x) => x.id === item.id);
    if (!existing) return;

    const newQty = existing.qty - 1;

    setCart((prev) => {
      const idx = prev.items.findIndex((x) => x.id === item.id);
      if (idx === -1) return prev;

      let nextItems;

      if (newQty <= 0) {
        nextItems = prev.items.filter((x) => x.id !== item.id);
      } else {
        nextItems = prev.items.map((x, i) =>
          i === idx ? { ...x, qty: newQty } : x
        );
      }

      return {
        ...prev,
        items: nextItems,
        restaurantId: nextItems.length === 0 ? null : prev.restaurantId,
      };
    });

    if (newQty <= 0) {
      syncWithBackend("remove", item);
    } else {
      syncWithBackend("setQuantity", item, newQty);
    }
  }

  function updateQuantity(id, qty) {
    const item = cart.items.find((x) => x.id === id);
    if (!item) return;

    setCart((prev) => {
      const idx = prev.items.findIndex((x) => x.id === id);
      if (idx === -1) return prev;

      let nextItems;

      if (qty <= 0) {
        nextItems = prev.items.filter((x) => x.id !== id);
      } else {
        nextItems = prev.items.map((x, i) =>
          i === idx ? { ...x, qty } : x
        );
      }

      return {
        ...prev,
        items: nextItems,
        restaurantId: nextItems.length === 0 ? null : prev.restaurantId,
      };
    });

    if (qty <= 0) {
      syncWithBackend("remove", item);
    } else {
      syncWithBackend("setQuantity", item, qty);
    }
  }

  function clear() {
    setCart({ items: [], restaurantId: null });
    syncWithBackend("clear");
  }

  const totals = useMemo(() => {
    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );
    const deliveryFee = cart.items.length > 0 ? 49 : 0;
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + deliveryFee + tax;

    return {
      subtotal,
      deliveryFee,
      tax,
      total,
      itemCount: cart.items.reduce((sum, item) => sum + item.qty, 0),
    };
  }, [cart]);

  const value = useMemo(
    () => ({
      cart,
      add,
      remove,
      updateQuantity,
      clear,
      loading,
      error,
      totals,
      isEmpty: cart.items.length === 0,
      restaurantId: cart.restaurantId,
      restaurantName:
        cart.items.length > 0 ? cart.items[0].restaurantName : null,
    }),
    [cart, loading, error, totals]
  );

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
