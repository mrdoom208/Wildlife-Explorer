import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import { useAnimals } from '../hooks/useAnimals';

export default function Gallery({ animals: initialAnimals, setSelectedAnimal }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const { animals } = useAnimals(initialAnimals || []);
  
  // ✅ FIXED: Added MARINE category
  const categories = ['all', 'mammals', 'birds', 'reptiles', 'marine'];

  // ✅ FIXED: Better search (name + facts) + safe filter
  const filteredAnimals = (animals || []).filter(animal => {
    const matchesSearch = search === '' || 
      animal?.name?.toLowerCase().includes(search.toLowerCase()) ||
      (animal?.facts || '').toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || animal?.category === category;
    return matchesSearch && matchesCategory;
  });

  const clearFilters = () => {
    setSearch('');
    setCategory('all');
  };

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <motion.h2 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-bold text-center mb-20 bg-gradient-to-r from-gray-800 to-gray-600 dark:from-emerald-400 dark:to-blue-400 bg-clip-text text-transparent"
      >
        Wildlife Gallery
      </motion.h2>

      {/* ✅ FIXED Search & Filter - YOUR layout + Marine + Clear */}
      <div className="max-w-4xl mx-auto mb-12 flex flex-col md:flex-row gap-4">
        {/* Search - YOUR exact styling + Clear X */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-400" size={20} />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X size={18} className="text-gray-500 hover:text-red-500" />
            </button>
          )}
          <input
            type="text"
            placeholder="Search animals by name or facts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-12 py-4 bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-emerald-500/30 dark:focus:ring-blue-500/30 focus:outline-none transition-all"
          />
        </div>
        
        {/* Filters - YOUR exact styling + MARINE */}
        <div className="flex flex-wrap gap-2 items-center">
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                category === cat
                  ? 'bg-emerald-600 dark:bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                  : 'bg-white/80 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
          
          {/* ✅ Clear button when filters active */}
          {(search || category !== 'all') && (
            <button
              type="button"
              onClick={clearFilters}
              className="px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium shadow-lg hover:shadow-red-500/25 transition-all whitespace-nowrap"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ✅ Results counter */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
          <Filter className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span className="font-medium text-gray-800 dark:text-gray-200">
            {filteredAnimals.length} of {animals?.length || 0} animals
          </span>
        </div>
      </div>

      {/* YOUR exact Grid - untouched */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <AnimatePresence>
          {filteredAnimals.map((animal) => (
            <motion.div
              key={animal._id || animal.id || animal.name} // ✅ Better key
              layout
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
              className="group"
              onClick={() => setSelectedAnimal(animal)}
              role="button"
              tabIndex={0}
              aria-label={`View details for ${animal.name}`}
            >
              <div className="bg-white dark:bg-gray-800/95 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:shadow-emerald-500/20 dark:group-hover:shadow-blue-500/20 border border-gray-100/50 dark:border-gray-700/50">
                <div className="relative overflow-hidden h-64">
                  <img 
                    src={animal.image} 
                    alt={animal.name}
                    className="w-full h-full object-cover brightness-105 saturate-110 group-hover:scale-110 transition-all duration-500" // ✅ Better colors
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 dark:from-gray-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="absolute top-4 left-4 bg-white/95 dark:bg-gray-900/95 px-3 py-1 rounded-full text-sm font-semibold text-gray-800 dark:text-white opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg">
                    {animal.category}
                  </span>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {animal.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                    {animal.facts}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl text-gray-500 dark:text-gray-400">{animal.habitat}</span>
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/60 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-emerald-200 dark:hover:bg-emerald-800">
                      <Filter size={20} className="text-emerald-600 dark:text-emerald-400" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* ✅ Empty state */}
        {filteredAnimals.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="col-span-full flex flex-col items-center justify-center py-24 text-center"
          >
            <Filter className="w-24 h-24 text-gray-400 dark:text-gray-500 mb-6 opacity-50 animate-pulse" />
            <h3 className="text-3xl font-bold text-gray-700 dark:text-gray-300 mb-4">No animals found</h3>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">Try adjusting your search or filters</p>
            <button
              onClick={clearFilters}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-emerald-500/25 transition-all"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
