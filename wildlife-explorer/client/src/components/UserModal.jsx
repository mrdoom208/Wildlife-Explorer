import { motion } from "framer-motion";
import PasswordInput from "../utils/PasswordInput";
import RoleSelect from "../utils/RoleSelect";
import StatusSelect from "../utils/StatusSelect";

export default function UserModal({
  isOpen,
  onClose,
  formData,
  selectedUser,
  onSubmit,
  onChange,
}) {
  if (!isOpen) return null;

  const isEditing = selectedUser || formData._id;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleClose = () => {
    onClose();
    // Reset form when closing
    onChange({
      name: "",
      email: "",
      password: "",
      role: "user",
      status: "pending",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl p-8 sm:p-12 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dynamic Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
          {isEditing ? "Edit User" : "Add New Account"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name input */}
          <div>
            <input
              type="text"
              placeholder="Enter full name"
              value={formData.name}
              onChange={(e) => onChange({ ...formData, name: e.target.value })}
              required
              className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-emerald-300 focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all text-lg"
            />
          </div>

          {/* Email input */}
          <div>
            <input
              type="email"
              placeholder="Enter email address"
              value={formData.email}
              required
              onChange={(e) => onChange({ ...formData, email: e.target.value })}
              className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-emerald-300 focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all text-lg"
            />
          </div>

          {/* Password input - Always visible */}
          <div>
            <PasswordInput
              value={formData.password}
              required={!isEditing}
              onChange={(e) =>
                onChange({ ...formData, password: e.target.value })
              }
              placeholder={
                isEditing
                  ? "Leave blank to keep old password"
                  : "Enter password"
              }
            />
          </div>

          {/* Role Select */}
          <div>
            <RoleSelect
              value={formData.role}
              onChange={(role) => onChange({ ...formData, role })}
              options={["admin", "researcher", "user"]}
            />
          </div>

          {/* Status Select */}
          <div>
            <StatusSelect
              value={formData.status}
              onChange={(status) => onChange({ ...formData, status })}
              options={["verified", "active", "pending", "inactive"]}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <motion.button
              type="button"
              onClick={handleClose}
              whileHover={{ scale: 1.02 }}
              className="flex-1 p-4 bg-gray-200 text-gray-800 rounded-2xl font-semibold hover:bg-gray-300 transition-all"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              disabled={
                !formData.name.trim() ||
                !formData.email.trim() ||
                (!isEditing && !formData.password.trim())
              }
              className="flex-1 p-4 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-2xl font-semibold shadow-xl hover:shadow-2xl hover:from-emerald-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEditing ? "Update User" : "Create Account"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
