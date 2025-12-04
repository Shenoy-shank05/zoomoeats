import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";
import apiService from "../services/apiService";
import { useUser } from "../context/UserContext";

export default function LoginPage() {
  const nav = useNavigate();
  const { setUser } = useUser(); // Access setUser from UserContext
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const credentials = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      const response = await apiService.login(credentials);
      
      // Get user profile after successful login
      const profile = await apiService.getProfile();
      localStorage.setItem("ze_user", JSON.stringify(profile));
      setUser(profile); // Update global user state

      // Role-based redirection
      if (profile.role === "ADMIN") {
        nav("/admin");
      } else if (profile.role === "MERCHANT") {
        nav("/owner");
      } else {
        nav("/");
      }
    } catch (err) {
      setError("Invalid email or password. Please try again.");
      console.error("Login failed:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-white dark:bg-[#0b0f0c] text-black dark:text-white px-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-3xl overflow-hidden ring-1 ring-black/10 bg-white dark:bg-white/5 p-6 space-y-4">
        <div className="text-2xl font-bold">Welcome back</div>
        
        {error && (
          <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}
        
        <div className="relative">
          <input 
            name="email" 
            type="email"
            required 
            placeholder="Email" 
            className="w-full px-4 py-3 pl-11 rounded-xl bg-gray-50 dark:bg-white/10" 
          />
          <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 opacity-70" />
        </div>
        
        <div className="relative">
          <input 
            name="password" 
            required 
            type="password" 
            placeholder="Password" 
            className="w-full px-4 py-3 pl-11 rounded-xl bg-gray-50 dark:bg-white/10" 
          />
          <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 opacity-70" />
        </div>
        
        <button 
          type="submit"
          disabled={loading}
          className="w-full px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white flex items-center justify-center gap-2 transition-colors"
        >
          <FiLogIn/> {loading ? "Signing in..." : "Login"}
        </button>
        
        <div className="text-sm text-gray-600 dark:text-gray-300">
          New here? <Link to="/signup" className="text-emerald-600 hover:text-emerald-700">Create an account</Link>
        </div>
      </form>
    </div>
  );
}
