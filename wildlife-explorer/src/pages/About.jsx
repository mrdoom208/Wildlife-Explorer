import { motion } from "framer-motion";
import { Mail, Twitter, Instagram, Facebook, Heart, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { useNewsletter } from "../hooks/useNewsletter";
import { useAnimals } from "../hooks/useAnimals";
import { useReserves } from "../hooks/useReserves";

export default function About() {
  const { subscribe, loading, message, error, setMessage, setError } =
    useNewsletter();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { animals, animalsLoading } = useAnimals();
  const { reserves, isLoading: reservesLoading } = useReserves();

  const totalAnimals = animals.length;
  const totalReserves = reserves.length;

  const [totalVisitors, setTotalVisitors] = useState(0);

  useEffect(() => {
    fetch("http://localhost:5000/api/visitor/count")
      .then((res) => res.json())
      .then((data) => setTotalVisitors(data.totalVisitors))
      .catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await subscribe(email);
      setEmail("");
    } catch (err) {
      // Error handled by hook
    }
  };

  const missionStats = [
    { number: animalsLoading ? "Loading..." : totalAnimals, label: "Species" },
    {
      number: reservesLoading ? "Loading..." : totalReserves,
      label: "Reserves",
    },
    { number: totalVisitors || "0", label: "Visitors" },
    { number: "98%", label: "Success Rate" },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Hero */}
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
            Conservation in Action
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Protecting endangered species and their habitats for future
            generations.
          </motion.p>
        </motion.div>
      </section>

      {/* Mission Stats */}
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

        {/* Mission Statement */}
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
            through education, research, and on-the-ground conservation efforts.
            We work with local communities and governments to protect critical
            habitats and endangered species worldwide.
          </p>
        </motion.div>
      </section>

      {/* Conservation Efforts */}
      <section className="py-20 bg-gradient-to-r from-green-50 to-blue-50 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-center mb-20 bg-gradient-to-r from-green-800 to-blue-600 bg-clip-text text-transparent"
          >
            Our Impact
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500"
            >
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                <Globe className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">
                Habitat Protection
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Protected over 2.5 million acres of critical wildlife habitats
                through partnerships and land acquisition programs.
              </p>
            </motion.div>

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
                Species Recovery
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Successfully reintroduced 12 endangered species to their native
                habitats with 92% survival rates.
              </p>
            </motion.div>

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
                Reached 500,000+ students through wildlife education programs in
                47 countries.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="relative overflow-hidden py-15 md:py-20">
        {/* Background gradient matching your theme */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-100 via-blue-100 to-purple-100" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-10"
          >
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight md:leading-snug"
            >
              <span className="z-10">Stay Updated</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed text-gray-800 mb-0"
            >
              Get the latest wildlife conservation news, discoveries, and
              success stories delivered straight to your inbox.
            </motion.p>
          </motion.div>

          {/* Newsletter Form */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 md:p-12 lg:p-16 max-w-2xl mx-auto"
          >
            <div className="space-y-6">
              {/* Email Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="relative"
              >
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full px-6 py-5 text-lg bg-white/50 backdrop-blur-sm border-2 border-emerald-200/50 rounded-2xl focus:border-emerald-400 focus:outline-none transition-all duration-300 text-gray-900 placeholder-gray-500 shadow-lg hover:shadow-xl"
                />
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 -m-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ scaleX: 0 }}
                  whileFocus={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>

              {/* Subscribe Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 25px 50px -12px rgba(16, 185, 129, 0.4)",
                }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 hover:from-emerald-700 hover:via-blue-700 hover:to-purple-700 text-white py-6 px-8 rounded-2xl text-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 backdrop-blur-sm border border-emerald-500/30"
              >
                <span className="flex items-center justify-center gap-3">
                  Subscribe Now
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </motion.button>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="pt-8 border-t border-emerald-200/50 space-y-4"
              >
                <p className="text-sm text-emerald-700 font-medium flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Weekly wildlife updates delivered to your inbox
                </p>
                <p className="text-sm text-emerald-700 font-medium flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Exclusive conservation stories and photos
                </p>
                <p className="text-sm text-emerald-700 font-medium flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  No spam, unsubscribe anytime
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Privacy Note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="text-center mt-12 text-gray-600 text-sm max-w-md mx-auto leading-relaxed"
          >
            We respect your privacy. Your information will never be shared with
            third parties.
          </motion.p>
        </div>
      </section>

      {/* Contact & Social */}
      <section className="pt-30 pb-20 px-4 max-w-4xl mx-auto" id="contact">
        <h3 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Get Involved
        </h3>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <h4 className="text-2xl font-bold mb-6 text-gray-900">
              Contact Information
            </h4>
            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Globe className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    Global Headquarters
                  </p>
                  <p className="text-gray-700">Quezon City, Philippines</p>
                </div>
              </div>
              <a
                href="mailto:info@wildlifeexplorer.org"
                className="block w-full flex items-center space-x-4 p-4 bg-blue-50 rounded-2xl hover:bg-blue-100 transition-all group"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    info@wildlifeexplorer.org
                  </p>
                </div>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-center"
          >
            <h4 className="text-2xl font-bold mb-8 text-gray-900">
              Follow Our Journey
            </h4>
            <div className="flex justify-center space-x-6 pt-4">
              <a
                href="#"
                className="group p-4 bg-gray-100 rounded-2xl hover:bg-blue-500 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter className="w-8 h-8 group-hover:-rotate-12 transition-transform" />
              </a>
              <a
                href="#"
                className="group p-4 bg-gray-100 rounded-2xl hover:bg-pink-500 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="w-8 h-8 group-hover:-rotate-12 transition-transform" />
              </a>
              <a
                href="#"
                className="group p-4 bg-gray-100 rounded-2xl hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="w-8 h-8 group-hover:-rotate-12 transition-transform" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
