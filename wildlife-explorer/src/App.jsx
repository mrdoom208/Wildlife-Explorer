import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header.jsx';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import MapSection from './components/MapSection.jsx';
import About from './components/About';
import Footer from './components/Footer';
import AnimalModal from './components/AnimalModal';
import { animals } from './data/animals';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

function AppContent() {
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation(); // ✅ Track current page

  // Hide header on admin login
  const hideHeader = location.pathname === '/admin/login';

  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved === 'true') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = (mode) => {
    setDarkMode(mode);
    localStorage.setItem('darkMode', mode);
    if (mode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gradient-to-br from-green-50 to-blue-50'} transition-all duration-500`}>
      {/* ✅ HIDE HEADER ON LOGIN */}
      {!hideHeader && (
        <Header darkMode={darkMode} setDarkMode={toggleDarkMode} />
      )}
      
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen pt-20">
            <Hero />
            <Gallery animals={animals} setSelectedAnimal={setSelectedAnimal} />
            <MapSection />
          </div>
        } />
        <Route path="/about" element={<About />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
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
