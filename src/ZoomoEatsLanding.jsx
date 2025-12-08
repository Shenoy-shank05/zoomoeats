import { useEffect, useRef, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import {
  FiSun, FiMoon, FiMapPin, FiSearch, FiUser, FiLogIn, FiUserPlus,
  FiShoppingCart, FiChevronLeft, FiChevronRight, FiX, FiStar, FiZap, FiShield
} from "react-icons/fi";
import apiService from "./services/apiService";
import { UserContext } from "./context/UserContext";
import ThemeContext from "./context/ThemeContext";

/* ----------------------------- tiny helpers ----------------------------- */
function useLocalStorage(key, initial) {
  const [v, setV] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : initial; }
    catch { return initial; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)); } catch {} }, [key, v]);
  return [v, setV];
}
const prefersReduced = () => window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

/* ============================== Landing ================================= */
export default function ZoomoEatsLanding() {
  const { user, location: userLocation, setLocation: setUserLocation } = useContext(UserContext);
  const { toggleTheme } = useContext(ThemeContext);
  const [dark, setDark] = useLocalStorage("ze_theme_dark", true);
  const [mode, setMode] = useState("Delivery");
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState(userLocation || "");
  const [tickerIndex, setTickerIndex] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [hoverXY, setHoverXY] = useState({ x: 0, y: 0 });
  const [restaurants, setRestaurants] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const particlesInit = async (engine) => { await loadSlim(engine); };

  const headlines = [
    "Pickup, Dine-In, or Delivery.",
    "Your cravings, delivered.",
    "Zoom It. Eat It. Love It.",
    "Fresh deals. Fresh vibes.",
  ];
  const ticker = [
    "25% off on first 3 orders",
    "Wallet is live — 1-tap pay",
    "Invite friends, get $150 credits",
    "Free delivery above $199",
    "Now serving in 45+ cities",
  ];
  const categories = [
    "Popular", "Pizza", "Burgers", "Indian", "Street Food", "Beverages", "Cafe",
    "Desserts", "Rolls", "Breakfast", "Healthy", "South Indian"
  ];

  // Fetch real data from backend with fallback
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const resRestaurants = await apiService.getRestaurants();
        if (resRestaurants && resRestaurants.data && resRestaurants.data.length > 0) {
          setRestaurants(resRestaurants.data.map(r => ({
            id: r.id,
            name: r.name,
            img: r.imageUrl || "https://source.unsplash.com/800x600/?food",
            cuisine: r.cuisineType || "Various",
            area: r.address,
            rating: r.rating?.toFixed(1) || "4.0",
            eta: "30-45 min",
            cost: r.priceRange === "$" ? 150 : r.priceRange === "$$" ? 250 : 350,
          })));
        } else {
          throw new Error("No restaurants data");
        }
      } catch (err) {
        console.error("Error fetching data, using fallback:", err);
        setRestaurants([
          { id: "1", name: "I Love Pizza, Jourian", cuisine: "Italian", rating: "4.5", eta: "30-45 min", img: "https://source.unsplash.com/800x600/?pizza", area: "Main Market, Jourian", cost: 250 },
          { id: "2", name: "Sharma Fast Food", cuisine: "Street Food", rating: "4.2", eta: "20-30 min", img: "https://source.unsplash.com/800x600/?street-food", area: "Food Street, Jourian", cost: 150 },
          { id: "3", name: "Coffee Express", cuisine: "Beverages", rating: "4.7", eta: "15-25 min", img: "https://source.unsplash.com/800x600/?coffee", area: "Central Plaza, Jourian", cost: 100 },
          { id: "4", name: "Taste of Punjab", cuisine: "Indian", rating: "4.6", eta: "35-50 min", img: "https://source.unsplash.com/800x600/?indian-food", area: "Punjab Street, Jourian", cost: 300 },
          { id: "5", name: "Moonlight Cafe", cuisine: "Cafe", rating: "4.4", eta: "25-35 min", img: "https://source.unsplash.com/800x600/?cafe", area: "Moonlight Street, Jourian", cost: 200 },
        ]);
      }
      
      setOffers([
        { id: "o1", title: "Flat 50% Off", desc: "On select partners", code: "ZOOMO50", img: "https://source.unsplash.com/800x450/?food-offer" },
        { id: "o2", title: "Buy 1 Get 1", desc: "On pizzas & rolls", code: "BOGO", img: "https://source.unsplash.com/800x450/?pizza-deal" },
        { id: "o3", title: "Free Delivery", desc: "Above ₹199", code: "FREESHIP", img: "https://source.unsplash.com/800x450/?delivery" },
      ]);
      
      setLoading(false);
    };
    fetchData();
  }, [user, userLocation]);

  // Auto-detect location
  useEffect(() => {
    if (userLocation) {
      setLocation(userLocation);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
          const data = await res.json();
          const address = data.display_name || `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
          setUserLocation(address);
          setLocation(address);
        } catch (err) {
          console.error("Reverse geocoding error:", err);
          const address = `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
          setUserLocation(address);
          setLocation(address);
        }
      }, (err) => console.error("Geolocation error:", err), { enableHighAccuracy: true });
    }
  }, [userLocation, setUserLocation]);

  useEffect(() => {
    const id = setInterval(() => setTickerIndex((t) => (t + 1) % ticker.length), 2400);
    return () => clearInterval(id);
  }, [ticker.length]);

  useEffect(() => {
    const el = document.documentElement;
    dark ? el.classList.add("dark") : el.classList.remove("dark");
  }, [dark]);

  // Check localStorage for theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  function onSearch() {
    const parts = [];
    if (mode) parts.push(`mode=${mode.toLowerCase()}`);
    if (query.trim()) parts.push(`q=${encodeURIComponent(query.trim())}`);
    if (location.trim()) parts.push(`loc=${encodeURIComponent(location.trim())}`);
    navigate(`/restaurants?${parts.join("&")}`);
  }

  return (
    <div className="relative min-h-screen bg-white dark:bg-black transition-colors">
      {/* Particles layer (theme-aware) */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            fullScreen: { enable: false },
            fpsLimit: 60,
            detectRetina: true,
            background: { color: dark ? "#000000" : "#ffffff" },
            particles: {
              number: { value: 100, density: { enable: true, area: 900 } },
              size: { value: { min: 1, max: 3 } },
              color: { value: dark ? ["#22c55e", "#a7f3d0", "#fff"] : ["#10b981", "#0ea5e9", "#111827"] },
              links: { enable: true, opacity: dark ? 0.12 : 0.2, color: dark ? "#22c55e" : "#0ea5e9" },
              move: { enable: true, speed: 0.6, outModes: { default: "out" } },
              opacity: { value: 0.4 },
            },
            interactivity: {
              events: { onHover: { enable: true, mode: "repulse" } },
              modes: { repulse: { distance: 80, duration: 0.4 } }
            }
          }}
        />
      </div>
      <AnnouncementBar text={ticker[tickerIndex]} />
      <Navbar
        dark={dark}
        setDark={setDark}
        mode={mode}
        setMode={setMode}
        onProfileOpen={() => setProfileOpen(true)}
        user={user}
      />
      <Hero
        headlines={headlines}
        mode={mode}
        query={query}
        setQuery={setQuery}
        location={location}
        setLocation={setLocation}
        onSearch={onSearch}
        hoverXY={hoverXY}
        setHoverXY={setHoverXY}
      />
      <CategoryChips categories={categories} />
      <Section title="Featured Restaurants" subtitle="Top picks near you">
        {loading ? <LoadingSpinner /> : <FeaturedCarousel items={restaurants} mode={mode} />}
      </Section>
      <Section title="Hot Offers" subtitle="Fresh deals, updated daily">
        {loading ? <LoadingSpinner /> : <OfferGrid offers={offers} />}
      </Section>
      <Section title="What Our Customers Say" subtitle="Real stories from happy eaters">
        <Testimonials />
      </Section>
      <Section title="Built for speed" subtitle="Small touches that make big differences">
        <WhyUs />
      </Section>
      <Footer />
      <ChatWidget open={chatOpen} setOpen={setChatOpen} />
      <ProfileDrawer open={profileOpen} setOpen={setProfileOpen} user={user} />
    </div>
  );
}

