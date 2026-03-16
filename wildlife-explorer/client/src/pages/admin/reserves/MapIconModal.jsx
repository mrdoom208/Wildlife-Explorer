import React, { useState, useEffect } from "react";
import { X, Image, MapPin, CheckCircle } from "lucide-react";
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
    color: "",
    iconUrl: "",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    description: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("idle");
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
    }
    setUploadStatus("idle");
    setErrors({});
  }, [editingIcon, isOpen]);

  const uploadToCloudinary = async (file) => {
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
      setUploadStatus("error");
      setErrors({ iconUrl: "Upload failed. Try again." });
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
    if (!formData.iconUrl.trim()) newErrors.iconUrl = "Icon URL required";

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
    } catch {
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
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white rounded-3xl w-full max-w-lg sm:max-w-xl lg:max-w-2xl p-4 sm:p-6 lg:p-8 max-h-[90vh] overflow-y-auto shadow-2xl border border-blue-200/60"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}{" "}
          <div className="flex justify-between items-start sm:items-center mb-6 gap-4">
            {" "}
            <div className="flex items-center gap-3">
              {" "}
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl">
                {" "}
                <MapPin className="w-5 h-5 text-white" />{" "}
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-base sm:text-lg">
                  {editingIcon ? "Edit Map Icon" : "Create Map Icon"}
                </h3>

                <p className="text-gray-500 text-sm">
                  {editingIcon
                    ? "Update Leaflet marker"
                    : "Configure new marker"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-xl"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 sm:p-6 bg-blue-50 rounded-2xl border border-blue-200">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Name *
                </label>

                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400"
                />

                {errors.name && (
                  <p className="text-red-600 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Type *
                </label>

                <input
                  type="text"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400"
                />

                {errors.type && (
                  <p className="text-red-600 text-xs mt-1">{errors.type}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold mb-2">
                  Color *
                </label>

                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            {/* Upload */}
            <div>
              <label className="block text-sm font-semibold mb-3">
                Icon Image *
              </label>

              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              <label
                htmlFor="imageUpload"
                className="flex items-center justify-center p-4 sm:p-6 border-2 border-dashed rounded-2xl bg-gray-50 cursor-pointer hover:border-blue-400"
              >
                {uploadStatus === "uploading" ? (
                  <p className="text-blue-600 font-medium text-sm">
                    Uploading...
                  </p>
                ) : imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <Image className="w-10 h-10 mx-auto mb-2" />
                    <p className="text-sm">Click to upload</p>
                  </div>
                )}
              </label>

              <input
                type="url"
                value={formData.iconUrl}
                onChange={handleUrlInput}
                placeholder="or paste image url..."
                className="w-full mt-3 px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400"
              />

              {uploadStatus === "success" && (
                <div className="flex items-center gap-2 text-green-700 mt-2 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  Upload successful
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Description
              </label>

              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 ">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                type="submit"
                className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-xl font-semibold"
              >
                {editingIcon ? "Update Icon" : "Create Icon"}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MapIconModal;
