import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { motion } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { TerrestrialPin, MarinePin, FreshwaterPin, MountainPin, IslandPin } from './MapIcons';
import styles from './MapSection.module.css';

// Fix default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export const wildlifeReserves = [
  // TERRESTRIAL (Orange)
  { id: 1, name: "Serengeti National Park", coords: { lat: -2.3333, lng: 34.8333 }, type: "terrestrial", animalId: 1, animals: ["African Lion"], description: "Great Migration." },
  { id: 2, name: "Kruger National Park", coords: { lat: -24.0667, lng: 31.4833 }, type: "terrestrial", animalId: 4, animals: ["Asian Elephant"], description: "Big 5 safari." },
  { id: 3, name: "Masai Mara", coords: { lat: -1.5, lng: 35.8333 }, type: "terrestrial", animalId: 5, animals: ["Giraffe"], description: "Migration corridor." },

  // MARINE (Blue)
  { id: 4, name: "Great Barrier Reef", coords: { lat: -18.2871, lng: 147.6992 }, type: "marine", animalId: 11, animals: ["Vaquita"], description: "Largest coral reef." },
  { id: 5, name: "Sea of Cortez", coords: { lat: 28.5, lng: -112 }, type: "marine", animalId: 12, animals: ["Dugong"], description: "Marine biodiversity." },
  { id: 6, name: "Ningaloo Reef", coords: { lat: -22.6667, lng: 113.6667 }, type: "marine", animalId: 15, animals: ["Whale Shark"], description: "Whale shark aggregation." },

  // FRESHWATER (Cyan)
  { id: 7, name: "Pantanal Wetlands", coords: { lat: -16.2667, lng: -56.6667 }, type: "freshwater", animalId: 13, animals: ["Axolotl"], description: "Largest wetland." },
  { id: 8, name: "Lake Xochimilco", coords: { lat: 19.25, lng: -99.1 }, type: "freshwater", animalId: 14, animals: ["Golden Poison Frog"], description: "Axolotl habitat." },
  { id: 9, name: "Okavango Delta", coords: { lat: -19.0344, lng: 22.3667 }, type: "freshwater", animals: ["Hippo"], description: "Inland delta oasis." },

  // ISLAND (Pink)
  { id: 10, name: "Komodo National Park", coords: { lat: -8.5435, lng: 119.4956 }, type: "terrestrial", animalId: 6, animals: ["Komodo Dragon"], description: "Dragon island." },
  { id: 11, name: "Madagascar Rainforest", coords: { lat: -20.25, lng: 47 }, type: "terrestrial", animalId: 9, animals: ["Cobra"], description: "Island endemics." },
  { id: 12, name: "Galapagos Islands", coords: { lat: -0.5, lng: -90.5 }, type: "terrestrial", animalId: 3, animals: ["Green Sea Turtle"], description: "Darwin's laboratory." },

  // MOUNTAIN (Green)
  { id: 13, name: "Denali National Park", coords: { lat: 63.0694, lng: -151.0072 }, type: "terrestrial", animalId: 8, animals: ["Polar Bear"], description: "Mount Denali." },
  { id: 14, name: "Himalayan Highlands", coords: { lat: 28.3949, lng: 84.1426 }, type: "terrestrial", animals: ["Snow Leopard"], description: "High altitude." },
  { id: 15, name: "Andes Cloud Forest", coords: { lat: -2.2, lng: -77.9 }, type: "terrestrial", animalId: 16, animals: ["Smalltooth Sawfish"], description: "Mountain biodiversity." }
];

