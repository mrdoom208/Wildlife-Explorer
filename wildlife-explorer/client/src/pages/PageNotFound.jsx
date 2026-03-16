import { motion } from "framer-motion";
import { Home, Search, ArrowLeft, AlertTriangle, Leaf } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function PageNotFound() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50" />

      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-green-200/50 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-48 h-48 bg-blue-200/30 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 flex flex-col items-center justify-center min-h-[70vh] text-center">
        {/* Main Illustration */}
        <motion.div
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="mb-12"
        >
          <div className="relative">
            <AlertTriangle className="w-32 h-32 text-yellow-400 mx-auto drop-shadow-2xl" />
            <Leaf className="w-20 h-20 absolute -top-2 -right-2 text-green-500 animate-bounce" />
            <Leaf className="w-16 h-16 absolute -bottom-2 -left-2 text-emerald-500 animate-bounce delay-300" />
          </div>
        </motion.div>

        {/* Error Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent drop-shadow-lg"
        >
          404
        </motion.h1>

        {/* Main Message */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 max-w-2xl mx-auto leading-tight"
        >
          Hmm... this wildlife trail seems to have vanished!
        </motion.p>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-xl md:text-2xl text-gray-700 mb-12 max-w-lg mx-auto leading-relaxed"
        >
          The page you're looking for has wandered off into the wild.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 mb-12 w-full max-w-md"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-4 px-6 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 text-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </motion.button>

          <Link
            to="/"
            className="flex-1 bg-white/80 backdrop-blur-sm hover:bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-900 py-4 px-6 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-lg"
          >
            <Home className="w-5 h-5" />
            Home
          </Link>
        </motion.div>

        {/* Search Suggestion */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg max-w-2xl w-full"
        >
          <div className="flex flex-col md:flex-row items-center gap-4">
            <Search className="w-12 h-12 text-gray-400 flex-shrink-0" />
            <div>
              <p className="text-lg font-semibold text-gray-900 mb-2">
                Lost in the wilderness?
              </p>
              <p className="text-gray-600">
                Try searching for animals, habitats, or conservation topics.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Footer Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="flex flex-wrap gap-4 mt-12 pt-8 border-t border-gray-200/50 text-sm text-gray-600"
        >
          <Link
            to="/"
            className="hover:text-green-600 transition-colors flex items-center gap-1"
          >
            <Home className="w-4 h-4" /> Home
          </Link>
          <Link
            to="/animals"
            className="hover:text-green-600 transition-colors flex items-center gap-1"
          >
            Wildlife
          </Link>
          <Link
            to="/updates"
            className="hover:text-green-600 transition-colors flex items-center gap-1"
          >
            Updates
          </Link>
          <Link
            to="/about"
            className="hover:text-green-600 transition-colors flex items-center gap-1"
          >
            About
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