/* ----------------------------- UI SECTIONS ----------------------------- */
function AnnouncementBar({ text }) {
  return (
    <div className="w-full bg-emerald-600/90 dark:bg-emerald-500/90 text-white text-xs sm:text-sm py-2 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-2">
        <span className="animate-pulse">●</span>
        <span className="truncate">{text}</span>
      </div>
    </div>
  );
}

function Navbar({ dark, setDark, mode, setMode, onProfileOpen, user }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-white/80 dark:bg-black/50 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img loading="lazy" src="/zoomo-logo.png" alt="Zoomo Eats Logo" className="w-9 h-9 rounded-xl object-cover ring-1 ring-emerald-400/30" />
          <div className="text-lg font-semibold dark:text-white">
            Zoomo <span className="text-emerald-500">Eats</span>
          </div>
          <div className="hidden md:flex items-center gap-1 bg-gray-100 dark:bg-white/10 rounded-xl p-1 ml-2">
            {["Pickup", "Dine-In", "Delivery"].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-3 py-1.5 rounded-lg text-xs transition ${
                  mode === m
                    ? "bg-white dark:bg-black shadow text-gray-900 dark:text-white"
                    : "text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-white/5"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => setDark((v) => !v)}
            className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-white/10 dark:text-white text-gray-800 hover:scale-[1.02] active:scale-[.98] transition flex items-center gap-2"
            aria-label="Toggle theme"
          >
            {dark ? <FiSun /> : <FiMoon />} {dark ? "Light" : "Dark"}
          </button>
          {user ? (
            <button onClick={onProfileOpen} className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-white/10 dark:text-white flex items-center gap-2">
              <FiUser /> {user.name || "Profile"}
            </button>
          ) : (
            <>
              <Link to="/login" className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-white/10 dark:text-white flex items-center gap-2"><FiLogIn /> Login</Link>
              <Link to="/signup" className="px-3 py-2 rounded-xl bg-emerald-600 text-white flex items-center gap-2"><FiUserPlus /> Sign up</Link>
            </>
          )}
          <Link to="/cart" className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-white/10 dark:text-white"><FiShoppingCart /></Link>
        </div>
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setDark((v) => !v)}
            className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-white/10 dark:text-white"
            aria-label="Toggle theme"
          >
            {dark ? <FiSun /> : <FiMoon />}
          </button>
          <Link to="/cart" className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-white/10 dark:text-white"><FiShoppingCart /></Link>
        </div>
      </div>
    </header>
  );
}

