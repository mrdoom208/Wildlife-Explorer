import React from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import { motion } from "framer-motion";

const MapIconsTable = ({
  mapicons,
  deleteMapIcon,
  handleEditMapIcon,
  isVisible,
}) => {
  const sortedMapIcons = [...mapicons].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
      className={`mb-12 ${isVisible ? "block" : "hidden"}`}
    >
      {" "}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-4 sm:p-6 border border-blue-200/60 shadow-2xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
            Map Icons Management
          </h3>

          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => handleEditMapIcon(null)}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white rounded-2xl font-semibold shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Add New Icon
          </motion.button>
        </div>
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-200 shadow-lg">
          <table className="w-full table-auto bg-white">
            <thead>
              <tr className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <th className="px-6 py-4 text-left">Preview</th>
                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-left">Type</th>
                <th className="px-6 py-4 text-left">Icon URL</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {sortedMapIcons.map((icon) => (
                <tr
                  key={icon._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4">
                    <img
                      src={icon.iconUrl}
                      alt={icon.name}
                      className="w-8 h-8 object-contain rounded-lg"
                      onError={(e) => {
                        e.target.src = "/fallback-icon.png";
                      }}
                    />
                  </td>

                  <td className="px-6 py-4 font-medium">{icon.name}</td>

                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm capitalize">
                      {icon.type}
                    </span>
                  </td>

                  <td
                    className="px-6 py-4 max-w-xs truncate text-sm"
                    title={icon.iconUrl}
                  >
                    {icon.iconUrl}
                  </td>

                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => handleEditMapIcon(icon)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                    >
                      <Edit className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => deleteMapIcon(icon._id)}
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
          {sortedMapIcons.map((icon) => (
            <div
              key={icon._id}
              className="bg-white border border-gray-200 rounded-2xl p-4 shadow-md"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={icon.iconUrl}
                    alt={icon.name}
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      e.target.src = "/fallback-icon.png";
                    }}
                  />

                  <h4 className="font-semibold text-gray-800">{icon.name}</h4>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditMapIcon(icon)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => deleteMapIcon(icon._id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-500 mb-1">
                <span className="font-medium">Type:</span> {icon.type}
              </p>

              <p
                className="text-sm text-gray-500 truncate"
                title={icon.iconUrl}
              >
                <span className="font-medium">URL:</span> {icon.iconUrl}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default MapIconsTable;
