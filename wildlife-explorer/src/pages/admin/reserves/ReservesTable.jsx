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
  createReserve,
  mapicons,
}) => {
  const [selectedReserve, setSelectedReserve] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
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
  // ✅ Reused for both create and update
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
    setShowUpdateModal(false);
    setShowDeleteModal(false);
    setShowCreateModal(false);
    setSelectedReserve(null);
    setIsEditing(false);
    setNewReserveData({
      name: "",
      type: "",
      coords: { lat: 0, lng: 0 },
      animals: [],
      description: "",
    });
    setIsDeleting(false);
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
            onClick={() => {
              setIsEditing(false);
              setNewReserveData({
                name: "",
                type: "",
                coords: { lat: 0, lng: 0 },
                animals: [],
                description: "",
              });
              setShowCreateModal(true);
            }}
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

      {/* ✅ SINGLE CreateReserveModal for both CREATE & UPDATE */}
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
                  disabled={isEditing}
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
