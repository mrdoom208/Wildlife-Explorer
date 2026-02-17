import React, { useState, useEffect } from "react";
import { X, Upload, Image, Save, MapPin, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Cloudinary config from .env
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const MapIconModal = ({
  isOpen,
  onClose,
  editingIcon = null,
  createMapIcon,
  updateMapIcon,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    color: "#3b82f6",
    iconUrl: "",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    description: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("idle"); // idle, uploading, success, error
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingIcon) {
      setFormData({
        name: editingIcon.name || "",
        type: editingIcon.type || "",
        color: editingIcon.color || "#3b82f6",
        iconUrl: editingIcon.iconUrl || "",
        shadowUrl:
          editingIcon.shadowUrl ||
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
        iconSize: editingIcon.iconSize || [25, 41],
        iconAnchor: editingIcon.iconAnchor || [12, 41],
        popupAnchor: editingIcon.popupAnchor || [1, -34],
        description: editingIcon.description || "",
      });
      setImagePreview(editingIcon.iconUrl);
      setUploadStatus("idle");
    } else {
      setFormData({
        name: "",
        type: "",
        color: "#3b82f6",
        iconUrl: "",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        description: "",
      });
      setImagePreview(null);
      setUploadStatus("idle");
    }
    setErrors({});
  }, [editingIcon, isOpen]);

  // Cloudinary upload function
  const uploadToCloudinary = async (file) => {
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      throw new Error("Cloudinary config missing. Check .env file.");
    }

    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    formDataUpload.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formDataUpload.append("cloud_name", CLOUDINARY_CLOUD_NAME);
    formDataUpload.append("folder", "map-icons");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formDataUpload,
      },
    );

    const data = await response.json();
    if (!data.secure_url) throw new Error("Upload failed");
    return data.secure_url;
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;

    setUploadStatus("uploading");
    try {
      const url = await uploadToCloudinary(file);
      setFormData((prev) => ({ ...prev, iconUrl: url }));
      setImagePreview(url);
      setUploadStatus("success");
    } catch (error) {
      console.error("Upload error:", error);
      setErrors({ ...errors, iconUrl: "Upload failed. Try again." });
      setUploadStatus("error");
    }
  };

  const handleUrlInput = (e) => {
    const url = e.target.value;
    setFormData({ ...formData, iconUrl: url });
    setImagePreview(url);
    setUploadStatus("idle");
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.type.trim()) newErrors.type = "Type is required";
    if (!formData.color) newErrors.color = "Color is required";
    if (!formData.iconUrl.trim()) newErrors.iconUrl = "Icon URL is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingIcon) {
        await updateMapIcon(editingIcon._id, formData);
      } else {
        await createMapIcon(formData);
      }
      onClose();
    } catch (error) {
      console.error("Error saving map icon:", error);
      setErrors({ submit: "Failed to save" });
    }
  };

  const updateArrayField = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = parseInt(value) || 0;
    setFormData({ ...formData, [field]: newArray });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-3xl border border-blue-200/60"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {editingIcon ? "Edit Map Icon" : "Create Map Icon"}
                </h3>
                <p className="text-gray-600 text-sm">
                  {editingIcon
                    ? "Update Leaflet marker"
                    : "Configure new marker"}
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-2xl transition-all"
            >
              <X className="w-6 h-6 text-gray-500" />
            </motion.button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl border border-blue-200/50">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className={`w-full px-4 py-3 rounded-2xl border-2 font-medium transition-all focus:outline-none focus:ring-4 ${
                    errors.name
                      ? "border-red-300 bg-red-50 focus:ring-red-200"
                      : "border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:ring-blue-200"
                  }`}
                  placeholder="Terrestrial Reserve"
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1">• {errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Type *
                </label>
                <input
                  type="text"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className={`w-full px-4 py-3 rounded-2xl border-2 font-medium transition-all focus:outline-none focus:ring-4 ${
                    errors.type
                      ? "border-red-300 bg-red-50 focus:ring-red-200"
                      : "border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:ring-blue-200"
                  }`}
                  placeholder="terrestrial, marine, etc."
                />
                {errors.type && (
                  <p className="text-red-600 text-sm mt-1">• {errors.type}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Color *
                </label>
                <div className="flex gap-3">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    className="w-14 h-14 rounded-xl border-2 border-gray-200 hover:border-blue-300 shadow-md cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    className={`flex-1 px-4 py-3 rounded-2xl border-2 font-mono transition-all focus:outline-none focus:ring-4 ${
                      errors.color
                        ? "border-red-300 bg-red-50 focus:ring-red-200"
                        : "border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:ring-blue-200"
                    }`}
                  />
                </div>
                {errors.color && (
                  <p className="text-red-600 text-sm mt-1">• {errors.color}</p>
                )}
              </div>
            </div>

            {/* Cloudinary Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Icon Image *
              </label>
              <div className="space-y-4">
                {/* Preview Area */}
                <div className="flex items-center justify-center p-8 border-2 border-dashed rounded-3xl bg-gradient-to-br from-gray-50 to-blue-50 hover:border-blue-400 transition-all">
                  {uploadStatus === "uploading" ? (
                    <div className="text-center">
                      <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-blue-600 font-semibold">
                        Uploading to Cloudinary...
                      </p>
                    </div>
                  ) : imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-24 h-24 object-contain rounded-2xl shadow-lg"
                    />
                  ) : (
                    <div className="text-center text-gray-500">
                      <Image className="w-16 h-16 mx-auto mb-3 opacity-50" />
                      <p className="text-lg font-medium">No image selected</p>
                    </div>
                  )}
                </div>

                {/* Upload Controls */}
                <div className="space-y-3">
                  <label className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-2xl font-semibold shadow-xl cursor-pointer transition-all hover:shadow-2xl border-2 border-emerald-400/50">
                    <Upload className="w-6 h-6" />
                    {uploadStatus === "success"
                      ? "✅ Uploaded!"
                      : "Upload Image"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploadStatus === "uploading"}
                    />
                  </label>

                  <input
                    type="url"
                    value={formData.iconUrl}
                    onChange={handleUrlInput}
                    placeholder="Or paste Cloudinary URL..."
                    className={`w-full px-4 py-3 rounded-2xl border-2 font-medium transition-all focus:outline-none focus:ring-4 ${
                      errors.iconUrl
                        ? "border-red-300 bg-red-50 focus:ring-red-200"
                        : "border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:ring-blue-200"
                    }`}
                  />

                  {uploadStatus === "success" && (
                    <div className="p-3 bg-green-50 border-2 border-green-200 rounded-2xl flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span
                        className="text-sm text-green-800 font-medium truncate"
                        title={formData.iconUrl}
                      >
                        {formData.iconUrl.slice(0, 60)}...
                      </span>
                    </div>
                  )}
                </div>

                {errors.iconUrl && (
                  <p className="text-red-600 text-sm p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2">
                    <span>•</span> {errors.iconUrl}
                  </p>
                )}
              </div>
            </div>

            {/* Advanced Settings (Collapsible) */}
            <details className="group open:bg-blue-50/50">
              <summary className="cursor-pointer font-semibold text-lg text-gray-800 py-4 px-6 border-2 border-gray-200 rounded-2xl hover:border-blue-300 focus:border-blue-500 transition-all group-open:bg-blue-50 group-open:rounded-b-none">
                ⚙️ Advanced Leaflet Settings
              </summary>
              <div className="p-6 bg-gradient-to-r from-gray-50/70 to-blue-50/70 rounded-b-2xl border-x-2 border-b-2 border-gray-200">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Icon Size [width, height]
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        value={formData.iconSize[0]}
                        onChange={(e) =>
                          updateArrayField("iconSize", 0, e.target.value)
                        }
                        className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="25"
                      />
                      <input
                        type="number"
                        value={formData.iconSize[1]}
                        onChange={(e) =>
                          updateArrayField("iconSize", 1, e.target.value)
                        }
                        className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="41"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Icon Anchor [x, y]
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        value={formData.iconAnchor[0]}
                        onChange={(e) =>
                          updateArrayField("iconAnchor", 0, e.target.value)
                        }
                        className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="12"
                      />
                      <input
                        type="number"
                        value={formData.iconAnchor[1]}
                        onChange={(e) =>
                          updateArrayField("iconAnchor", 1, e.target.value)
                        }
                        className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="41"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Description (optional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                    placeholder="Additional info about this marker..."
                  />
                </div>
              </div>
            </details>

            {/* Actions */}
            <div className="flex gap-4 pt-8 border-t-2 border-gray-200">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                onClick={onClose}
                className="flex-1 px-8 py-4 text-gray-700 font-semibold border-2 border-gray-300 rounded-3xl hover:bg-gray-50 hover:border-gray-400 transition-all hover:shadow-lg"
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                disabled={uploadStatus === "uploading"}
                className="flex-1 px-8 py-4 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold rounded-3xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-6 h-6" />
                <span>{editingIcon ? "Update Icon" : "Create Icon"}</span>
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MapIconModal;
