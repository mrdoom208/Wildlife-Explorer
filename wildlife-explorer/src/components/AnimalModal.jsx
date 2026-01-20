import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function AnimalModal({ animal, onClose }) {
  if (!animal) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.7, opacity: 0 }}
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[95vh] m-auto"  // ✅ Removed dark:bg-gray-900
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 md:p-8 max-h-[95vh] overflow-y-auto">
          <div className="flex justify-between items-start mb-6 md:mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {animal.name}
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 md:p-2 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-colors flex-shrink-0 ml-4"
              aria-label="Close modal"
            >
              <X size={18} className="md:w-5 md:h-5" />
            </button>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-12">
            {/* Left Column: Image + Habitat/Diet */}
            <div className="flex-1 flex flex-col w-full lg:w-auto">
              <div className="w-full h-48 sm:h-64 md:h-80 lg:h-96 flex-shrink-0 mb-4 md:mb-6 lg:mb-8">
                <img 
                  src={animal.image || 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800'} 
                  alt={animal.name}
                  className="w-full h-full object-cover rounded-2xl shadow-2xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 md:gap-3 lg:gap-4 flex-shrink-0">
                <div className="bg-green-50 p-3 md:p-4 lg:p-6 rounded-xl md:rounded-2xl">
                  <h4 className="font-semibold text-green-800 mb-1 text-xs md:text-sm lg:text-base">Habitat</h4>
                  <p className="text-xs md:text-sm lg:text-base xl:text-lg truncate">{animal.habitat || '🌍'}</p>
                </div>
                <div className="bg-blue-50 p-3 md:p-4 lg:p-6 rounded-xl md:rounded-2xl">
                  <h4 className="font-semibold text-blue-800 mb-1 text-xs md:text-sm lg:text-base">Diet</h4>
                  <p className="text-xs md:text-sm lg:text-base xl:text-lg truncate">{animal.diet || 'Omnivore'}</p>
                </div>
              </div>
            </div>
            
            {/* Right Column: Description + Conservation Status */}
            <div className="flex-1 flex flex-col">
              <div className="flex-1 mb-4 md:mb-6 lg:mb-8">
                <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-700 text-justify">
                  {animal.description || animal.facts || 'No description available.'}
                </p>
              </div>
              
              <div className="flex-shrink-0">
                <div className="flex items-start space-x-3 p-3 md:p-4 bg-gray-50 rounded-xl md:rounded-2xl">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h5 className="font-semibold text-gray-900 text-sm md:text-base">Conservation Status</h5>
                    <p className="text-gray-700 text-xs sm:text-sm md:text-base">Vulnerable - Population declining due to habitat loss</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
