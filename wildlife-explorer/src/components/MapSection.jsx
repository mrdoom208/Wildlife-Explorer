import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { motion } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { WildlifePin, BirdPin, ReptilePin, MarinePin } from './MapIcons';
import styles from './MapSection.module.css';

// Fix default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export const wildlifeReserves = [
  {
    id: 1, name: "Serengeti National Park", coords: { lat: -2.3333, lng: 34.8333 }, category: "mammals",
    animals: ["Lion", "Elephant", "Cheetah"], description: "Great Migration."
  },
  {
    id: 2, name: "Everglades National Park", coords: { lat: 25.2866, lng: -80.8987 }, category: "reptiles",
    animals: ["Alligator", "Python"], description: "Tropical wilderness."
  },
  {
    id: 3, name: "Denali National Park", coords: { lat: 63.0694, lng: -151.0072 }, category: "mammals",
    animals: ["Grizzly Bear", "Moose"], description: "Mount Denali."
  },
  {
    id: 4, name: "Pantanal Wetlands", coords: { lat: -16.2667, lng: -56.6667 }, category: "birds",
    animals: ["Hyacinth Macaw", "Jabiru"], description: "Largest wetland."
  },
  {
    id: 5, name: "Amazon Rainforest Reserve", coords: { lat: -3.4653, lng: -62.2159 }, category: "mammals",
    animals: ["Jaguar", "Sloth"], description: "Most biodiverse."
  },
  {
    id: 6, name: "Great Barrier Reef", coords: { lat: -18.2871, lng: 147.6992 }, category: "marine",
    animals: ["Sea Turtle", "Clownfish", "Reef Shark"], description: "Largest coral reef."
  },
  {
    id: 7, name: "Galapagos Marine Reserve", coords: { lat: -0.5, lng: -90.5 }, category: "marine",
    animals: ["Hammerhead Shark", "Sea Lion", "Blue-footed Booby"], description: "Darwin's living laboratory."
  },
  {
    id: 8, name: "Monterey Bay Marine Sanctuary", coords: { lat: 36.5, lng: -122 }, category: "marine",
    animals: ["Blue Whale", "Sea Otter", "Great White Shark"], description: "Richest marine habitat."
  },
  {
    id: 9, name: "Red Sea Coral Reefs", coords: { lat: 20.5, lng: 38.5 }, category: "marine",
    animals: ["Lionfish", "Manta Ray", "Dolphin"], description: "Vibrant coral ecosystems."
  }
];

export default function MapSection() {
  const [selectedReserve, setSelectedReserve] = useState(null);

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <motion.h2 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-bold text-center mb-20 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent drop-shadow-lg"
      >
        Wildlife Reserves Worldwide
      </motion.h2>
      
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-b from-gray-50/50 to-white/30 backdrop-blur-sm border border-gray-200/50"
      >
        <MapContainer 
          center={[20, 0]} 
          zoom={2} 
          style={{ height: "650px", width: "100%" }}
          className={`w-full rounded-3xl ${styles['leaflet-container']}`}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {wildlifeReserves.map((reserve) => {
            let icon;
            switch(reserve.category) {
              case 'birds': icon = BirdPin; break;
              case 'reptiles': icon = ReptilePin; break;
              case 'marine': icon = MarinePin; break;
              default: icon = WildlifePin;
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
                      <span className="font-semibold">Category:</span> {reserve.category.toUpperCase()}
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
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedReserve(reserve)}
                      className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-emerald-500/40 transition-all duration-300"
                    >
                      View Reserve Details
                    </motion.button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </motion.div>

      <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto p-8 bg-gradient-to-br from-emerald-50 to-blue-50 backdrop-blur-3xl shadow-2xl border border-emerald-200/60 rounded-3xl"
      >
      <div className="flex items-center space-x-3 p-4 rounded-2xl bg-gradient-to-r from-orange-500/20 to-orange-400/20 border border-orange-500/30 hover:bg-orange-500/30 transition-all">
        <div className="w-8 h-8 bg-[url('https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png')] bg-center bg-no-repeat bg-contain rounded-full shadow-lg border-2 border-white/30"></div>
        <span className="text-sm font-semibold text-gray-900">Mammal Reserves</span>
      </div>

      <div className="flex items-center space-x-3 p-4 rounded-2xl bg-gradient-to-r from-violet-500/20 to-purple-400/20 border border-violet-500/30 hover:bg-violet-500/30 transition-all">
        <div className="w-8 h-8 bg-[url('https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png')] bg-center bg-no-repeat bg-contain rounded-full shadow-lg border-2 border-white/30"></div>
        <span className="text-sm font-semibold text-gray-900">Birld Reserves</span>
      </div>
      
      <div className="flex items-center space-x-3 p-4 rounded-2xl bg-gradient-to-r from-green-500/20 to-green-400/20 border border-green-500/30 hover:bg-green-500/30 transition-all">
        <div className="w-8 h-8 bg-[url('https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png')] bg-center bg-no-repeat bg-contain rounded-full shadow-lg border-2 border-white/30"></div>
        <span className="text-sm font-semibold text-gray-900">Reptile Areas</span>
      </div>
      
      
      <div className="flex items-center space-x-3 p-4 rounded-2xl bg-gradient-to-r from-blue-500/20 to-blue-400/20 border border-blue-500/30 hover:bg-blue-500/30 transition-all">
        <div className="w-8 h-8 bg-[url('https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png')] bg-center bg-no-repeat bg-contain rounded-full shadow-lg border-2 border-white/30"></div>
        <span className="text-sm font-semibold text-gray-900">Marine Parks</span>
      </div>
    </motion.div>

    </section>
  );
}
