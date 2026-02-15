import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { motion } from "framer-motion";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useMemo } from "react";
import { useReserves } from "../../hooks/useReserves";
import { useMapIcons } from "../../hooks/useMapIcons";
import styles from "../home/MapSection.module.css";

// ✅ Fix Leaflet default marker issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ✅ LOCAL MARKER COMPONENT - Prevents popup closing!
const ReserveMarker = ({
  reserve,
  icon,
  mapicons,
  deleteReserve,
  updateReserve,
  refetch,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localData, setLocalData] = useState({ ...reserve });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setLocalData({ ...reserve });
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      await updateReserve(localData._id, localData);
      await refetch();
      setIsEditing(false);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleDeleteClick = () => setShowDeleteConfirm(true);
  const handleConfirmDelete = async () => {
    try {
      await deleteReserve(reserve._id);
      await refetch();
    } catch (error) {
      console.error("Delete failed:", error);
    }
    setShowDeleteConfirm(false);
  };

  const updateSpecies = (index, value) => {
    const newAnimals = [...(localData.animals || [])];
    newAnimals[index] = value;
    setLocalData({ ...localData, animals: newAnimals });
  };

  const addSpecies = () => {
    setLocalData({
      ...localData,
      animals: [...(localData.animals || []), ""],
    });
  };

  const removeSpecies = (index) => {
    const newAnimals = (localData.animals || []).filter((_, i) => i !== index);
    setLocalData({ ...localData, animals: newAnimals });
  };

  return (
    <Marker
      key={reserve._id}
      position={[reserve.coords.lat, reserve.coords.lng]}
      icon={icon}
    >
      <Popup className="max-w-xs p-0 rounded-xl shadow-xl border border-gray-200 w-80">
        <div className="p-4 max-h-72 overflow-y-auto">
          {isEditing ? (
            <>
              {/* EDIT FORM */}
              <div className="space-y-3">
                {/* NAME */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={localData.name || ""}
                    onChange={(e) =>
                      setLocalData({ ...localData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>

                {/* DYNAMIC TYPE SELECT */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Type
                  </label>
                  <select
                    value={localData.type || ""}
                    onChange={(e) =>
                      setLocalData({ ...localData, type: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                  >
                    {Array.from(
                      new Set(
                        mapicons
                          .map((icon) => icon.type?.toLowerCase()?.trim())
                          .filter(Boolean),
                      ),
                    ).map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* SPECIES */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-2">
                    Species
                  </label>
                  <div className="space-y-1 mb-2">
                    {(localData.animals || []).length === 0 ? (
                      <p className="text-xs text-gray-500 italic">
                        No species added
                      </p>
                    ) : (
                      localData.animals.map((animal, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={animal || ""}
                            onChange={(e) => updateSpecies(i, e.target.value)}
                            className="flex-1 px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-400 outline-none text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => removeSpecies(i)}
                            className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={addSpecies}
                    className="w-full flex items-center justify-center gap-1 px-3 py-2 text-xs bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium shadow-sm transition-all"
                  >
                    + Add Species
                  </button>
                </div>

                {/* DESCRIPTION */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Description
                  </label>
                  <textarea
                    value={localData.description || ""}
                    onChange={(e) =>
                      setLocalData({
                        ...localData,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-vertical"
                  />
                </div>

                {/* SAVE/CANCEL */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSave;
                    }}
                    className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg font-medium shadow-sm transition-all"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCancel();
                    }}
                    className="flex-1 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-xs rounded-lg font-medium shadow-sm transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* VIEW MODE */}
              <h3 className="text-lg font-bold mb-2 bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent truncate">
                {reserve.name}
              </h3>

              <div className="text-xs mb-3 py-1 px-2 bg-gray-100 rounded-lg">
                <span className="font-semibold text-gray-800">Type:</span>{" "}
                {reserve.type?.toUpperCase()}
              </div>

              {reserve.animals && reserve.animals.length > 0 && (
                <div className="mb-4">
                  <strong className="text-xs text-gray-800 block mb-2">
                    Species:
                  </strong>
                  {reserve.animals.slice(0, 2).map((animal, i) => (
                    <div key={i} className="text-xs text-gray-700 mb-1">
                      • {animal}
                    </div>
                  ))}
                  {reserve.animals.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{reserve.animals.length - 2} more
                    </div>
                  )}
                </div>
              )}

              <p className="text-xs text-gray-600 italic mb-4 pr-1">
                {reserve.description}
              </p>

              {/* ACTION BUTTONS */}
              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <motion.button
                  whileHover={{ scale: 0.95 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit();
                    setShowDeleteConfirm(false);
                  }}
                  className="flex-1 px-3 py-2 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium shadow-sm transition-all"
                >
                  Update
                </motion.button>
                <motion.button
                  whileHover={{ scale: 0.95 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleDeleteClick}
                  className="px-3 py-2 text-xs bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium shadow-sm transition-all"
                >
                  Remove
                </motion.button>
              </div>

              {/* DELETE CONFIRM */}
              {showDeleteConfirm && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-xs text-red-800 mb-2">
                    Delete "{reserve.name}"?
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleConfirmDelete}
                      className="flex-1 px-3 py-2 text-xs bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                    >
                      Yes, Remove
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDeleteConfirm(false);
                      }}
                      className="flex-1 px-3 py-2 text-xs bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Popup>
    </Marker>
  );
};

export default function Reserves() {
  const [activeType, setActiveType] = useState("all");
  const { reserves, isLoading, refetch, deleteReserve, updateReserve } =
    useReserves();
  const { mapicons } = useMapIcons();

  // ✅ Build icons dynamically from DB
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

  const sortedMapIcons = [...mapicons].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
  );

  const filteredReserves = reserves.filter(
    (reserve) => activeType === "all" || reserve.type === activeType,
  );

  return (
    <section id="reserves" className="py-20 px-4 max-w-7xl mx-auto">
      {/* TITLE */}
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-bold text-center mb-20 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent drop-shadow-lg"
      >
        Wildlife Reserves Worldwide
      </motion.h2>

      {/* FILTER BUTTONS */}
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

      {/* MAP */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-b from-gray-50/50 to-white/30 backdrop-blur-sm border border-gray-200/50 mb-12"
      >
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
              attribution="&copy; OpenStreetMap"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

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
                  refetch={refetch}
                />
              );
            })}
          </MapContainer>
        )}
      </motion.div>

      {/* LEGEND */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="flex flex-wrap justify-center items-center gap-4 max-w-4xl mx-auto p-6 bg-gradient-to-br from-emerald-50 to-blue-50 shadow-2xl border border-emerald-200/60 rounded-3xl"
      >
        {sortedMapIcons.map((icon) => (
          <div
            key={icon._id}
            className={`flex items-center space-x-2 p-3 rounded-2xl bg-gradient-to-r from-${icon.color}-500/20 to-${icon.color}-400/20 border border-${icon.color}-500/30 hover:bg-${icon.color}-500/30 transition-all whitespace-nowrap flex-1 min-w-[100px]`}
          >
            <img
              src={icon.iconUrl}
              alt={icon.name}
              className="w-6 h-6 object-contain"
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
