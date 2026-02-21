import { useEffect } from "react";
import { motion } from "framer-motion";

export default function Hero() {
  useEffect(() => {
    // Log the visitor on page load
    fetch("http://localhost:5000/api/visitor/log", { method: "POST" }).catch(
      (err) => console.error("Visitor log error:", err),
    );
  }, []);

  return (
    <section className="relative overflow-hidden min-h-[70vh]">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-100 via-blue-100 to-purple-100" />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center
                   pt-24 pb-20 md:pt-36 md:pb-36"
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          Discover Wildlife
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed text-gray-800"
        >
          Explore endangered species, their habitats, and conservation efforts
          across the globe.
        </motion.p>
      </motion.div>
    </section>
  );
}
