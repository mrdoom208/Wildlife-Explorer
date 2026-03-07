import { motion } from "framer-motion";
import { Mail, Globe, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useAnimals } from "../hooks/useAnimals";
import { useReserves } from "../hooks/useReserves";

export default function About() {
  const { animals, animalsLoading } = useAnimals();
  const { reserves, isLoading: reservesLoading } = useReserves();

  const totalAnimals = animals.length;
  const totalReserves = reserves.length;

  const [totalVisitors, setTotalVisitors] = useState(0);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/visitor/count`)
      .then((res) => res.json())
      .then((data) => setTotalVisitors(data.totalVisitors))
      .catch(console.error);
  }, []);

  const missionStats = [
    { number: animalsLoading ? "Loading..." : totalAnimals, label: "Species" },
    {
      number: reservesLoading ? "Loading..." : totalReserves,
      label: "Reserves",
    },
    { number: totalVisitors || "0", label: "Visitors" },
    { number: "30+", label: "Resources" },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Hero - KEPT */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-900 to-blue-900 text-white py-32">
        <div className="absolute inset-0 bg-black/20"></div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            Wildlife Conservation Hub
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Your comprehensive resource for endangered species, habitats, and
            global conservation efforts.
          </motion.p>
        </motion.div>
      </section>

      {/* Mission Stats - KEPT */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center mb-20">
          {missionStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4 group-hover:scale-110 transition-transform cursor-default">
                <span className="z-10">{stat.number}</span>
              </div>
              <div className="text-lg font-semibold text-gray-700">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mission Statement - KEPT */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-8">
            Our Mission
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-12">
            Wildlife Explorer is dedicated to the preservation of biodiversity
            through education and research conservation efforts.
          </p>
        </motion.div>
      </section>

      {/* Conservation Efforts - UPDATED */}
      <section className="py-20 bg-gradient-to-r from-green-50 to-blue-50 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-center mb-20 bg-gradient-to-r from-green-800 to-blue-600 bg-clip-text text-transparent"
          >
            Our Focus Areas
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* ✅ NEW #1: Educational Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500"
            >
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                <Globe className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">
                Educational Content
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Comprehensive information on endangered species, habitats, and
                conservation efforts worldwide.
              </p>
            </motion.div>

            {/* ✅ NEW #2: Wildlife Database */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">
                Wildlife Database
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Detailed profiles of species, reserves, and conservation
                projects with regularly updated information.
              </p>
            </motion.div>

            {/* ✅ KEPT #3: Education Outreach */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500"
            >
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6">
                <Mail className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">
                Education Outreach
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Providing wildlife education resources accessed by students.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ✅ NEW Contact Section with YOUR EMAIL */}
      <section className="py-20 px-4 max-w-4xl mx-auto" id="contact">
        <motion.h3
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-green-800 to-blue-600 bg-clip-text text-transparent"
        >
          Get In Touch
        </motion.h3>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-12 max-w-2xl mx-auto text-center"
        >
          <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
            <Mail className="w-12 h-12 text-white" />
          </div>

          <h4 className="text-3xl font-bold mb-6 text-gray-900">
            Recommendations & Suggestions
          </h4>

          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            For content recommendations, suggestions, or collaboration
            opportunities
          </p>

          <p className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-green-600 to-blue-600 text-white px-5 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold text-sm sm:text-base md:text-lg shadow-xl transition-all duration-300">
            <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
            explorerwildlife461@gmail.com
          </p>

          <p className="text-sm text-gray-600 mt-8 pt-6 border-t border-gray-200">
            📍 Based in Quezon City, Philippines
          </p>
        </motion.div>
      </section>
    </div>
  );
}
