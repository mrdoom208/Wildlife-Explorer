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
      className={`mb-12 overflow-x-auto ${isVisible ? "block" : "hidden"}`}
    >
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-6 border border-blue-200/60 shadow-2xl">
        <div className="flex justify-between gap-3 mb-6">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            Map Icons Management
          </h3>

          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => handleEditMapIcon(null)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white rounded-2xl font-semibold shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Icon</span>
          </motion.button>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-lg">
          <table className="w-full table-auto bg-white">
            <thead>
              <tr className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <th className="px-6 py-4 text-left rounded-tl-xl font-semibold">
                  Preview
                </th>
                <th className="px-6 py-4 text-left font-semibold">Name</th>
                <th className="px-6 py-4 text-left font-semibold">Type</th>
                <th className="px-6 py-4 text-left font-semibold">Icon URL</th>
                <th className="px-6 py-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedMapIcons.map((icon) => (
                <tr
                  key={icon._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <img
                      src={icon.iconUrl}
                      alt={icon.name}
                      className="w-8 h-8 object-contain rounded-lg "
                      onError={(e) => {
                        e.target.src = "/fallback-icon.png";
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 font-medium">{icon.name}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium capitalize">
                      {icon.type}
                    </span>
                  </td>
                  <td
                    className="px-6 py-4 max-w-xs truncate"
                    title={icon.iconUrl}
                  >
                    {icon.iconUrl}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <motion.button
                        className="p-2 sm:p-3 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-xl transition-all hover:scale-110"
                        whileHover={{ scale: 1.1 }}
                        onClick={() => handleEditMapIcon(icon)}
                        disabled={icon.role === "admin"}
                      >
                        <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                      </motion.button>
                      <motion.button
                        className="p-2 sm:p-3 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-xl transition-all hover:scale-110"
                        whileHover={{ scale: 1.1 }}
                        onClick={() => deleteMapIcon(icon._id)}
                        disabled={icon.role === "admin"}
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
    </motion.div>
  );
};

export default MapIconsTable;
