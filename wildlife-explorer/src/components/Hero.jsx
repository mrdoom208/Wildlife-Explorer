import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="pt-24 pb-20 md:pt-32 md:pb-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-green-900/20 to-blue-900/20"></div>
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white"
      >
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent"
        >
          Discover Wildlife
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed"
        >
          Explore endangered species, their habitats, and conservation efforts across the globe.
        </motion.p>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-2xl hover:shadow-green-500/25 transition-all duration-300"
        >
          Explore Species <ArrowRight className="ml-2 inline" size={20} />
        </motion.button>
      </motion.div>
    </section>
  );
}
