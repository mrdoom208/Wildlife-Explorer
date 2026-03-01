import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { motion } from "framer-motion";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState, useMemo } from "react";
import { useReserves } from "../../hooks/useReserves";
import { useMapIcons } from "../../hooks/useMapIcons";
import styles from "./MapSection.module.css";

// Fix default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function MapSection() {
  const [selectedReserve, setSelectedReserve] = useState(null);
  const [activeType, setActiveType] = useState("all");

  // ✅ Dynamic icons from DB + reserves
  const { mapicons: icons, isLoading: iconsLoading } = useMapIcons();
  const { reserves, isLoading: reservesLoading } = useReserves();

  // ✅ Create Leaflet icons dynamically
  const iconMap = useMemo(() => {
    const map = {};
    icons.forEach((iconData) => {
      map[iconData.type] = new L.Icon({
        iconUrl: iconData.iconUrl,
        shadowUrl: iconData.shadowUrl,
        iconSize: iconData.iconSize || [25, 41],
        iconAnchor: iconData.iconAnchor || [12, 41],
        popupAnchor: iconData.popupAnchor || [1, -34],
        shadowSize: [41, 41],
      });
    });
    return map;
  }, [icons]);

  // Filter reserves by type
  const filteredReserves = reserves.filter(
    (reserve) => activeType === "all" || reserve.type === activeType,
  );

  // ✅ Loading both datasets
  if (reservesLoading || iconsLoading) {
    return (
      <section id="reserves" className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          <p className="mt-4 text-lg text-gray-600">
            Loading wildlife reserves & map icons...
          </p>
        </div>
      </section>
    );
  }

  // ✅ Get icon for reserve type (fallback to first available)
  const getIconForType = (type) => {
    return iconMap[type] || Object.values(iconMap)[0] || L.icon.default;
  };

  return (
    <section id="reserves" className="py-20 px-4 max-w-7xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-bold text-center mb-20 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent drop-shadow-lg"
      >
        Wildlife Reserves Worldwide
      </motion.h2>

      {/* Filter Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="flex flex-wrap gap-3 justify-center mb-12 max-w-4xl mx-auto"
      >
        {["all", "terrestrial", "marine", "freshwater"].map((type) => (
          <motion.button
            key={type}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveType(type)}
            className={`px-6 py-3 rounded-xl font-semibold shadow-sm transition-all whitespace-nowrap flex-shrink-0 ${
              activeType === type
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/25"
                : "bg-white/90 text-gray-900 hover:bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md"
            }`}
          >
            {type === "all"
              ? "All Types"
              : type.charAt(0).toUpperCase() + type.slice(1)}
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
          maxZoom={10}
          minZoom={2}
          maxBounds={[
            [-90, -180],
            [90, 180],
          ]}
          maxBoundsViscosity={1.0}
          className={`w-full h-[400px] sm:h-[500px] md:h-[600px] rounded-3xl ${styles["leaflet-container"]}`}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filteredReserves.map((reserve) => {
            const reserveIcon = getIconForType(reserve.type);

            return (
              <Marker
                key={reserve._id}
                position={[reserve.coords.lat, reserve.coords.lng]}
                icon={reserveIcon}
              >
                <Popup className="max-w-xs p-0 rounded-xl shadow-xl border border-gray-200/30 w-72 max-h-60">
                  <div className="p-1 max-h-60">
                    <h3 className="text-lg font-bold mb-2 bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent truncate">
                      {reserve.name}
                    </h3>

                    <div className="text-xs mb-3 py-1 px-2 bg-gray-100 rounded-lg">
                      <span className="font-semibold text-gray-800">Type:</span>{" "}
                      {reserve.type.toUpperCase()}
                    </div>

                    <div className="mb-3">
                      <strong className="text-xs text-gray-800 block mb-1">
                        Species:
                      </strong>
                      <div className="space-y-1 max-h-12 overflow-hidden">
                        {reserve.animals?.slice(0, 2).map((animal, i) => (
                          <div
                            key={i}
                            className="text-xs text-gray-700 flex items-center gap-1 line-clamp-1"
                          >
                            • {animal}
                          </div>
                        ))}
                        {reserve.animals && reserve.animals.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{reserve.animals.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 italic leading-tight line-clamp-2">
                      {reserve.description}
                    </p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </motion.div>

      {/* ✅ DYNAMIC LEGEND - uses actual DB icons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-wrap justify-center items-center gap-4 max-w-4xl mx-auto p-6 bg-gradient-to-r from-emerald-50 to-blue-50 shadow-2xl border border-emerald-200/60 rounded-3xl"
      >
        {icons
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
          .map((icon) => (
            <div
              key={icon._id}
              className="flex items-center space-x-2 p-3 rounded-2xl border border-gradient-r from-green-600 to-blue-600 border-emerald-400/50 hover:bg-emerald-500/30 transition-all whitespace-nowrap flex-1 min-w-[100px]"
            >
              <img
                src={icon.iconUrl}
                alt={icon.name}
                className="w-7 h-7 object-contain"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <span className="text-sm font-semibold text-gray-900 capitalize">
                {icon.name}
              </span>
            </div>
          ))}
      </motion.div>
    </section>
  );
}
