import { Link, useNavigate } from "react-router-dom";
import { useCart } from "./context/CartContext";
import { useContext } from 'react';
import ThemeContext from './context/ThemeContext';

export default function CartPage() {
  const { cart, add, remove, clear } = useCart();
  const navigate = useNavigate();
  const { toggleTheme } = useContext(ThemeContext);
  const subtotal = cart.items.reduce((s, i) => s + i.price * (i.qty || 1), 0); // Use cart.items
  const delivery = cart.items.length ? 49 : 0; // Use cart.items
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + delivery + tax;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0b0f0c] text-black dark:text-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-bold">Your Cart</div>
          <Link to="/" className="text-emerald-600 hover:underline">← Continue browsing</Link>
        </div>

        {cart.items.length === 0 ? ( // Use cart.items
          <div className="text-center text-gray-500">Cart is empty</div>
        ) : (
          <>
            <div className="space-y-3">
              {cart.items.map((x) => ( // Use cart.items
                <div key={x.id} className="p-3 rounded-2xl ring-1 ring-black/10 flex items-center justify-between bg-white dark:bg-white/5">
                  <div className="font-semibold">{x.name}</div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => remove(x)} className="px-3 py-1 rounded-xl bg-gray-100 dark:bg-white/10">-</button>
                    <div>{x.qty || 1}</div>
                    <button onClick={() => add(x)} className="px-3 py-1 rounded-xl bg-gray-100 dark:bg-white/10">+</button>
                  </div>
                  <div className="w-20 text-right">${x.price * (x.qty || 1)}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-2xl ring-1 ring-black/10 bg-white dark:bg-white/5">
              <div className="flex justify-between text-sm"><span>Subtotal</span><span>${subtotal}</span></div>
              <div className="flex justify-between text-sm"><span>Delivery</span><span>${delivery}</span></div>
              <div className="flex justify-between text-sm"><span>Taxes</span><span>${tax}</span></div>
              <div className="mt-2 border-t border-black/10 pt-2 flex justify-between font-semibold"><span>Total</span><span>${total}</span></div>
            </div>

            <div className="mt-4 flex gap-3">
              <button 
                onClick={() => navigate('/checkout')} 
                className="px-4 py-3 rounded-2xl bg-emerald-600 text-white flex-1 hover:bg-emerald-700 transition"
              >
                Checkout
              </button>
              <button onClick={clear} className="px-4 py-3 rounded-2xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition">Clear</button>
            </div>
          </>
        )}

        <button onClick={toggleTheme} className="theme-toggle-button">
          Toggle Theme
        </button>
      </div>
    </div>
  );
}
