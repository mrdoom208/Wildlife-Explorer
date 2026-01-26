import { motion } from 'framer-motion';
import { useState } from 'react';
import { Newspaper, Calendar, User, X } from 'lucide-react';
import { allUpdates } from '../data/news';

export default function UpdatesPage() {
  // Full dataset


  // State for pagination
  const [visibleUpdates, setVisibleUpdates] = useState(6);
  const [selectedUpdate, setSelectedUpdate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (update) => {
    setSelectedUpdate(update);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUpdate(null);
  };

  const loadMore = () => {
    setVisibleUpdates(prev => Math.min(prev + 6, allUpdates.length));
  };

  const getColorClass = (color) => {
    const colors = {
      green: 'from-green-500 to-blue-500',
      blue: 'from-blue-500 to-green-500'
    };
    return colors[color] || colors.green;
  };

  const displayUpdates = allUpdates.slice(0, visibleUpdates);

  return (
    <section className="relative overflow-hidden min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-white" />
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 md:pt-36 md:pb-20">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"
          >
            Wildlife Updates
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed text-gray-800"
          >
            Latest conservation successes, discoveries, and protection efforts.
          </motion.p>
        </motion.div>

        {/* Updates List */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-3 mb-16"
        >
          {displayUpdates.map((update, index) => (
            <motion.div
              key={update.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * index }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="group bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200/50 hover:shadow-2xl hover:bg-white/90 cursor-pointer border-l-4 border-l-green-500 hover:border-l-green-600 transition-all duration-200"
              onClick={() => openModal(update)}
            >
              <div className="flex items-start p-2 lg:p-5 gap-4">
                <div className="flex flex-col items-center gap-2 pt-1 min-w-[60px]">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${getColorClass(update.image)} flex items-center justify-center shadow-lg group-hover:scale-110 transition-all border-2 border-white/50`}>
                    <Newspaper className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-xs text-gray-500 font-medium flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {update.date}
                  </div>
                </div>

                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`inline-block bg-gradient-to-r ${getColorClass(update.image)} text-white px-3 py-1 rounded-lg text-xs font-semibold shadow-md group-hover:scale-105 transition-all`}>
                      {update.category}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <User className="w-3 h-3" />
                      {update.author}
                    </div>
                  </div>
                  
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-800 line-clamp-2 leading-tight">
                    {update.title}
                  </h3>
                  
                  <p className="text-gray-700 mb-4 leading-relaxed line-clamp-2 text-sm">
                    {update.excerpt}
                  </p>
                  
                  <div className="flex items-center text-green-600 font-semibold group-hover:translate-x-2 transition-all text-sm">
                    Read Full Update →
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Load More Button - Only show if more updates available */}
        {visibleUpdates < allUpdates.length && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={loadMore}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-12 py-4 rounded-xl text-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              Load More Updates ({allUpdates.length - visibleUpdates} remaining)
            </motion.button>
          </motion.div>
        )}

        {/* Show completion message */}
        {visibleUpdates >= allUpdates.length && allUpdates.length > 0 && (
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-gray-600 text-lg font-medium mt-8"
          >
            🎉 All {allUpdates.length} updates loaded!
          </motion.p>
        )}
      </div>

      {/* Modal - unchanged */}
      {isModalOpen && selectedUpdate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden border border-gray-200 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className={`inline-block bg-gradient-to-r ${getColorClass(selectedUpdate.image)} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                    {selectedUpdate.category}
                  </span>
                  <h2 className="text-2xl font-bold text-gray-900 mt-2">
                    {selectedUpdate.title}
                  </h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={closeModal}
                  className="p-2 ml-4 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </motion.button>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{selectedUpdate.date}</span>
                <span>•</span>
                <User className="w-4 h-4" />
                <span>{selectedUpdate.author}</span>
              </div>
            </div>

            {/* Hero Image */}
            <div className="h-48 sm:h-56 md:h-64 bg-gradient-to-r relative overflow-hidden">
              <img 
                src={selectedUpdate.imageSrc}
                alt={selectedUpdate.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8 flex-1 overflow-y-auto">
              <p className="text-gray-700 leading-relaxed">
                {selectedUpdate.fullContent}
              </p>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={closeModal}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Close Update
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
