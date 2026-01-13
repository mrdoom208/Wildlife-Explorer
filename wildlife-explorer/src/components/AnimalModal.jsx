import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function AnimalModal({ animal, onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.7, opacity: 0 }}
          className="bg-white dark:bg-gray-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-8">
            <div className="flex justify-between items-start mb-8">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                {animal.name}
              </h2>
              <button
                onClick={onClose}
                className="p-3 rounded-2xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <img 
                  src={animal.image} 
                  alt={animal.name}
                  className="w-full h-96 object-cover rounded-2xl shadow-2xl mb-8"
                />
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-2xl">
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Habitat</h4>
                    <p className="text-lg">{animal.habitat}</p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-2xl">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Diet</h4>
                    <p className="text-lg">{animal.diet}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-lg leading-relaxed mb-8 text-gray-700 dark:text-gray-300">
                  {animal.description}
                </p>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <h5 className="font-semibold">Conservation Status</h5>
                      <p>Vulnerable - Population declining due to habitat loss</p>
                    </div>
                  </div>
                  <button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-4 px-8 rounded-2xl font-semibold shadow-xl hover:shadow-green-500/25 transition-all">
                    Learn How to Help
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