function Hero({ headlines, mode, query, setQuery, location, setLocation, onSearch, hoverXY, setHoverXY }) {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % headlines.length), 2200);
    return () => clearInterval(id);
  }, [headlines.length]);
  const onMouse = (e) => {
    if (prefersReduced()) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    setHoverXY({ x, y });
  };
  return (
    <section className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-14 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left copy */}
          <div>
            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight text-gray-900 dark:text-white">
              {headlines[index]}
            </h1>
            <p className="mt-3 text-gray-600 dark:text-gray-300 max-w-xl">
              Order from top restaurants near you. Switch between {mode.toLowerCase()} anytime.
              Smart recommendations, live tracking, and one-tap reorder.
            </p>
            {/* Location + Search */}
            <div className="mt-6 space-y-3">
              <div className="relative">
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter delivery location"
                  className="w-full px-4 py-3 pl-11 rounded-2xl bg-white/95 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white placeholder-gray-500"
                />
                <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 opacity-70" />
              </div>
              <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
                <div className="relative">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search dishes, restaurants, cuisines"
                    className="w-full px-4 py-3 pl-11 rounded-2xl bg-white/95 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white placeholder-gray-500"
                  />
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 opacity-70" />
                </div>
                <Magnetic onClick={onSearch} className="bg-emerald-600 text-white">Search</Magnetic>
                <Magnetic onClick={() => navigate(`/restaurants?mode=${mode.toLowerCase()}`)} className="bg-white dark:bg-emerald-500 text-gray-900 dark:text-black">Order Now</Magnetic>
              </div>
              {/* Selling points */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 dark:text-gray-300">
                <Chip icon={<FiZap />}>Live tracking</Chip>
                <Chip>Contactless</Chip>
                <Chip icon={<FiShield />}>Secure payments</Chip>
              </div>
            </div>
          </div>
          {/* Right visual: Mascot card with tilt & neon ring */}
          <div
            className="relative will-change-transform"
            onMouseMove={onMouse}
            onMouseLeave={() => setHoverXY({ x: 0, y: 0 })}
            style={{
              transform: `perspective(900px) rotateX(${hoverXY.y * -6}deg) rotateY(${hoverXY.x * 8}deg)`,
              transition: prefersReduced() ? "none" : "transform 200ms ease",
            }}
          >
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-[0_10px_40px_-10px_rgba(16,185,129,0.35)] ring-1 ring-emerald-400/30 relative bg-gradient-to-br from-emerald-50 to-white dark:from-[#0c0c0c] dark:to-[#040404]">
              <div className="absolute inset-0 rounded-3xl ring-2 ring-emerald-500/20 pointer-events-none" />
              <img loading="lazy" src="/zoomo-mascot.png" alt="Zoomo mascot" className="w-full h-full object-contain p-6 select-none" draggable="false" />
            </div>
            <div className="absolute -bottom-6 left-6 bg-white/90 dark:bg-black rounded-2xl shadow-xl ring-1 ring-black/5 dark:ring-white/10 p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white grid place-content-center text-lg font-bold">Z</div>
              <div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">Fast delivery</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">Avg 25–35 mins</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Chip({ children, icon }) {
  return (
    <span className="px-2 py-1 rounded-lg bg-gray-100 dark:bg-white/10 inline-flex items-center gap-1">
      {icon}{children}
    </span>
  );
}

function Magnetic({ children, className = "", onClick }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;
    const enter = (e) => { el.animate({ transform: ["translateY(0)", "translateY(-2px)"] }, { duration: 120, fill: "forwards" }); };
    const leave = (e) => { el.animate({ transform: ["translateY(-2px)", "translateY(0)"] }, { duration: 120, fill: "forwards" }); };
    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);
    return () => { el.removeEventListener("mouseenter", enter); el.removeEventListener("mouseleave", leave); };
  }, []);
  return (
    <button ref={ref} onClick={onClick} className={`px-5 py-3 rounded-2xl hover:brightness-110 active:brightness-95 transition ${className}`}>
      {children}
    </button>
  );
}