export default function MapSection() {
  const [selectedReserve, setSelectedReserve] = useState(null);
  const [activeType, setActiveType] = useState('all');

  // Filter reserves by LANDMARK TYPE only
  const filteredReserves = wildlifeReserves.filter(reserve => 
    activeType === 'all' || reserve.type === activeType
  );

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <motion.h2 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-bold text-center mb-20 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent drop-shadow-lg"
      >
        Wildlife Reserves Worldwide
      </motion.h2>

      {/* ✅ BUTTONS ABOVE MAP */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="flex flex-wrap gap-3 justify-center mb-12 max-w-4xl mx-auto"
      >
        {['all', 'terrestrial','marine' , 'freshwater'].map(type => (
          <motion.button
            key={type}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveType(type)}
            className={`px-6 py-3 rounded-xl font-semibold shadow-sm transition-all whitespace-nowrap flex-shrink-0 ${
              activeType === type
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                : 'bg-white/90 text-gray-900 hover:bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md'
            }`}
          >
            {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
          </motion.button>
        ))}
      </motion.div>

      {/* MAP */}
      <motion.div 
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  className="rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-b from-gray-50/50 to-white/30 backdrop-blur-sm border border-gray-200/50 mb-12"
>
  <MapContainer 
    center={[20, 0]} 
    zoom={2} 
    className={`w-full h-[400px] sm:h-[500px] md:h-[600px] rounded-3xl ${styles['leaflet-container']}`}
  >
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    
    {filteredReserves.map((reserve) => {
      let icon;
      switch(reserve.type) {
        case 'marine': icon = MarinePin; break;          
        case 'freshwater': icon = FreshwaterPin; break;  
        default: icon = TerrestrialPin;                  
      }

      return (
        <Marker 
          key={reserve.id}
          position={[reserve.coords.lat, reserve.coords.lng]}
          icon={icon}
        >
          <Popup className="max-w-sm p-0 rounded-2xl shadow-2xl border border-gray-200/50">
            <div className="p-6">
              <div className="text-2xl font-bold mb-3 bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent">
                {reserve.name}
              </div>
              <div className="text-sm text-gray-700 mb-4">
                <span className="font-semibold">Land Type:</span> {reserve.type.toUpperCase()}
              </div>
              <div className="mb-4">
                <strong className="text-gray-800 block mb-2">Featured Species:</strong>
                <ul className="space-y-1">
                  {reserve.animals.map((animal, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-center gap-2">
                      • {animal}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-sm text-gray-600 italic mb-6">{reserve.description}</p>
            </div>
          </Popup>
        </Marker>
      );
    })}
  </MapContainer>
</motion.div>

      {/* ✅ LEGEND CENTERED AFTER MAP */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="flex flex-wrap justify-center items-center gap-4 max-w-4xl mx-auto p-6 bg-gradient-to-br from-emerald-50 to-blue-50 backdrop-blur-3xl shadow-2xl border border-emerald-200/60 rounded-3xl"
      >
        {/* Your existing cards */}
        
        <div className="flex items-center space-x-2 p-3 rounded-2xl bg-gradient-to-r from-orange-500/20 to-orange-400/20 border border-orange-500/30 hover:bg-orange-500/30 transition-all whitespace-nowrap flex-1 min-w-[140px]">
          <div className="w-6 h-10 bg-[url('https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png')] bg-center bg-no-repeat bg-contain rounded-full shadow-lg border-2 border-white/30 flex-shrink-0"></div>
          <span className="text-sm font-semibold text-gray-900">Terrestrial</span>
        </div>

        <div className="flex items-center space-x-2 p-3 rounded-2xl bg-gradient-to-r from-blue-500/20 to-blue-400/20 border border-blue-500/30 hover:bg-blue-500/30 transition-all whitespace-nowrap flex-1 min-w-[140px]">
          <div className="w-6 h-10 bg-[url('https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png')] bg-center bg-no-repeat bg-contain rounded-full shadow-lg border-2 border-white/30 flex-shrink-0"></div>
          <span className="text-sm font-semibold text-gray-900">Marine</span>
        </div>

        <div className="flex items-center space-x-2 p-3 rounded-2xl bg-gradient-to-r from-violet-500/20 to-violet-400/20 border border-violet-500/30 hover:bg-violet-500/30 transition-all whitespace-nowrap w-1/2 sm:flex-1 min-w-[140px]">
          <div className="w-6 h-10 bg-[url('https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png')] bg-center bg-no-repeat bg-contain rounded-full shadow-lg border-2 border-white/30 flex-shrink-0"></div>
          <span className="text-sm font-semibold text-gray-900">Freshwater</span>
        </div>

        {/*<div className="flex items-center space-x-2 p-3 rounded-2xl bg-gradient-to-r from-green-500/20 to-green-400/20 border border-green-500/30 hover:bg-green-500/30 transition-all whitespace-nowrap flex-1 min-w-[140px]">
          <div className="w-6 h-10 bg-[url('https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png')] bg-center bg-no-repeat bg-contain rounded-full shadow-lg border-2 border-white/30 flex-shrink-0"></div>
          <span className="text-sm font-semibold text-gray-900">Mountain</span>
        </div>

        <div className="flex items-center space-x-2 p-3 rounded-2xl bg-gradient-to-r from-yellow-500/20 to-yellow-400/20 border border-yellow-500/30 hover:bg-yellow-500/30 transition-all whitespace-nowrap flex-1 min-w-[140px]">
          <div className="w-6 h-10 bg-[url('https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png')] bg-center bg-no-repeat bg-contain rounded-full shadow-lg border-2 border-white/30 flex-shrink-0"></div>
          <span className="text-sm font-semibold text-gray-900">Island</span>
        </div>*/}
      </motion.div>

    </section>
  );
}
