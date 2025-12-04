import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiSliders, FiStar, FiSearch } from "react-icons/fi";
import apiService from "./services/apiService";

export default function RestaurantsPage() {
  const loc = useLocation();
  const params = new URLSearchParams(loc.search);
  const q = (params.get("q") || "").toLowerCase();
  const mode = params.get("mode") || "delivery";
  const [chip, setChip] = useState("All");
  const [search, setSearch] = useState(q);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { setSearch(q); }, [q]);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  async function fetchRestaurants() {
    try {
      setLoading(true);
      const data = await apiService.getRestaurants();
      setRestaurants(data);
    } catch (err) {
      setError("Failed to load restaurants. Please try again.");
      console.error("Failed to fetch restaurants:", err);
    } finally {
      setLoading(false);
    }
  }

  const chips = ["All","Pizza","Indian","Street Food","Cafe","Beverages","Desserts","Chinese"];

  const items = useMemo(() => {
    return restaurants.filter(r => {
      const matchQ = search ? (
        r.name.toLowerCase().includes(search) || 
        (r.cuisine && r.cuisine.toLowerCase().includes(search)) || 
        (r.area && r.area.toLowerCase().includes(search))
      ) : true;
      const matchChip = chip === "All" ? true : (r.cuisine && r.cuisine.toLowerCase().includes(chip.toLowerCase()));
      return matchQ && matchChip;
    });
  }, [search, chip, restaurants]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0b0f0c] text-black dark:text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-white/10 rounded w-64 mb-4"></div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="rounded-3xl overflow-hidden bg-white dark:bg-white/5">
                  <div className="aspect-[4/3] bg-gray-200 dark:bg-white/10"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0b0f0c] text-black dark:text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={fetchRestaurants}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0b0f0c] text-black dark:text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-bold">Browse – <span className="capitalize">{mode}</span></div>
          <Link to="/" className="text-emerald-600 hover:underline">← Home</Link>
        </div>

        {/* search + filters */}
        <div className="sticky top-[64px] z-30 bg-white/80 dark:bg-black/30 backdrop-blur border-y border-black/5 dark:border-white/5">
          <div className="py-3 flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[240px]">
              <input
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
                placeholder="Search restaurants or cuisines"
                className="w-full px-4 py-3 pl-11 rounded-xl bg-white/90 dark:bg-white/5 border border-black/10 dark:border-white/10"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 opacity-70" />
            </div>
            <button className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center gap-2"><FiSliders /> Filters</button>
          </div>
          <div className="pb-3 flex items-center gap-2 overflow-x-auto">
            {chips.map(c=>(
              <button key={c} onClick={()=>setChip(c)} className={`px-3 py-1.5 rounded-xl whitespace-nowrap ${chip===c?"bg-emerald-600 text-white":"bg-gray-100 dark:bg-white/10"}`}>{c}</button>
            ))}
          </div>
        </div>

        {/* grid */}
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map(r=>(
            <Link key={r.id} to={`/menu/${r.id}?mode=${mode}`} className="rounded-3xl overflow-hidden ring-1 ring-black/5 dark:ring-white/10 bg-white dark:bg-white/5 hover:-translate-y-0.5 hover:shadow transition block">
              <div className="aspect-[4/3] relative">
                <img 
                  src={r.imgUrl || "/cheese_burstpizza.png"} 
                  alt={r.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/cheese_burstpizza.png";
                  }}
                />
                <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/70 text-xs px-2 py-1 rounded-lg flex items-center gap-1">
                  <FiStar className="text-yellow-500" /> {r.rating || 4.2}
                </div>
              </div>
              <div className="p-4">
                <div className="font-semibold leading-tight">{r.name}</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">{r.cuisine || "Restaurant"}</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">
                  {r.area || "Nearby"} · ₹{r.minOrder || 199} min order · {r.deliveryFee || 49} delivery
                </div>
              </div>
            </Link>
          ))}
        </div>

        {items.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No restaurants found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
