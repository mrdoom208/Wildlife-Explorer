import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';


export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  // Check if user is logged in (admin)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  // Check if user is logged in (admin)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [location]);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setMobileOpen(false);
    window.location.href = '/';
  };

  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed w-full z-50 backdrop-blur-xl shadow-xl bg-white/80 border-gray-200 text-gray-900 border-b transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-2xl font-bold transition-all bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"
          >
            Wildlife Explorer
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Main Nav Links (Public Pages) */}
            {!isAdminPage && (
              <>
                <Link 
                  to="/" 
                  className="px-3 py-2 rounded-xl font-medium transition-all text-gray-700 hover:text-green-600 hover:bg-green-50"
                >
                  Home
                </Link>
                <Link 
                  to="/about" 
                  className="px-3 py-2 rounded-xl font-medium transition-all text-gray-700 hover:text-green-600 hover:bg-green-50"
                >
                  About
                </Link>
                <Link 
                  to="/gallery" 
                  className="px-3 py-2 rounded-xl font-medium transition-all text-gray-700 hover:text-green-600 hover:bg-green-50"
                >
                  Gallery
                </Link>
                <Link 
                  to="/newsletter" 
                  className="px-3 py-2 rounded-xl font-medium transition-all text-gray-700 hover:text-green-600 hover:bg-green-50"
                >
                  Newsletter
                </Link>
              </>
            )}

            
            {/* Admin Dashboard Link (Admin Pages) */}
            {isAdminPage && (
              <Link 
                to="/admin/dashboard" 
                className="px-6 py-3 text-white font-semibold bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-2xl shadow-lg hover:shadow-xl transition-all"
              >
                Dashboard
              </Link>
            )}

            {/* Admin Badge (when logged in, not on admin page) */}
            {user && user.role === 'admin' && !isAdminPage && (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl backdrop-blur-sm border border-green-500/30 shadow-lg">
                <Shield className="w-4 h-4 text-green-400" />
                <Link 
                  to="/admin/dashboard" 
                  className="font-semibold transition-all text-green-800 hover:text-green-700"
                >
                  Admin
                </Link>
              </div>
            )}

            {/* Admin Login Button (when not logged in) */}
            {!user && !isAdminPage && (
              <Link 
                to="login" 
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all"
              >
                Login
              </Link>
            )}

            {/* Logout Button (when logged in) */}
            {user && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold shadow-lg transition-all border bg-red-500/10 hover:bg-red-500/20 text-red-700 border-red-500/20 hover:border-red-500/40"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </motion.button>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <motion.button 
            whileTap={{ scale: 0.95 }}
            className="p-2.5 rounded-xl transition-all md:hidden bg-gray-100/50 hover:bg-gray-200/50 text-gray-900"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>

        {/* Mobile Dropdown Menu */}
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: mobileOpen ? 1 : 0, 
            height: mobileOpen ? 'auto' : 0 
          }}
          transition={{ duration: 0.2 }}
          className="md:hidden overflow-hidden transition-all bg-white/95 backdrop-blur-xl border-gray-200 text-gray-900 border-t"
        >
          <div className="px-4 py-6 space-y-3">
            {/* Mobile Nav Links */}
            {!isAdminPage && (
              <>
                <Link 
                  to="/" 
                  className="block w-full text-left px-4 py-3 rounded-xl font-medium transition-all text-gray-700 hover:text-green-600 hover:bg-green-50"
                  onClick={() => setMobileOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/about" 
                  className="block w-full text-left px-4 py-3 rounded-xl font-medium transition-all text-gray-700 hover:text-green-600 hover:bg-green-50"
                  onClick={() => setMobileOpen(false)}
                >
                  About
                </Link>
                <Link 
                  to="/gallery" 
                  className="block w-full text-left px-4 py-3 rounded-xl font-medium transition-all text-gray-700 hover:text-green-600 hover:bg-green-50"
                  onClick={() => setMobileOpen(false)}
                >
                  Gallery
                </Link>
                <Link 
                  to="/newsletter" 
                  className="block w-full text-left px-4 py-3 rounded-xl font-medium transition-all text-gray-700 hover:text-green-600 hover:bg-green-50"
                  onClick={() => setMobileOpen(false)}
                >
                  NewsLetter
                </Link>
                
              </>
            )}
            
            {/* Admin Dashboard Link */}
            {isAdminPage && (
              <Link 
                to="/admin/dashboard"
                className="block w-full text-center px-6 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all"
                onClick={() => setMobileOpen(false)}
              >
                Dashboard
              </Link>
            )}
            
            {/* Admin Badge (Mobile) */}
            {user && user.role === 'admin' && !isAdminPage && (
              <Link 
                to="/admin/dashboard"
                className="block w-full px-4 py-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl backdrop-blur-sm border border-green-500/40 shadow-lg font-semibold transition-all hover:shadow-xl"
                onClick={() => setMobileOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span className="text-green-800">Admin Dashboard</span>
                </div>
              </Link>
            )}
            
            {/* Mobile Admin Login */}
            {!user && !isAdminPage && (
              <Link 
                to="/admin/login"
                className="block w-full text-center px-6 py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all mt-2"
                onClick={() => setMobileOpen(false)}
              >
                Admin Login
              </Link>
            )}
            
            {/* Mobile Logout */}
            {user && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold shadow-lg transition-all border bg-red-500/20 hover:bg-red-500/30 text-red-700 border-red-500/30"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}
