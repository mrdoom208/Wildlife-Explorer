import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit,
  Trash2,
  X,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Plus,
} from "lucide-react";
import CreateReserveModal from "./CreateReserveModal";

const ReservesTable = ({
  reserves,
  deleteReserve,
  handleEditReserve,
  isVisible,
  createReserve, // ✅ Add this prop
  mapicons, // ✅ Add this prop
}) => {
  const [selectedReserve, setSelectedReserve] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [animalsInput, setAnimalsInput] = useState("");
  const [tempAnimals, setTempAnimals] = useState([]);
  // ✅ New state for CreateReserveModal
  const [clickedCoords, setClickedCoords] = useState(null);
  const [newReserveData, setNewReserveData] = useState({
    name: "",
    type: "",
    coords: { lat: 0, lng: 0 },
    animals: [],
    description: "",
  });

  const handleOpenUpdate = (reserve) => {
    setSelectedReserve(reserve);
    setTempAnimals(reserve.animals || []);
    setAnimalsInput("");
    setShowUpdateModal(true);
  };

  const handleOpenDelete = (reserve) => {
    setSelectedReserve(reserve);
    setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    setShowUpdateModal(false);
    setShowDeleteModal(false);
    setShowCreateModal(false); // ✅ Added
    setSelectedReserve(null);
    setTempAnimals([]);
    setAnimalsInput("");
    setIsDeleting(false);
    setNewReserveData({
      name: "",
      type: "",
      coords: { lat: 0, lng: 0 },
      animals: [],
      description: "",
    }); // ✅ Reset create form
  };

  const addAnimal = () => {
    if (animalsInput.trim() && !tempAnimals.includes(animalsInput.trim())) {
      setTempAnimals([...tempAnimals, animalsInput.trim()]);
      setAnimalsInput("");
    }
  };

  const removeAnimal = (animalToRemove) => {
    setTempAnimals(tempAnimals.filter((animal) => animal !== animalToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addAnimal();
    }
  };

  const handleCreateClose = () => {
    handleCloseModal();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
      className={`mb-12 overflow-x-auto ${isVisible ? "block" : "hidden"}`}
    >
      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-3xl p-6 border border-emerald-200/60 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            Reserves Management
          </h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-semibold shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Reserve</span>
          </motion.button>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-lg">
          <table className="w-full table-auto bg-white">
            <thead>
              <tr className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
                <th className="px-6 py-4 text-left rounded-tl-xl font-semibold">
                  Name
                </th>
                <th className="px-6 py-4 text-left font-semibold">Type</th>
                <th className="px-6 py-4 text-left font-semibold">
                  Coordinates
                </th>
                <th className="px-6 py-4 text-left font-semibold">Animals</th>
                <th className="px-6 py-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reserves.map((reserve) => (
                <tr
                  key={reserve._id}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium">{reserve.name}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-sm font-medium">
                      {reserve.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div>
                      {reserve.coords?.lat?.toFixed(4)},{" "}
                      {reserve.coords?.lng?.toFixed(4)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {reserve.animals?.slice(0, 3).map((animal, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                        >
                          {animal}
                        </span>
                      ))}
                      {reserve.animals && reserve.animals.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{reserve.animals.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <motion.button
                        className="p-2 sm:p-3 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-xl transition-all hover:scale-110"
                        whileHover={{ scale: 1.1 }}
                        onClick={() => handleOpenUpdate(reserve)}
                        disabled={reserve.role === "admin"}
                      >
                        <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                      </motion.button>
                      <motion.button
                        className="p-2 sm:p-3 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-xl transition-all hover:scale-110"
                        whileHover={{ scale: 1.1 }}
                        onClick={() => handleOpenDelete(reserve)}
                        disabled={reserve.role === "admin"}
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </motion.button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Modal */}
      <AnimatePresence>
        {showUpdateModal && selectedReserve && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Update modal content - fixed description position & textarea */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <Edit className="w-7 h-7 text-blue-600" />
                  Update Reserve
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-all"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </motion.button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reserve Name
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedReserve.name}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                  />
                </div>

                {/* ✅ FIXED: Description moved to proper position */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    defaultValue={selectedReserve.description || ""}
                    placeholder="Brief description of the reserve..."
                    className="resize-none w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    defaultValue={selectedReserve.type}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base"
                  >
                    <option>National Park</option>
                    <option>Wildlife Reserve</option>
                    <option>Protected Area</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Coordinates
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        Latitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        defaultValue={selectedReserve.coords?.lat}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        Longitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        defaultValue={selectedReserve.coords?.lng}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Animals Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Animals ({tempAnimals.length})
                  </label>
                  <div className="flex gap-2 mb-3 p-2 bg-gray-50 rounded-xl border border-gray-200">
                    <input
                      type="text"
                      value={animalsInput}
                      onChange={(e) => setAnimalsInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Add animal..."
                      className="flex-1 bg-white px-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder-gray-500"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={addAnimal}
                      className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center"
                      disabled={!animalsInput.trim()}
                      title="Add animal"
                    >
                      <Plus className="w-4 h-4" />
                    </motion.button>
                  </div>

                  <div className="max-h-40 overflow-y-auto space-y-1.5">
                    {tempAnimals.map((animal, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between p-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-800 truncate">
                            {animal}
                          </span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 0.95 }}
                          onClick={() => removeAnimal(animal)}
                          className="p-1.5 hover:bg-red-100 text-red-500 rounded-md transition-all flex-shrink-0"
                        >
                          <X className="w-3.5 h-3.5" />
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 text-sm"
                  onClick={() => {
                    handleEditReserve({
                      ...selectedReserve,
                      animals: tempAnimals,
                    });
                  }}
                >
                  <CheckCircle className="w-5 h-5" />
                  Update Reserve
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className="flex-1 sm:w-auto px-6 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all text-sm"
                  onClick={handleCloseModal}
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ NEW: CreateReserveModal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateReserveModal
            clickedCoords={clickedCoords || { lat: 0, lng: 0 }}
            newReserveData={newReserveData}
            setNewReserveData={setNewReserveData}
            mapicons={mapicons || []} // ✅ Fallback to empty array
            createReserve={createReserve}
            onClose={handleCreateClose}
          />
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedReserve && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mb-6 mx-auto">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>

              <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                Delete Reserve?
              </h3>
              <p className="text-gray-600 mb-8 text-center">
                Are you sure you want to delete{" "}
                <strong>"{selectedReserve.name}"</strong>? This action cannot be
                undone.
              </p>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  disabled={isDeleting}
                  onClick={async () => {
                    setIsDeleting(true);
                    await deleteReserve(selectedReserve._id);
                    handleCloseModal();
                  }}
                  className="flex-1 bg-red-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-red-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isDeleting ? (
                    "Deleting..."
                  ) : (
                    <>
                      <Trash2 className="w-5 h-5" />
                      Delete
                    </>
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={handleCloseModal}
                  disabled={isDeleting}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-300 transition-all disabled:opacity-50"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ReservesTable;
