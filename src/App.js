// src/App.js
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ZoomoEatsLanding from "./ZoomoEatsLanding";       // ✅ was ./LandingPage
import RestaurantsPage from "./RestaurantsPage";
import MenuPage from "./MenuPage";
import CartPage from "./CartPage";
import CheckoutPage from "./checkout/CheckoutPage";      // ✅ Add checkout page

import LoginPage from "./auth/LoginPage";                // ✅ folder path
import SignupPage from "./auth/SignupPage";              // ✅ folder path
import ProfilePage from "./profile/ProfilePage";         // ✅ folder path

import { CartProvider } from "./context/CartContext";    // ✅ .jsx is fine to omit

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ZoomoEatsLanding />} />
          <Route path="/restaurants" element={<RestaurantsPage />} />
          <Route path="/menu/:id" element={<MenuPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}
