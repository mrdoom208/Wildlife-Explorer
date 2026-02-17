import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer";

import Hero from "./pages/home/Hero.jsx";
import Gallery from "./pages/home/Gallery";
import MapSection from "./pages/home/MapSection.jsx";

import About from "./pages/About.jsx";
import Newsletter from "./pages/Newsletter.jsx";
import FullGallery from "./pages/FullGallery.jsx";
import AnimalModal from "./pages/AnimalModal.jsx";

import Register from "./pages/Register.jsx";
import AdminLogin from "./pages/Login.jsx";

import AnimalCollection from "./pages/admin/AnimalCollection.jsx";
import AdminUsers from "./pages/admin/UsersManagement.jsx";
import AdminDashboard from "./pages/admin/Dashboard.jsx";
import Reserves from "./pages/admin/reserves/index.jsx";

import { useAnimals } from "./hooks/useAnimals";
import { AuthProvider } from "./contexts/AuthContext.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";

function AppContent() {
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const location = useLocation();

  // ✅ Use the animals hook
  const { animals, isLoading, refetch } = useAnimals();

  // Hide header on admin login
  const hideHeader =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 transition-all duration-500">
      {!hideHeader && <Header />}

      <Routes>
        <Route
          path="/"
          element={
            <div className="min-h-screen pt-20">
              <Hero />
              <Gallery
                animals={animals}
                isLoading={isLoading}
                setSelectedAnimal={setSelectedAnimal}
              />
              <MapSection />
            </div>
          }
        />
        <Route
          path="/gallery"
          element={
            <FullGallery
              animals={animals}
              isLoading={isLoading}
              setSelectedAnimal={setSelectedAnimal}
            />
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/reserves" element={<MapSection />} />
        <Route path="/newsletter" element={<Newsletter />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="animalCollection" element={<AnimalCollection />} />
          <Route path="navigation" element={<Reserves />} />
          {/*<Route path="animals" element={<AdminAnimals />} />*/}
          {/*<Route path="reports" element={<AdminReports />} />*/}
          {/*<Route path="settings" element={<AdminSettings />} />*/}
        </Route>
      </Routes>

      <AnimatePresence>
        {selectedAnimal && (
          <AnimalModal
            animal={selectedAnimal}
            onClose={() => setSelectedAnimal(null)}
          />
        )}
      </AnimatePresence>

      {!hideHeader && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
