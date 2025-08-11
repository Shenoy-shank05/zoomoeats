import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiUser, FiUserPlus, FiPhone } from "react-icons/fi";
import apiService from "../services/api";

export default function SignupPage() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const userData = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      phone: formData.get("phone") || undefined,
    };

    // Basic validation
    if (userData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      const response = await apiService.signup(userData);
      
      // Get user profile after successful signup
      const profile = await apiService.getProfile();
      localStorage.setItem("ze_user", JSON.stringify(profile));
      
      nav("/");
    } catch (err) {
      if (err.message.includes("400")) {
        setError("Email already exists. Please use a different email or try logging in.");
      } else {
        setError("Failed to create account. Please try again.");
      }
      console.error("Signup failed:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-white dark:bg-[#0b0f0c] text-black dark:text-white px-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-3xl overflow-hidden ring-1 ring-black/10 bg-white dark:bg-white/5 p-6 space-y-4">
        <div className="text-2xl font-bold">Create your account</div>
        
        {error && (
          <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}
        
        <div className="relative">
          <input 
            name="name" 
            required 
            placeholder="Full name" 
            className="w-full px-4 py-3 pl-11 rounded-xl bg-gray-50 dark:bg-white/10" 
          />
          <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 opacity-70" />
        </div>
        
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
            name="phone" 
            type="tel"
            placeholder="Phone Number (optional)" 
            className="w-full px-4 py-3 pl-11 rounded-xl bg-gray-50 dark:bg-white/10" 
          />
          <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 opacity-70" />
        </div>
        
        <div className="relative">
          <input 
            name="password" 
            required 
            type="password" 
            placeholder="Password (min 6 characters)" 
            className="w-full px-4 py-3 pl-11 rounded-xl bg-gray-50 dark:bg-white/10" 
          />
          <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 opacity-70" />
        </div>
        
        <button 
          type="submit"
          disabled={loading}
          className="w-full px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white flex items-center justify-center gap-2 transition-colors"
        >
          <FiUserPlus/> {loading ? "Creating Account..." : "Sign up"}
        </button>
        
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Already have an account? <Link to="/login" className="text-emerald-600 hover:text-emerald-700">Login</Link>
        </div>
      </form>
    </div>
  );
}
