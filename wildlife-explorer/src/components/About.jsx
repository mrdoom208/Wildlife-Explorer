import { motion } from 'framer-motion';
import { Mail, Twitter, Instagram, Facebook, Heart, Globe } from 'lucide-react';
import { useState } from 'react';
import { useNewsletter } from '../hooks/useNewsletter';

export default function About() {
  const { subscribe, loading, message, error, setMessage, setError } = useNewsletter();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await subscribe(email);
    setEmail(''); // Reset form
  } catch (err) {
    // Error handled by hook
    }
  };


  const missionStats = [
    { number: '127', label: 'Species Protected' },
    { number: '24', label: 'Countries Active' },
    { number: '15K+', label: 'Volunteers' },
    { number: '98%', label: 'Success Rate' }
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
            Protecting endangered species and their habitats for future generations.
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
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4 group-hover:scale-110 transition-transform">
                {stat.number}
              </div>
              <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
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
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-8">
            Our Mission
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed mb-12">
            Wildlife Explorer is dedicated to the preservation of biodiversity through education, research, and on-the-ground conservation efforts. 
            We work with local communities and governments to protect critical habitats and endangered species worldwide.
          </p>
        </motion.div>
      </section>

      {/* Conservation Efforts */}
      <section className="py-20 bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-900/50 dark:to-gray-800/50 px-4">
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
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500"
            >
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-2xl flex items-center justify-center mb-6">
                <Globe className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Habitat Protection</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Protected over 2.5 million acres of critical wildlife habitats through partnerships and land acquisition programs.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500"
            >
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Species Recovery</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Successfully reintroduced 12 endangered species to their native habitats with 92% survival rates.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500"
            >
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/50 rounded-2xl flex items-center justify-center mb-6">
                <Mail className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Education Outreach</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Reached 500,000+ students through wildlife education programs in 47 countries.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 px-4 max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-green-500 to-blue-600 rounded-3xl p-12 text-white text-center shadow-2xl"
        >
          <Mail className="w-20 h-20 mx-auto mb-8 opacity-75" />
          <h3 className="text-3xl md:text-4xl font-bold mb-6">Stay Updated</h3>
          <p className="text-xl mb-12 max-w-2xl mx-auto leading-relaxed opacity-90">
            Join 50K+ conservationists receiving monthly updates on wildlife protection efforts.
          </p>
          
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-6 py-4 rounded-2xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/50 font-semibold text-lg"
                disabled={loading}
                required
              />
              <button 
                type="submit"
                disabled={loading}
                className={`px-10 py-4 rounded-2xl font-bold text-lg shadow-xl transition-all whitespace-nowrap ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-white text-green-600 hover:shadow-green-500/25 hover:scale-105'
                }`}
              >
                {loading ? '...' : 'Subscribe'}
              </button>
            </div>
            
            {message && (
              <motion.p 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 bg-white/20 backdrop-blur-sm px-8 py-4 rounded-2xl font-semibold text-green-100"
              >
                {message}
              </motion.p>
            )}
            
            {error && (
              <motion.p 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 bg-red-500/20 backdrop-blur-sm px-8 py-4 rounded-2xl font-semibold text-red-100 border border-red-500/30"
              >
                {error}
              </motion.p>
            )}
          </form>
        </motion.div>
      </section>

      {/* Contact & Social */}
      <section className="py-20 px-4 max-w-4xl mx-auto">
        <h3 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          Get Involved
        </h3>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <h4 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Contact Information</h4>
            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-xl flex items-center justify-center">
                  <Globe className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Global Headquarters</p>
                  <p className="text-gray-700 dark:text-gray-300">Quezon City, Philippines</p>
                </div>
              </div>
              <a href="mailto:info@wildlifeexplorer.org" className="block w-full flex items-center space-x-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-2xl hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all group">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">info@wildlifeexplorer.org</p>
                </div>
              </a>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-center"
          >
            <h4 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">Follow Our Journey</h4>
            <div className="flex justify-center space-x-6 pt-4">
              <a href="#" className="group p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl hover:bg-blue-500 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110" aria-label="Twitter">
                <Twitter className="w-8 h-8 group-hover:-rotate-12 transition-transform" />
              </a>
              <a href="#" className="group p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl hover:bg-pink-500 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110" aria-label="Instagram">
                <Instagram className="w-8 h-8 group-hover:-rotate-12 transition-transform" />
              </a>
              <a href="#" className="group p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110" aria-label="Facebook">
                <Facebook className="w-8 h-8 group-hover:-rotate-12 transition-transform" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
