import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Image as ImageIcon, CheckCircle } from "lucide-react";
import { useState } from "react";

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_FOLDER = "news-updates"; // Changed folder name

export default function NewsUpdateModal({
  show,
  formData,
  imagePreview,
  loading,
  uploadingImage: propUploadingImage,
  editingId,
  onChange,
  onSubmit,
  onClose,
}) {
  const [localUploadingImage, setLocalUploadingImage] = useState(false);

  const uploadToCloudinary = async (imageFile) => {
    if (!imageFile) return null;

    setLocalUploadingImage(true);
    const formDataToSend = new FormData();
    formDataToSend.append("file", imageFile);
    formDataToSend.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formDataToSend.append("folder", CLOUDINARY_FOLDER);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formDataToSend },
      );
      if (!response.ok) throw new Error("Upload failed");
      const result = await response.json();
      return result.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      alert("Image upload failed. Please try again.");
      return null;
    } finally {
      setLocalUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Required fields validation
    if (
      !formData.title ||
      !formData.excerpt ||
      !formData.fullContent ||
      !formData.category ||
      !formData.author
    ) {
      alert(
        "Please fill all required fields (Title, Excerpt, Content, Category, Author)",
      );
      return;
    }

    if (formData.image instanceof File) {
      const imageUrl = await uploadToCloudinary(formData.image);
      if (!imageUrl) return;

      const updatedFormData = {
        ...formData,
        image: imageUrl,
        imageSrc: imageUrl, // Both fields get the same URL
      };

      onSubmit(updatedFormData);
    } else {
      onSubmit(formData);
    }
  };

  const clearImage = () => {
    onChange({ target: { name: "image", value: "" } });
    onChange({ target: { name: "imageSrc", value: "" } });
  };

  const isUploadingImage = propUploadingImage || localUploadingImage;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[85vh] shadow-2xl
                       scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 
                       scrollbar-rounded-md overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {editingId ? "Edit News Update" : "Add New Update"}
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-gray-100 hover:text-red-500 rounded-lg transition-all cursor-pointer font-bold"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
              {/* Title + Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Title *
                  </label>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={onChange}
                    type="text"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={onChange}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 cursor-pointer"
                    required
                  >
                    <option value="environment">Environment</option>
                    <option value="conservation">Conservation</option>
                    <option value="wildlife">Wildlife</option>
                    <option value="research">Research</option>
                    <option value="policy">Policy</option>
                    <option value="events">Events</option>
                    <option value="awareness">Awareness</option>
                  </select>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Featured Image *
                </label>
                <div
                  className={`border-gray-300 border-2 border-dashed rounded-xl p-2 text-center transition-all duration-300 ease-in-out hover:border-purple-400 hover:bg-gray-50 ${
                    formData.image || imagePreview
                      ? "bg-purple-50"
                      : "min-h-50 h-60"
                  }`}
                >
                  <input
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={onChange}
                    className="hidden"
                    id="image-upload"
                    disabled={isUploadingImage || loading}
                  />

                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer block w-full h-full flex flex-col items-center justify-center"
                  >
                    {isUploadingImage ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
                        <p className="text-sm font-semibold text-purple-600">
                          Uploading...
                        </p>
                      </div>
                    ) : imagePreview ? (
                      <div className="relative group bg-purple-50">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-xl shadow-lg transition-opacity duration-300 ease-in-out hover:opacity-70"
                        />
                        <button
                          onClick={clearImage}
                          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <X size={16} className="text-gray-500" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <ImageIcon
                          size={32}
                          className="mx-auto mb-2 text-gray-400"
                        />
                        <p className="text-sm font-semibold text-gray-700">
                          Click to upload featured image
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG up to 10MB
                        </p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Excerpt * (Short summary)
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={onChange}
                  rows={3}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 resize-vertical"
                  placeholder="Brief summary shown in listings (160 chars max recommended)"
                  required
                />
              </div>

              {/* Date + Author */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Publish Date *
                  </label>
                  <input
                    name="date"
                    value={formData.date}
                    onChange={onChange}
                    type="date"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Author *
                  </label>
                  <input
                    name="author"
                    value={formData.author}
                    onChange={onChange}
                    type="text"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>

              {/* Full Content */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Full Content *
                </label>
                <textarea
                  name="fullContent"
                  value={formData.fullContent}
                  onChange={onChange}
                  rows={8}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 resize-vertical font-sans"
                  placeholder="Write the full article content here..."
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading || isUploadingImage}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-blue-600 text-white py-3 px-6 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 text-sm"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : editingId ? (
                    "Update News"
                  ) : (
                    "Publish Update"
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-bold transition-all text-sm"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
