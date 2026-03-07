import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, Trash2, AlertTriangle, Plus } from "lucide-react";
import CreateReserveModal from "./CreateReserveModal";

const ReservesTable = ({
  reserves,
  deleteReserve,
  handleEditReserve,
  isVisible,
  createReserve,
  mapicons,
}) => {
  const [selectedReserve, setSelectedReserve] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [clickedCoords, setClickedCoords] = useState(null);

  const [newReserveData, setNewReserveData] = useState({
    name: "",
    type: "",
    coords: { lat: 0, lng: 0 },
    animals: [],
    description: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleOpenUpdate = (reserve) => {
    setSelectedReserve(reserve);
    setNewReserveData({
      name: reserve.name || "",
      type: reserve.type || "",
      coords: reserve.coords || { lat: 0, lng: 0 },
      animals: reserve.animals || [],
      description: reserve.description || "",
    });
    setIsEditing(true);
    setShowCreateModal(true);
  };

  const handleOpenDelete = (reserve) => {
    setSelectedReserve(reserve);
    setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setShowCreateModal(false);
    setSelectedReserve(null);
    setIsEditing(false);
    setIsDeleting(false);

    setNewReserveData({
      name: "",
      type: "",
      coords: { lat: 0, lng: 0 },
      animals: [],
      description: "",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
      className={`mb-12 ${isVisible ? "block" : "hidden"}`}
    >
      {" "}
      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-3xl p-4 sm:p-6 border border-emerald-200/60 shadow-2xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
            Reserves Management
          </h3>

          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => {
              setIsEditing(false);
              setShowCreateModal(true);
            }}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-semibold shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Add New Reserve
          </motion.button>
        </div>
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-200 shadow-lg">
          <table className="w-full table-auto bg-white">
            <thead>
              <tr className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-left">Type</th>
                <th className="px-6 py-4 text-left">Coordinates</th>
                <th className="px-6 py-4 text-left">Animals</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {reserves.map((reserve) => (
                <tr
                  key={reserve._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 font-medium">{reserve.name}</td>

                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-sm">
                      {reserve.type}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm">
                    {reserve.coords?.lat?.toFixed(4)},{" "}
                    {reserve.coords?.lng?.toFixed(4)}
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
                    </div>
                  </td>

                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => handleOpenUpdate(reserve)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                    >
                      <Edit className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => handleOpenDelete(reserve)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
          {reserves.map((reserve) => (
            <div
              key={reserve._id}
              className="bg-white border border-gray-200 rounded-2xl p-4 shadow-md"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-gray-800">{reserve.name}</h4>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenUpdate(reserve)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleOpenDelete(reserve)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-500">
                <span className="font-medium">Type:</span> {reserve.type}
              </p>

              <p className="text-sm text-gray-500">
                <span className="font-medium">Coords:</span>{" "}
                {reserve.coords?.lat?.toFixed(4)},{" "}
                {reserve.coords?.lng?.toFixed(4)}
              </p>

              <div className="flex flex-wrap gap-1 mt-2">
                {reserve.animals?.slice(0, 3).map((animal, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                  >
                    {animal}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Create / Update Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateReserveModal
            clickedCoords={clickedCoords || { lat: 0, lng: 0 }}
            newReserveData={newReserveData}
            setNewReserveData={setNewReserveData}
            mapicons={mapicons || []}
            createReserve={isEditing ? handleEditReserve : createReserve}
            selectedReserve={isEditing ? selectedReserve : null}
            isEditing={isEditing}
            onClose={handleCloseModal}
          />
        )}
      </AnimatePresence>
      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedReserve && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
          >
            <motion.div
              className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-center mb-4">
                <AlertTriangle className="w-10 h-10 text-red-600" />
              </div>

              <h3 className="text-xl font-bold text-center mb-2">
                Delete Reserve?
              </h3>

              <p className="text-gray-600 text-center mb-6">
                Delete <strong>{selectedReserve.name}</strong>?
              </p>

              <div className="flex gap-3">
                <button
                  className="flex-1 bg-red-600 text-white py-3 rounded-xl"
                  onClick={async () => {
                    setIsDeleting(true);
                    await deleteReserve(selectedReserve._id);
                    handleCloseModal();
                  }}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>

                <button
                  className="flex-1 bg-gray-200 py-3 rounded-xl"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ReservesTable;
