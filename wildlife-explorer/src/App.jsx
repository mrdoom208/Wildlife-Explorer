import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header.jsx";
import Hero from "./pages/home/Hero.jsx";
import Gallery from "./pages/home/Gallery";
import MapSection from "./pages/home/MapSection.jsx";
import About from "./pages/About.jsx";
import Newsletter from "./pages/Newsletter.jsx";
import FullGallery from "./pages/FullGallery.jsx";
import Footer from "./components/Footer";
import AnimalModal from "./pages/AnimalModal.jsx";
import AdminLogin from "./pages/Login.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import Register from "./pages/Register.jsx";
import { useAnimals } from "./hooks/useAnimals";

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
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/reserves" element={<MapSection />} />
        <Route path="/newsletter" element={<Newsletter />} />
        <Route path="/register" element={<Register />} />
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
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
