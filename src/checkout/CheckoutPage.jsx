import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function CheckoutPage(){
  const nav = useNavigate();
  const { cart = [], totals, clear } = useCart();
  
  function placeOrder(){ 
    alert("Order placed successfully! 🎉"); 
    clear(); // Clear cart after order
    nav("/"); // Navigate to home instead of profile
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white px-4 py-24">
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="p-5 rounded-2xl ring-1 ring-black/10 dark:ring-white/10">
            <div className="text-lg font-semibold mb-3">Delivery address</div>
            <div className="grid sm:grid-cols-2 gap-3">
              <input placeholder="Name" className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-white/10" />
              <input placeholder="Phone" className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-white/10" />
              <input placeholder="Address line 1" className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-white/10 sm:col-span-2" />
              <input placeholder="City" className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-white/10" />
              <input placeholder="Pincode" className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-white/10" />
            </div>
          </div>
          <div className="p-5 rounded-2xl ring-1 ring-black/10 dark:ring-white/10">
            <div className="text-lg font-semibold mb-3">Payment</div>
            <div className="grid sm:grid-cols-2 gap-3">
              <input placeholder="UPI ID" className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-white/10" />
              <input placeholder="Card number" className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-white/10" />
              <input placeholder="Expiry" className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-white/10" />
              <input placeholder="CVV" className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-white/10" />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="p-5 rounded-2xl ring-1 ring-black/10 dark:ring-white/10">
            <div className="font-semibold mb-2">Order Summary</div>
            {cart.length > 0 ? (
              <>
                <div className="space-y-2 mb-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.name} x{item.qty || 1}</span>
                      <span>₹{item.price * (item.qty || 1)}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between"><span>Subtotal</span><span>₹{totals?.subtotal || 0}</span></div>
                  <div className="flex justify-between"><span>Delivery</span><span>₹{totals?.deliveryFee || 0}</span></div>
                  <div className="flex justify-between"><span>Taxes</span><span>₹{totals?.tax || 0}</span></div>
                  <div className="border-t border-black/10 dark:border-white/10 my-2" />
                  <div className="flex justify-between font-semibold"><span>Total</span><span>₹{totals?.total || 0}</span></div>
                </div>
                <button 
                  onClick={placeOrder} 
                  className="mt-4 w-full py-3 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition"
                >
                  Place Order
                </button>
              </>
            ) : (
              <div className="text-center text-gray-500 py-4">
                <p>Your cart is empty</p>
                <Link to="/restaurants" className="text-emerald-600 hover:underline">Browse Restaurants</Link>
              </div>
            )}
            <Link to="/cart" className="block text-center mt-2 text-sm text-emerald-600 hover:underline">Back to Cart</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
