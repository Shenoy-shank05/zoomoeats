import { useMemo, useState, useEffect, useContext } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useCart } from "./context/CartContext";
import { UserContext } from "./context/UserContext";
import { FiArrowLeft, FiClock, FiStar, FiRefreshCw, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import apiService from "./services/apiService";

export default function MenuPage() {
  const { id } = useParams();
  const location = useLocation();
  const mode = new URLSearchParams(location.search).get("mode") || "delivery";
  const { add, remove, clear, cart } = useCart();
  const { user } = useContext(UserContext);

  const [restaurant, setRestaurant] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDish, setNewDish] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    isVeg: true,
    isAvailable: true,
  });

  const isMerchantOrAdmin = user && (user.role === "MERCHANT" || user.role === "ADMIN");

  const categories = useMemo(() => {
    if (!dishes.length) return ["All"];
    return ["All", ...new Set(dishes.map(d => d.category).filter(Boolean))];
  }, [dishes]);

  const list = useMemo(() => {
    if (tab === "All") return dishes;
    return dishes.filter(d => d.category === tab);
  }, [tab, dishes]);

  useEffect(() => {
    fetchRestaurantData();
  }, [id]);

  async function fetchRestaurantData() {
    try {
      setLoading(true);
      setError("");
      const data = await apiService.getRestaurantWithMenu(id);
      setRestaurant(data);
      setDishes(data.dishes || []);
    } catch (err) {
      setError("Failed to load restaurant menu. Please try again.");
      console.error("Failed to fetch restaurant data:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddDish() {
    try {
      const dishData = {
        ...newDish,
        price: parseFloat(newDish.price),
        restaurantId: id,
      };
      const addedDish = await apiService.createDish(dishData);
      setDishes([...dishes, addedDish]);
      setShowAddModal(false);
      setNewDish({
        name: "",
        price: "",
        description: "",
        category: "",
        isVeg: true,
        isAvailable: true,
      });
    } catch (err) {
      console.error("Failed to add dish:", err);
      alert("Failed to add dish. Please try again.");
    }
  }

  async function handleDeleteDish(dishId) {
    if (!window.confirm("Are you sure you want to delete this dish?")) return;
    try {
      await apiService.delete(`/dishes/${dishId}`);
      setDishes(dishes.filter(d => d.id !== dishId));
    } catch (err) {
      console.error("Failed to delete dish:", err);
      alert("Failed to delete dish. Please try again.");
    }
  }

  function handleAddToCart(dish) {
    if (cart.restaurantId && cart.restaurantId !== restaurant.id) {
      if (!window.confirm("Your cart contains items from another restaurant. Do you want to clear the cart and add this item?")) {
        return;
      }
      clear(); // Clear the cart if the restaurant is different
    }
    add(dish); // Add the dish to the cart
  }

  function handleRemoveFromCart(dish) {
    remove(dish); // Remove the dish from the cart
  }

  function getDishCount(dishId) {
    const item = cart.items.find(item => item.id === dishId);
    return item ? item.qty : 0;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0b0f0c] text-black dark:text-white">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="animate-pulse">
            <div className="py-4 flex items-center justify-between">
              <div className="h-6 bg-gray-200 dark:bg-white/10 rounded w-20"></div>
              <div className="h-10 bg-gray-200 dark:bg-white/10 rounded w-24"></div>
            </div>
            <div className="grid md:grid-cols-[220px_1fr] gap-6">
              <div className="rounded-3xl overflow-hidden bg-white dark:bg-white/5">
                <div className="aspect-[4/3] bg-gray-200 dark:bg-white/10"></div>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-full"></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-12 bg-gray-200 dark:bg-white/10 rounded"></div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="rounded-2xl overflow-hidden bg-white dark:bg-white/5">
                      <div className="aspect-[5/3] bg-gray-200 dark:bg-white/10"></div>
                      <div className="p-4 space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-1/2"></div>
                        <div className="h-8 bg-gray-200 dark:bg-white/10 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0b0f0c] text-black dark:text-white">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="py-4 flex items-center justify-between">
            <Link to={`/restaurants?mode=${mode}`} className="text-emerald-600 flex items-center gap-2">
              <FiArrowLeft /> Back
            </Link>
          </div>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <h2 className="text-xl font-semibold mb-2">Restaurant Not Found</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
            <button 
              onClick={fetchRestaurantData}
              className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition flex items-center gap-2 mx-auto"
            >
              <FiRefreshCw /> Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0b0f0c] text-black dark:text-white">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <h2 className="text-xl font-semibold mb-2">Restaurant Not Found</h2>
            <p className="text-gray-500 dark:text-gray-400">This restaurant might not exist or has been removed.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0b0f0c] text-black dark:text-white">
      <div className="max-w-5xl mx-auto px-4">
        <div className="py-4 flex items-center justify-between">
          <Link to={`/restaurants?mode=${mode}`} className="text-emerald-600 flex items-center gap-2">
            <FiArrowLeft /> Back
          </Link>
          <Link to="/cart" className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition">
            View Cart
          </Link>
        </div>

        <div className="grid md:grid-cols-[220px_1fr] gap-6">
          {/* Restaurant card */}
          <div className="md:sticky md:top-20 h-max">
            <div className="rounded-3xl overflow-hidden ring-1 ring-black/5 dark:ring-white/10 bg-white dark:bg-white/5">
              <div className="aspect-[4/3]">
                <img 
                  src={restaurant.imgUrl || "/cheese_burstpizza.png"} 
                  alt={restaurant.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/cheese_burstpizza.png";
                  }}
                />
              </div>
              <div className="p-4 space-y-1">
                <div className="font-semibold">{restaurant.name}</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">
                  {restaurant.cuisine || "Restaurant"} • {restaurant.area || "Nearby"}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                  <span className="inline-flex items-center gap-1">
                    <FiStar className="text-yellow-500" /> {restaurant.rating || 4.2}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <FiClock /> 25-35 mins
                  </span>
                </div>
                <div className="text-xs space-y-1">
                  <div>₹{restaurant.minOrder || 199} min order • ₹{restaurant.deliveryFee || 49} delivery</div>
                  <div>Mode: <span className="capitalize">{mode}</span></div>
                </div>
                {!restaurant.isOpen && (
                  <div className="text-xs text-red-500 font-medium">Currently Closed</div>
                )}
              </div>
            </div>
          </div>

          {/* Dishes */}
          <div className="pb-10">
            <div className="sticky top-[64px] z-30 bg-white/80 dark:bg-black/30 backdrop-blur border-y border-black/5 dark:border-white/5">
              <div className="py-3 flex items-center gap-2 overflow-x-auto">
                {categories.map(c => (
                  <button 
                    key={c} 
                    onClick={() => setTab(c)} 
                    className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition ${
                      tab === c 
                        ? "bg-emerald-600 text-white" 
                        : "bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {isMerchantOrAdmin && (
              <div className="mt-4 mb-6">
                <button 
                  onClick={() => setShowAddModal(true)} 
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition flex items-center gap-2"
                >
                  <FiPlus /> Add New Menu Item
                </button>
              </div>
            )}

            <div className="mt-4 grid sm:grid-cols-2 gap-4">
              {list.map(dish => (
                <div key={dish.id} className="rounded-2xl overflow-hidden ring-1 ring-black/5 dark:ring-white/10 bg-white dark:bg-white/5 hover:shadow-lg transition">
                  <div className="aspect-[5/3] relative">
                    <img 
                      src={dish.imgUrl || "/cheese_burstpizza.png"} 
                      alt={dish.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/cheese_burstpizza.png";
                      }}
                    />
                    {dish.isVeg && (
                      <div className="absolute top-2 left-2 w-4 h-4 border-2 border-green-600 flex items-center justify-center">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      </div>
                    )}
                    {!dish.isAvailable && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-medium">Out of Stock</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="font-semibold leading-tight">{dish.name}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-300">{dish.category}</div>
                        {dish.description && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                            {dish.description}
                          </div>
                        )}
                      </div>
                      <div className="font-semibold text-emerald-600">₹{dish.price}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getDishCount(dish.id) > 0 ? (
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleRemoveFromCart(dish)} className="px-2 py-1 bg-red-500 text-white rounded">-</button>
                          <span>{getDishCount(dish.id)}</span>
                          <button onClick={() => handleAddToCart(dish)} className="px-2 py-1 bg-green-500 text-white rounded">+</button>
                        </div>
                      ) : (
                        <button onClick={() => handleAddToCart(dish)} className="px-4 py-2 bg-blue-500 text-white rounded">Add</button>
                      )}
                    </div>
                    {isMerchantOrAdmin && (
                      <button 
                        onClick={() => handleDeleteDish(dish.id)} 
                        className="mt-2 px-3 py-1 text-red-600 flex items-center gap-1 text-sm"
                      >
                        <FiTrash2 /> Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {list.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <div className="text-4xl mb-2">🍽️</div>
                  <div className="text-gray-500 dark:text-gray-400">
                    {tab === "All" ? "No dishes available" : `No dishes in ${tab} category`}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Dish Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-[#0b0f0c] p-6 rounded-2xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">Add New Dish</h2>
              <button onClick={() => setShowAddModal(false)}><FiX /></button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Dish Name"
                value={newDish.name}
                onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-gray-100 dark:bg-white/10 focus:outline-none"
              />
              <input
                type="number"
                placeholder="Price"
                value={newDish.price}
                onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-gray-100 dark:bg-white/10 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Category"
                value={newDish.category}
                onChange={(e) => setNewDish({ ...newDish, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-gray-100 dark:bg-white/10 focus:outline-none"
              />
              <textarea
                placeholder="Description"
                value={newDish.description}
                onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-gray-100 dark:bg-white/10 focus:outline-none h-24"
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newDish.isVeg}
                  onChange={(e) => setNewDish({ ...newDish, isVeg: e.target.checked })}
                  id="isVeg"
                />
                <label htmlFor="isVeg">Vegetarian</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newDish.isAvailable}
                  onChange={(e) => setNewDish({ ...newDish, isAvailable: e.target.checked })}
                  id="isAvailable"
                />
                <label htmlFor="isAvailable">Available</label>
              </div>
              <button 
                onClick={handleAddDish}
                className="w-full px-3 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition"
              >
                Add Dish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
