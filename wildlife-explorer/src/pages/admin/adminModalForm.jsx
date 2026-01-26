import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Image as ImageIcon, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const CLOUDINARY_CLOUD_NAME = 'dfjm0xwup';
const CLOUDINARY_UPLOAD_PRESET = 'animals';
const CLOUDINARY_FOLDER = 'animals';

export default function ModalForm({ 
  show, 
  formData, 
  imagePreview,
  loading, 
  editingId, 
  onChange, 
  onSubmit, 
  onClose 
}) {
  const [uploadingImage, setUploadingImage] = useState(false);

  const uploadToCloudinary = async (imageFile) => {
    if (!imageFile) return null;
    
    setUploadingImage(true);
    const formDataToSend = new FormData();
    formDataToSend.append('file', imageFile);
    formDataToSend.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formDataToSend.append('folder', CLOUDINARY_FOLDER);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formDataToSend }
      );
      if (!response.ok) throw new Error('Upload failed');
      const result = await response.json();
      return result.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      alert('Image upload failed. Please try again.');
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.name || !formData.habitat || !formData.description) {
    alert('Please fill all required fields');
    return;
  }

  if (formData.image instanceof File) {
    const imageUrl = await uploadToCloudinary(formData.image);
    if (!imageUrl) return;

    const updatedFormData = {
      ...formData,
      image: imageUrl, // ✅ overwrite File with URL
    };

    onSubmit(updatedFormData);
  } else {
    onSubmit(formData);
  }
};


  const clearImage = () => {
    onChange({ target: { name: 'image', files: { 0: null } } });
  };

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
          {/* 👇 SMALLER MODAL - max-w-2xl (was max-w-4xl) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[85vh] shadow-2xl
                       /* 👇 PERFECT SCROLLBAR - no border overlap */
                       scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 
                       scrollbar-rounded-md overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold"> {/* 👇 Smaller title */}
                {editingId ? 'Edit Animal' : 'Add New Animal'}
              </h2>
              <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-all">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6"> {/* 👇 Single column */}
              {/* Name + Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Name *</label>
                  <input 
                    name="name" 
                    value={formData.name} 
                    onChange={onChange} 
                    type="text" 
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Category *</label>
                  <select name="category" value={formData.category} onChange={onChange} 
                          className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500" required>
                    <option value="mammals">Mammals</option>
                    <option value="birds">Birds</option>
                    <option value="reptiles">Reptiles</option>
                    <option value="amphibians">Amphibians</option>
                    <option value="fish">Fish</option>
                    <option value="invertebrates">Invertebrates</option>
                    
                  </select>
                </div>
              </div>

              {/* 👇 COMPACT IMAGE UPLOAD */}
              <div>
                <label className="block text-sm font-semibold mb-2">Image *</label>
                <div className="space-y-3">
                  {imagePreview && (
                    <div className="relative group max-w-sm mx-auto">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-48 object-cover rounded-xl shadow-lg border-2 border-green-100"
                      />
                      <button
                        type="button"
                        onClick={clearImage}
                        className="absolute -top-1 -right-1 bg-red-500 text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                  
                  <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                    formData.image || imagePreview 
                      ? 'border-green-400 bg-green-50' 
                      : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'
                  }`}>
                    <input 
                      name="image" 
                      type="file" 
                      accept="image/*" 
                      onChange={onChange} 
                      className="hidden" 
                      id="image-upload"
                      disabled={uploadingImage || loading}
                    />
                    <label htmlFor="image-upload" className="cursor-pointer block">
                      {uploadingImage ? (
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                          <p className="text-sm font-semibold text-blue-600">Uploading...</p>
                        </div>
                      ) : !imagePreview ? (
                        <>
                          <ImageIcon size={32} className="mx-auto mb-2 text-gray-400" />
                          <p className="text-sm font-semibold text-gray-700">Click to upload</p>
                          <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                        </>
                      ) : (
                        <CheckCircle size={32} className="mx-auto mb-2 text-green-500" />
                      )}
                    </label>
                  </div>
                </div>
              </div>

              {/* Facts */}
              <div>
                <label className="block text-sm font-semibold mb-2">Short Facts</label>
                <textarea 
                  name="facts" 
                  value={formData.facts} 
                  onChange={onChange} 
                  rows={2} 
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 resize-vertical" 
                />
              </div>

              {/* Habitat + Diet */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Habitat *</label>
                  <input 
                    name="habitat" 
                    value={formData.habitat} 
                    onChange={onChange} 
                    type="text" 
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Diet *</label>
                  <select name="diet" value={formData.diet} onChange={onChange} 
                          className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500" required>
                    <option value="carnivore">Carnivore</option>
                    <option value="herbivore">Herbivore</option>
                    <option value="omnivore">Omnivore</option>
                    <option value="insectivore">Insectivore</option>
                    <option value="filter feeder">Filter feeder</option>
                  </select>
                </div>
              </div>

              {/* Conservation Status */}
              <div>
                <label className="block text-sm font-semibold mb-2">Conservation Status</label>
                <select name="conservationStatus" value={formData.conservationStatus} onChange={onChange}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500">
                  <option value="LC">Least Concern (LC)</option>
                  <option value="NT">Near Threatened (NT)</option>
                  <option value="VU">Vulnerable (VU)</option>
                  <option value="EN">Endangered (EN)</option>
                  <option value="CR">Critically Endangered (CR)</option>
                  <option value="EW">Extinct in the Wild (EW)</option>
                  <option value="EX">Extinct (EX)</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold mb-2">Description *</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={onChange} 
                  rows={4} 
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 resize-vertical" 
                  required 
                />
              </div>

              {/* Buttons - Smaller padding */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button 
                  type="submit" 
                  disabled={loading || uploadingImage}
                  className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 px-6 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 text-sm"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    editingId ? 'Update Animal' : 'Add Animal'
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
