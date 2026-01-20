import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, ArrowRight } from 'lucide-react';

export default function Gallery({ animals: initialAnimals, setSelectedAnimal }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  
  const animals = initialAnimals || [];
  const categories = ['all', 'mammals', 'birds', 'reptiles', 'amphibians', 'fish', 'invertebrates'];

  const filteredAnimals = animals.filter(animal => {
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
      {/* Title */}
      <motion.h2 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-bold text-center mb-20 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent"
      >
        Wildlife Gallery
      </motion.h2>

      {/* Search & Filters */}
      <div className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X size={18} className="text-gray-500 hover:text-red-500" />
            </button>
          )}
          <input
            type="text"
            placeholder="Search animals by name or facts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-12 py-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/30 focus:outline-none transition-all"
          />
        </div>
        
        <div className="flex flex-wrap gap-2 items-center">
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap shadow-sm ${
                category === cat
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                  : 'bg-white/90 text-gray-900 hover:bg-white border border-gray-200 hover:border-gray-300'
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
          
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

      {/* Results counter */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50">
          <Filter className="w-5 h-5 text-emerald-600" />
          <span className="font-medium text-gray-800">
            {filteredAnimals.length} of {animals.length} animals
          </span>
        </div>
      </div>

      {/* Animal Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <AnimatePresence>
          {filteredAnimals.slice(0, 12).map((animal) => (  // ✅ CHANGED: 12 animals max
            <motion.div
              key={animal._id || animal.id || animal.name}
              layout
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
              className="group cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedAnimal(animal);
              }}
              role="button"
              tabIndex={0}
              aria-label={`View details for ${animal.name}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedAnimal(animal);
                }
              }}
            >
              <div className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:shadow-emerald-500/20 border border-gray-100/50">
                <div className="relative overflow-hidden h-64">
                  <img 
                    src={animal.image} 
                    alt={animal.name}
                    className="w-full h-full object-cover brightness-105 saturate-110 group-hover:scale-110 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="absolute top-4 left-4 bg-white/95 px-3 py-1 rounded-full text-sm font-semibold text-gray-800 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg">
                    {animal.category}
                  </span>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-2 text-gray-900 group-hover:text-emerald-600 transition-colors">
                    {animal.name}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {animal.facts}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl text-gray-500">{animal.habitat}</span>
                    <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-emerald-200">
                      <Filter size={20} className="text-emerald-600" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty state */}
        {filteredAnimals.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="col-span-full flex flex-col items-center justify-center py-24 text-center"
          >
            <Filter className="w-24 h-24 text-gray-400 mb-6 opacity-50 animate-pulse" />
            <h3 className="text-3xl font-bold text-gray-700 mb-4">No animals found</h3>
            <p className="text-lg text-gray-500 mb-8">Try adjusting your search or filters</p>
            <button
              onClick={clearFilters}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-emerald-500/25 transition-all"
            >
              Clear Filters
            </button>
          </motion.div>
        )}

        {/* See More Button */}
        {animals.length > 12 && filteredAnimals.length >= 12 && (  // ✅ CHANGED: > 12 animals
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="col-span-full flex justify-center py-12"
          >
            <a
              href="/gallery"
              className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-bold rounded-3xl shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 text-lg border border-emerald-300/50"
            >
              See More Animals
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}
