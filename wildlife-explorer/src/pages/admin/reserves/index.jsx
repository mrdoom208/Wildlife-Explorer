import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import { Edit, Trash2 } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./reserves.module.css";

import { useReserves } from "../../../hooks/useReserves";
import { useMapIcons } from "../../../hooks/useMapIcons";
import ReserveMarker from "./ReserveMarker";
import CreateReserveModal from "./CreateReserveModal";
import ReservesTable from "./ReservesTable";
import MapIconsTable from "./MapIconsTable";
import MapIconModal from "./MapIconModal";

// ✅ Fix Leaflet default marker issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    dblclick(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
};

export default function Reserves() {
  // Core UI state
  const [activeType, setActiveType] = useState("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [clickedCoords, setClickedCoords] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // ← ADD
  const [editingIcon, setEditingIcon] = useState(null); // ← ADD
  const [newReserveData, setNewReserveData] = useState({
    name: "",
    type: "",
    animals: [],
    description: "",
  });

  // Table state
  const [showReservesTable, setShowReservesTable] = useState(false);
  const [showMapIconsTable, setShowMapIconsTable] = useState(false);
  const [editingReserve, setEditingReserve] = useState(null);
  const [editingMapIcon, setEditingMapIcon] = useState(null);

  // Hooks
  const {
    reserves,
    isLoading,
    refetch: refetchReserves,
    deleteReserve,
    updateReserve,
    createReserve,
  } = useReserves();

  const {
    mapicons,
    refetch: refetchMapIcons,
    deleteMapIcon,
    updateMapIcon,
    createMapIcon,
  } = useMapIcons();

  // Memoized icon mapping for Leaflet markers
  const iconMap = useMemo(() => {
    const icons = {};
    mapicons.forEach((item) => {
      const typeKey = item.type?.toLowerCase()?.trim();
      icons[typeKey] = new L.Icon({
        iconUrl: item.iconUrl,
        shadowUrl: item.shadowUrl,
        iconSize: item.iconSize || [25, 41],
        iconAnchor: item.iconAnchor || [12, 41],
        popupAnchor: item.popupAnchor || [1, -34],
        shadowSize: [41, 41],
      });
    });
    return icons;
  }, [mapicons]);

  // Filtered reserves for map display
  const filteredReserves = reserves.filter(
    (reserve) => activeType === "all" || reserve.type === activeType,
  );

  // Map interaction handlers
  const handleMapClick = (latlng) => {
    setClickedCoords(latlng);
    setShowCreateForm(true);
    setNewReserveData({
      name: "",
      type: "",
      animals: [],
      description: "",
      coords: { lat: latlng.lat, lng: latlng.lng },
    });
  };

  // Reserves CRUD handlers
  const handleEditReserve = (reserve) => {
    setEditingReserve(reserve);
  };

  const handleDeleteReserve = async (id) => {
    if (confirm("Are you sure you want to delete this reserve?")) {
      try {
        await deleteReserve(id);
        await refetchReserves();
      } catch (error) {
        console.error("Failed to delete reserve:", error);
      }
    }
  };

  const handleUpdateReserve = async (updatedData) => {
    try {
      await updateReserve(updatedData._id, updatedData);
      setEditingReserve(null);
      await refetchReserves();
    } catch (error) {
      console.error("Failed to update reserve:", error);
    }
  };

  // Map Icons CRUD handlers
  const handleEditMapIcon = (icon) => {
    setEditingMapIcon(icon);
    setIsModalOpen(true);
  };

  const handleDeleteMapIcon = async (id) => {
    if (confirm("Are you sure you want to delete this map icon?")) {
      try {
        await deleteMapIcon(id);
        await refetchMapIcons();
      } catch (error) {
        console.error("Failed to delete map icon:", error);
      }
    }
  };

  const handleUpdateMapIcon = async (updatedData) => {
    try {
      await updateMapIcon(updatedData._id, updatedData);
      setEditingMapIcon(null);
      await refetchMapIcons();
    } catch (error) {
      console.error("Failed to update map icon:", error);
    }
  };

  // Refetch both datasets
  const handleRefetchAll = async () => {
    await Promise.all([refetchReserves(), refetchMapIcons()]);
  };

  return (
    <section id="reserves" className="py-20 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-4xl md:text-5xl font-bold text-center mb-20 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent drop-shadow-lg"
      >
        Wildlife Reserves Worldwide
      </motion.h2>
      {/* Table Toggle Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="my-8 flex flex-wrap gap-4 justify-center"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowReservesTable(!showReservesTable)}
          className={`px-8 py-3 rounded-xl font-semibold shadow-sm transition-all ${
            showReservesTable
              ? "bg-red-600 text-white shadow-lg shadow-red-500/25"
              : "bg-white/90 text-gray-900 border border-gray-200 hover:shadow-md"
          }`}
        >
          {showReservesTable ? "Hide" : "Show"} Reserves Table (
          {reserves.length})
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowMapIconsTable(!showMapIconsTable)}
          className={`px-8 py-3 rounded-xl font-semibold shadow-sm transition-all ${
            showMapIconsTable
              ? "bg-purple-600 text-white shadow-lg shadow-purple-500/25"
              : "bg-white/90 text-gray-900 border border-gray-200 hover:shadow-md"
          }`}
        >
          {showMapIconsTable ? "Hide" : "Show"} Map Icons Table (
          {mapicons.length})
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRefetchAll}
          className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-semibold shadow-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
        >
          Refresh Data
        </motion.button>
      </motion.div>

      {/* Table Components */}
      <ReservesTable
        reserves={reserves}
        deleteReserve={handleDeleteReserve}
        handleEditReserve={handleEditReserve}
        handleUpdateReserve={handleUpdateReserve}
        editingReserve={editingReserve}
        setEditingReserve={setEditingReserve}
        isVisible={showReservesTable}
        createReserve={createReserve}
        mapicons={mapicons}
      />

      {/* Create Reserve Modal */}
      {showCreateForm && (
        <CreateReserveModal
          clickedCoords={clickedCoords}
          newReserveData={newReserveData}
          setNewReserveData={setNewReserveData}
          mapicons={mapicons}
          createReserve={createReserve}
          onClose={() => {
            setShowCreateForm(false);
            setClickedCoords(null);
            setNewReserveData({
              name: "",
              type: "",
              animals: [],
              description: "",
            });
          }}
        />
      )}

      <MapIconsTable
        mapicons={mapicons}
        deleteMapIcon={handleDeleteMapIcon}
        handleEditMapIcon={handleEditMapIcon}
        handleUpdateMapIcon={handleUpdateMapIcon}
        editingMapIcon={editingMapIcon}
        setEditingMapIcon={setEditingMapIcon}
        isVisible={showMapIconsTable}
      />

      <MapIconModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingIcon={editingIcon}
        createMapIcon={createMapIcon}
        updateMapIcon={updateMapIcon}
      />

      {/* Filter Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-wrap gap-3 justify-center mb-12 max-w-4xl mx-auto"
      >
        {["all", "terrestrial", "marine", "freshwater"].map((type) => (
          <motion.button
            key={type}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveType(type)}
            className={`px-6 py-3 rounded-xl font-semibold shadow-sm transition-all ${
              activeType === type
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/25"
                : "bg-white/90 text-gray-900 border border-gray-200 hover:shadow-md"
            }`}
          >
            {type === "all"
              ? "All Types"
              : type.charAt(0).toUpperCase() + type.slice(1)}
          </motion.button>
        ))}
      </motion.div>

      {/* Interactive Map */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-b from-gray-50/50 to-white/30 backdrop-blur-sm border border-gray-200/50 mb-12 relative"
      >
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/80 text-gray-800 px-3 py-1 rounded-lg shadow-md z-50 pointer-events-none text-xs font-medium">
          Double-click on the map to add a new reserve
        </div>
        {!isLoading && (
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
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapClickHandler onMapClick={handleMapClick} />
            {filteredReserves.map((reserve) => {
              const icon =
                iconMap[reserve.type?.toLowerCase()?.trim()] ||
                new L.Icon.Default();
              return (
                <ReserveMarker
                  key={reserve._id}
                  reserve={reserve}
                  icon={icon}
                  mapicons={mapicons}
                  deleteReserve={deleteReserve}
                  updateReserve={updateReserve}
                  refetch={refetchReserves}
                />
              );
            })}
          </MapContainer>
        )}
      </motion.div>

      {/* Map Icons Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-wrap justify-center items-center gap-4 max-w-4xl mx-auto p-6 bg-gradient-to-br from-emerald-50 to-blue-50 shadow-2xl border border-emerald-200/60 rounded-3xl"
      >
        {mapicons
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
          .map((icon) => (
            <div
              key={icon._id}
              className={`flex items-center space-x-2 p-3 rounded-2xl bg-gradient-to-r from-${icon.color}-500/20 to-${icon.color}-400/20 border border-${icon.color}-500/30 hover:bg-${icon.color}-500/30 transition-all whitespace-nowrap flex-1 min-w-[100px]`}
            >
              <img
                src={icon.iconUrl}
                alt={icon.name}
                className="w-6 h-6 object-contain"
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
