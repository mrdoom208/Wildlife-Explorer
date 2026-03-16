import React, { useState, useCallback, useEffect } from "react";

const CreateReserveModal = ({
  clickedCoords,
  newReserveData,
  setNewReserveData,
  mapicons,
  createReserve,
  onClose,
  selectedReserve,
  isEditing,
}) => {
  const [errors, setErrors] = useState({});

  // Reset errors when switching between create/edit modes
  useEffect(() => {
    setErrors({});
  }, [isEditing, selectedReserve]);

  // ✅ FIXED: Make coordinates EMPTY strings by default instead of 0
  const handleCoordChange = useCallback((coordType, value) => {
    const newCoords = {
      ...newReserveData.coords,
      [coordType]: value === "" ? "" : parseFloat(value) || 0,
    };
    setNewReserveData({ ...newReserveData, coords: newCoords });
  }, [newReserveData]);

  // ✅ FIXED: Synchronous validation - EMPTY coordinates fail validation
  const validateField = useCallback((field, value) => {
    let errorMsg = "";

    switch (field) {
      case "name":
        errorMsg = !value || value.trim().length < 2
          ? "Name must be at least 2 characters"
          : "";
        break;
      case "type":
        errorMsg = !value || value === "" ? "Type is required" : "";
        break;
      case "coords":
        const lat = newReserveData.coords?.lat;
        const lng = newReserveData.coords?.lng;
        // ✅ FIXED: EMPTY strings OR 0 are invalid
        errorMsg = !lat || !lng || lat === "" || lng === "" || lat === 0 || lng === 0 || 
                   Math.abs(lat) > 90 || Math.abs(lng) > 180
          ? "Valid coordinates required (lat: -90 to 90, lng: -180 to 180)"
          : "";
        break;
      case "animals":
        const species = (newReserveData.animals || [])
          .filter((s) => s && s.trim()).length;
        errorMsg = species === 0 ? "At least one species required" : "";
        break;
      default:
        break;
    }

    setErrors(prev => ({
      ...prev,
      [field]: errorMsg
    }));

    return !errorMsg;
  }, [newReserveData.coords?.lat, newReserveData.coords?.lng, newReserveData.animals]);

  const validateForm = useCallback(() => {
    const nameValid = validateField("name", newReserveData.name);
    const typeValid = validateField("type", newReserveData.type);
    const coordsValid = validateField("coords", null);
    const animalsValid = validateField("animals", null);

    return nameValid && typeValid && coordsValid && animalsValid;
  }, [newReserveData, validateField]);

  const updateSpecies = (index, value) => {
    const newAnimals = [...(newReserveData.animals || [])];
    newAnimals[index] = value;
    setNewReserveData({ ...newReserveData, animals: newAnimals });
  };

  const addSpecies = () => {
    const newAnimals = [...(newReserveData.animals || []), ""];
    setNewReserveData({ ...newReserveData, animals: newAnimals });
  };

  const removeSpecies = (index) => {
    const newAnimals = (newReserveData.animals || []).filter((_, i) => i !== index);
    setNewReserveData({ ...newReserveData, animals: newAnimals });
  };

  const handleCreateReserve = async () => {
    const isValid = validateForm();
    
    if (!isValid) {
      console.log("🚫 Form validation failed:", errors);
      return;
    }

    const hasErrors = Object.values(errors).some(error => error);
    if (hasErrors) {
      console.log("🚫 Still has validation errors:", errors);
      return;
    }

    console.log(`✅ Form validated, ${isEditing ? "updating" : "creating"}:`, newReserveData);
    
    const dataToSend = isEditing && selectedReserve?._id 
      ? { ...newReserveData, _id: selectedReserve._id }
      : newReserveData;
    
    const success = await createReserve(dataToSend);
    if (success) {
      onClose();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const handleInputChange = useCallback((field, value) => {
    setNewReserveData({ ...newReserveData, [field]: value });
    validateField(field, value);
  }, [newReserveData, validateField]);

  // ✅ Calculate form validity for button state
  const isFormValid = Object.values(errors).every(error => !error) &&
    newReserveData.name?.trim() &&
    newReserveData.type && newReserveData.type !== "" &&
    newReserveData.coords?.lat && newReserveData.coords?.lat !== "" && newReserveData.coords?.lat !== 0 &&
    newReserveData.coords?.lng && newReserveData.coords?.lng !== "" && newReserveData.coords?.lng !== 0 &&
    (newReserveData.animals || []).filter(s => s?.trim()).length > 0;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">
            {isEditing ? "Update Reserve" : "Create New Reserve"}
          </h3>
          <button
            onClick={handleCancel}
            className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Name Field */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={newReserveData.name || ""}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                errors.name ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300"
              }`}
              placeholder="Reserve name..."
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>

          {/* Coordinates - NOW SHOWS EMPTY */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">
              Coordinates <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={newReserveData.coords?.lat ?? ""}
                  onChange={(e) => handleCoordChange("lat", e.target.value)}
                  className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 text-sm transition-all ${
                    errors.coords ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300"
                  }`}
                  placeholder="0.0000"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={newReserveData.coords?.lng ?? ""}
                  onChange={(e) => handleCoordChange("lng", e.target.value)}
                  className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 text-sm transition-all ${
                    errors.coords ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300"
                  }`}
                  placeholder="0.0000"
                />
              </div>
            </div>
            {errors.coords && <p className="mt-1 text-xs text-red-600">{errors.coords}</p>}
          </div>

          {/* Type Field */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">
              Type <span className="text-red-500">*</span>
            </label>
            <select
              value={newReserveData.type || ""}
              onChange={(e) => handleInputChange("type", e.target.value)}
              className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
                errors.type ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select type...</option>
              {Array.from(
                new Set(mapicons.map((icon) => icon.type?.toLowerCase()?.trim()).filter(Boolean)),
              ).map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
            {errors.type && <p className="mt-1 text-xs text-red-600">{errors.type}</p>}
          </div>

          {/* Species */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">
              Species <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
              {(newReserveData.animals || []).length === 0 ? (
                <p className="text-xs text-gray-500 italic">No species added</p>
              ) : (
                newReserveData.animals.map((animal, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <input
                      type="text"
                      value={animal || ""}
                      onChange={(e) => updateSpecies(i, e.target.value)}
                      className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-400 outline-none bg-white"
                      placeholder="Species name..."
                    />
                    <button
                      type="button"
                      onClick={() => removeSpecies(i)}
                      className="px-2 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>
            {errors.animals && <p className="mb-2 text-xs text-red-600">{errors.animals}</p>}
            <button
              type="button"
              onClick={addSpecies}
              className="w-full flex items-center justify-center gap-1 px-4 py-2 text-sm bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium shadow-sm transition-all"
            >
              + Add Species
            </button>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Description</label>
            <textarea
              value={newReserveData.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none transition-all"
              placeholder="Description..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleCreateReserve}
              disabled={!isFormValid}
              className={`flex-1 px-6 py-3 font-semibold rounded-xl shadow-lg transition-all ${
                !isFormValid
                  ? "bg-gray-300 cursor-not-allowed text-gray-500"
                  : "bg-emerald-500 hover:bg-emerald-600 text-white"
              }`}
            >
              {isEditing ? "Update Reserve" : "Create Reserve"}
            </button>
            <button
              onClick={handleCancel}
              className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-xl shadow-lg transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateReserveModal;
