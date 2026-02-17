import React, { useState } from "react";
import { motion } from "framer-motion";
import { Marker, Popup } from "react-leaflet";

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
      const success = await updateReserve(reserve._id, localData);
      if (success) {
        setIsEditing(false);
      }
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
              <div className="space-y-3">
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

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSave();
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

export default ReserveMarker;