function CategoryChips({ categories }) {
  return (
    <div className="sticky top-[64px] z-30 border-y border-white/10 bg-white/70 dark:bg-black/40 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 overflow-x-auto">
        {categories.map((c, i) => (
          <button
            key={c}
            className="px-3 py-1.5 rounded-xl whitespace-nowrap bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-200 hover:scale-[1.02] transition data-[i='0']:ring-1"
            data-i={i === 0 ? "0" : "1"}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}

function Section({ title, subtitle, children }) {
  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">{subtitle}</p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-white/10 dark:text-white">View all</button>
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}

function FeaturedCarousel({ items, mode }) {
  const ref = useRef(null);
  const scrollBy = (dx) => ref.current?.scrollBy({ left: dx, behavior: "smooth" });
  return (
    <div className="relative">
      <div ref={ref} className="grid auto-cols-[minmax(260px,1fr)] grid-flow-col gap-4 overflow-x-auto no-scrollbar scroll-smooth">
        {items.map((r) => <RestCard key={r.id} r={r} mode={mode} />)}
      </div>
      <button onClick={() => scrollBy(-320)} aria-label="Previous restaurant" className="hidden md:grid place-content-center absolute -left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white dark:bg-white/10 ring-1 ring-black/10">
        <FiChevronLeft />
      </button>
      <button onClick={() => scrollBy(320)} aria-label="Next restaurant" className="hidden md:grid place-content-center absolute -right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white dark:bg-white/10 ring-1 ring-black/10">
        <FiChevronRight />
      </button>
    </div>
  );
}

function RestCard({ r, mode }) {
  return (
    <Link to={`/menu/${r.id}?mode=${(mode || "delivery").toLowerCase()}`} className="rounded-3xl overflow-hidden ring-1 ring-white/10 bg-white/80 dark:bg-[#0e0e0e] hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-10px_rgba(16,185,129,0.35)] transition block">
      <div className="aspect-[4/3] relative">
        <img loading="lazy" src={r.img} alt={`${r.name} restaurant`} className="w-full h-full object-cover" />
        <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/70 text-xs px-2 py-1 rounded-lg flex items-center gap-1">
          <FiStar className="text-yellow-500" /> {r.rating}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="font-semibold text-gray-900 dark:text-white leading-tight pr-2">{r.name}</div>
          <div className="text-xs px-2 py-1 rounded-lg bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-200">{r.eta} mins</div>
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-300">{r.cuisine} · {r.area} · ${r.cost} for two</div>
      </div>
    </Link>
  );
}

function OfferGrid({ offers }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {offers.map((o) => (
        <div key={o.id} className="group overflow-hidden rounded-3xl ring-1 ring-white/10 bg-white/80 dark:bg-[#0f0f0f]">
          <div className="aspect-[16/9] overflow-hidden">
            <img loading="lazy" src={o.img} alt={`${o.title} offer`} className="w-full h-full object-cover group-hover:scale-105 transition" />
          </div>
          <div className="p-4 flex items-center justify-between">
            <div>
              <div className="font-semibold text-gray-900 dark:text-white">{o.title}</div>
              <div className="text-xs text-gray-600 dark:text-gray-300">{o.desc}</div>
            </div>
            <div className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs">{o.code}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Testimonials() {
  const testimonials = [
    { name: "Alex J.", quote: "Zoomo Eats is a game-changer! Super fast delivery and amazing deals.", rating: 5 },
    { name: "Sarah K.", quote: "Love the variety and easy switching between pickup and delivery.", rating: 4.8 },
    { name: "Mike L.", quote: "The chat support is quick and helpful. Highly recommend!", rating: 5 },
    { name: "Emma R.", quote: "Best food app I've used. The mascot is cute too!", rating: 4.9 },
  ];
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {testimonials.map((t, i) => (
        <div key={i} className="rounded-3xl ring-1 ring-white/10 bg-white/80 dark:bg-[#0f0f0f] p-5">
          <div className="flex items-center mb-2">
            {[...Array(5)].map((_, j) => (
              <FiStar key={j} className={`text-yellow-500 ${j < Math.floor(t.rating) ? "fill-current" : ""}`} />
            ))}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">"{t.quote}"</div>
          <div className="font-semibold text-gray-900 dark:text-white">- {t.name}</div>
        </div>
      ))}
    </div>
  );
}

function WhyUs() {
  const items = [
    { t: "Lightning Fast", d: "Optimized routes, real-time ETAs & batching" },
    { t: "All Modes", d: "Pickup, Dine-In & Delivery in one flow" },
    { t: "Secure Payments", d: "UPI, Cards, Wallet & COD" },
    { t: "Reliable Support", d: "24×7 help via chat & callback" },
    { t: "Curated Choices", d: "Handpicked restaurants with checks" },
    { t: "Rewards", d: "Earn & redeem points on every order" },
  ];
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((x, i) => (
        <div key={i} className="rounded-3xl ring-1 ring-white/10 bg-white/80 dark:bg-[#0f0f0f] p-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white grid place-content-center mb-3">✓</div>
          <div className="font-semibold text-gray-900 dark:text-white">{x.t}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">{x.d}</div>
        </div>
      ))}
    </div>
  );
}

function Footer() {
  const [email, setEmail] = useState("");
  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(`Subscribed with ${email}`);
    setEmail("");
  };

  return (
    <footer className="border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <img loading="lazy" src="/zoomo-logo.png" alt="Zoomo Eats Logo" className="w-9 h-9 rounded-xl object-cover" />
            <div className="text-lg font-semibold dark:text-white">Zoomo Eats</div>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Zoom It. Eat It. Love It.</div>
        </div>
        <div>
          <div className="font-semibold mb-3 dark:text-white">Company</div>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <button type="button">About</button>
            <button type="button">Careers</button>
            <button type="button">Contact</button>
            <button type="button">Blog</button>
          </div>
        </div>
        <div>
          <div className="font-semibold mb-3 dark:text-white">Help</div>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <button type="button">Support</button>
            <button type="button">FAQs</button>
            <button type="button">Partner with us</button>
            <button type="button">Privacy</button>
          </div>
        </div>
        <div>
          <div className="font-semibold mb-3 dark:text-white">Get the app</div>
          <div className="flex items-center gap-3 mb-4">
            <div className="px-4 py-2 rounded-xl bg-black text-white text-sm">App Store</div>
            <div className="px-4 py-2 rounded-xl bg-black text-white text-sm">Google Play</div>
          </div>
          <div className="font-semibold mb-3 dark:text-white">Newsletter</div>
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="flex-1 px-3 py-2 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none"
              required
            />
            <button type="submit" className="px-3 py-2 rounded-xl bg-emerald-600 text-white">Subscribe</button>
          </form>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between text-xs text-gray-600 dark:text-gray-300">
          <div>© {new Date().getFullYear()} Zoomo Eats</div>
          <div className="flex items-center gap-3">
            <button type="button">Terms</button>
            <button type="button">Privacy</button>
            <button type="button">Cookies</button>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ---------------------------- Profile Drawer --------------------------- */
export function ProfileDrawer({ open, setOpen, user }) {
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    if (open && user) {
      const fetchOrders = async () => {
        try {
          const res = await apiService.get('/orders/mine');
          setRecentOrders(res.data.slice(0, 3));
        } catch (err) {
          console.error("Error fetching orders:", err);
          setRecentOrders([
            { id: 10231, status: "Delivered", amount: 414 },
            { id: 10232, status: "Delivered", amount: 399 },
            { id: 10233, status: "Delivered", amount: 429 },
          ]);
        }
      };
      fetchOrders();
    }
  }, [open, user]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="w-full max-w-md ml-auto h-full bg-white dark:bg-black dark:text-white ring-1 ring-white/10 flex flex-col">
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="font-semibold flex items-center gap-2"><FiUser /> Profile</div>
          <button onClick={() => setOpen(false)} aria-label="Close profile"><FiX /></button>
        </div>
        <div className="p-5 space-y-5 overflow-y-auto">
          <div className="flex items-center gap-4">
            <img loading="lazy" src={user?.avatar || "/avatar.png"} alt="User avatar" className="w-14 h-14 rounded-2xl bg-gray-200 object-cover" />
            <div>
              <div className="text-lg font-semibold">{user?.name || "Guest"}</div>
              <div className="text-xs text-gray-600 dark:text-gray-300">{user?.email || "Not signed in"}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {!user && (
              <>
                <Link to="/login" className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/10 text-center">Login</Link>
                <Link to="/signup" className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-center">Sign up</Link>
              </>
            )}
            <Link to="/profile" className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/10 text-center col-span-2">Open full profile</Link>
            <Link to="/orders" className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/10 text-center col-span-2">My Orders</Link>
            <Link to="/addresses" className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/10 text-center col-span-2">Addresses</Link>
            <Link to="/payments" className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/10 text-center col-span-2">Payments</Link>
          </div>
          <div>
            <div className="font-semibold mb-2">Recent orders</div>
            <div className="space-y-2">
              {recentOrders.map((order) => (
                <div key={order.id} className="p-3 rounded-2xl ring-1 ring-white/10 flex items-center justify-between bg-white/70 dark:bg-[#0f0f0f]">
                  <div>
                    <div className="font-semibold">Order #{order.id}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">{order.status} • ${order.amount}</div>
                  </div>
                  <button className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-white/10">Reorder</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 bg-black/40" onClick={() => setOpen(false)} />
    </div>
  );
}

/* ---------------------------- Chat Widget --------------------------- */
function ChatWidget({ open, setOpen }) {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi! I'm Zoomo Assist, powered by our friendly mascot! How can I help you today?" },
    { role: "bot", text: "You can ask about orders, deals, restaurants, or anything else!" },
  ]);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const quick = ["Current deals", "Track my order", "Delivery areas", "Payment options", "Contact support", "Recommend a restaurant"];
  const chatRef = useRef(null);

  function send(content = text) {
    const val = content.trim();
    if (!val) return;
    const userMsg = { role: "user", text: val };
    setMessages((m) => [...m, userMsg]);
    setText("");
    setIsTyping(true);

    setTimeout(() => {
      const replyText = routeIntent(val);
      const botMsg = { role: "bot", text: replyText };
      setMessages((m) => [...m, botMsg]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  }

  function routeIntent(t) {
    const s = t.toLowerCase();
    if (s.includes("deal") || s.includes("offer") || s.includes("promo")) return "Today's hot deals: ZOOMO50 for 50% off on select partners, BOGO for Buy 1 Get 1 on pizzas & rolls, FREESHIP for free delivery above $199. Which one interests you?";
    if (s.includes("track") || s.includes("order") || s.includes("status") || s.includes("where")) return "To track your order, go to Profile > My Orders for live updates. Or share your order number for quick status!";
    if (s.includes("deliver") || s.includes("area") || s.includes("city") || s.includes("location") || s.includes("pincode")) return "We're serving in 45+ cities across India. Enter your location on the home page to check if we deliver to you. What's your area?";
    if (s.includes("pay") || s.includes("payment") || s.includes("wallet") || s.includes("upi") || s.includes("card") || s.includes("cod")) return "We accept UPI, Credit/Debit Cards, Zoomo Wallet, Net Banking, and Cash on Delivery. Secure and seamless! Any specific question?";
    if (s.includes("support") || s.includes("help") || s.includes("agent") || s.includes("contact")) return "I've escalated this to our human support team. Expect a callback or email within 5-10 minutes. In the meantime, anything else?";
    if (s.includes("recommend") || s.includes("restaurant") || s.includes("suggest")) return "Based on popular choices, try 'I Love Pizza' for Italian delights or 'Taste of Punjab' for authentic Indian. What cuisine are you craving?";
    if (s.includes("menu") || s.includes("dish")) return "Tell me the restaurant or dish name, and I'll help you find it or suggest similar options!";
    return "Hmm, I'm not sure about that one. Could you rephrase? Or choose from the quick options below!";
  }

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!open && (
        <button onClick={() => setOpen(true)} className="rounded-full shadow-xl w-16 h-16 overflow-hidden hover:scale-105 transition animate-pulse">
          <img src="/zoomo-mascot.png" alt="Zoomo Mascot - Need help?" className="w-full h-full object-cover" />
        </button>
      )}
      {open && (
        <div className="w-96 rounded-3xl overflow-hidden ring-1 ring-white/10 bg-white/95 dark:bg-[#0b0f0c] dark:text-white shadow-2xl">
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/zoomo-mascot.png" alt="Zoomo Mascot" className="w-8 h-8 rounded-full animate-wiggle" />
              <div className="font-semibold">Zoomo Assist</div>
            </div>
            <button onClick={() => setOpen(false)} className="text-sm" aria-label="Close chat"><FiX /></button>
          </div>
          <div ref={chatRef} className="h-80 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div className={`flex items-start gap-2 max-w-[80%] ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                  {m.role === "bot" && <img src="/zoomo-mascot.png" alt="Bot" className="w-8 h-8 rounded-full flex-shrink-0" />}
                  {m.role === "user" && <div className="w-8 h-8 rounded-full bg-emerald-600 text-white grid place-content-center flex-shrink-0">U</div>}
                  <div className={`px-4 py-2 rounded-2xl ${m.role === "user" ? "bg-emerald-600 text-white" : "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200"}`}>
                    {m.text}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2">
                  <img src="/zoomo-mascot.png" alt="Bot" className="w-8 h-8 rounded-full flex-shrink-0" />
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-2xl">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="px-3 pb-2 flex flex-wrap gap-2">
            {quick.map(q => (
              <button key={q} onClick={() => send(q)} className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition">{q}</button>
            ))}
          </div>
          <div className="p-3 flex items-center gap-2 border-t border-white/10">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 rounded-xl bg-gray-100 dark:bg-white/10 focus:outline-none text-gray-900 dark:text-white placeholder-gray-500"
            />
            <button onClick={() => send()} className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:brightness-110 transition">
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Loading spinner component
function LoadingSpinner() {
  return (
    <div className="flex justify-center py-10">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500"></div>
    </div>
  );
}
