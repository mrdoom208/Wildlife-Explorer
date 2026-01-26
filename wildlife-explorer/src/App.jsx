import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header.jsx';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import MapSection from './components/MapSection.jsx';
import About from './components/About';
import FullGallery from './components/FullGallery';
import Footer from './components/Footer';
import AnimalModal from './components/AnimalModal';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { useAnimals } from './hooks/useAnimals';

function AppContent() {
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const location = useLocation();

  // ✅ Use the animals hook
  const { animals, isLoading, refetch } = useAnimals();

  // Hide header on admin login
  const hideHeader = location.pathname === '/admin/login';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 transition-all duration-500">
      {!hideHeader && <Header />}
      
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen pt-20">
            <Hero />
            <Gallery 
              animals={animals} 
              isLoading={isLoading}
              setSelectedAnimal={setSelectedAnimal} 
            />
            <MapSection />
          </div>
        } />
        <Route path="/gallery" element={
          <FullGallery 
            animals={animals} 
            isLoading={isLoading}
            setSelectedAnimal={setSelectedAnimal} 
          />
        } />
        <Route path="/about" element={<About />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/reserves" element={<MapSection/>} />
      </Routes>
      
      <AnimatePresence>
        {selectedAnimal && (
          <AnimalModal animal={selectedAnimal} onClose={() => setSelectedAnimal(null)} />
        )}
      </AnimatePresence>
      
      <Footer />
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
