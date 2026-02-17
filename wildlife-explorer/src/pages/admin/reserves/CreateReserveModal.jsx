import React, { useState, useCallback } from "react";

const CreateReserveModal = ({
  clickedCoords,
  newReserveData,
  setNewReserveData,
  mapicons,
  createReserve,
  onClose,
}) => {
  const [errors, setErrors] = useState({});

  // Validation rules
  const validateField = useCallback(
    (field, value) => {
      const newErrors = { ...errors };

      switch (field) {
        case "name":
          newErrors.name =
            !value || value.trim().length < 2
              ? "Name must be at least 2 characters"
              : "";
          break;
        case "type":
          newErrors.type = !value ? "Type is required" : "";
          break;
        case "coords":
          const lat = newReserveData.coords?.lat;
          const lng = newReserveData.coords?.lng;
          newErrors.coords =
            !lat || Math.abs(lat) > 90 || !lng || Math.abs(lng) > 180
              ? "Valid coordinates required (lat: -90 to 90, lng: -180 to 180)"
              : "";
          break;
        case "animals":
          const species = (newReserveData.animals || []).filter((s) =>
            s.trim(),
          ).length;
          newErrors.animals =
            species === 0 ? "At least one species required" : "";
          break;
        default:
          break;
      }

      setErrors(newErrors);
      return Object.values(newErrors).every((error) => !error);
    },
    [newReserveData, errors],
  );

  // Validate all fields
  const validateForm = useCallback(() => {
    validateField("name", newReserveData.name);
    validateField("type", newReserveData.type);
    validateField("coords", newReserveData.coords);
    validateField("animals", newReserveData.animals);

    return Object.values(errors).every((error) => !error);
  }, [newReserveData, errors, validateField]);

  const updateSpecies = (index, value) => {
    const newAnimals = [...(newReserveData.animals || [])];
    newAnimals[index] = value;
    setNewReserveData({ ...newReserveData, animals: newAnimals });
    validateField("animals", newAnimals);
  };

  const addSpecies = () => {
    const newAnimals = [...(newReserveData.animals || []), ""];
    setNewReserveData({ ...newReserveData, animals: newAnimals });
  };

  const removeSpecies = (index) => {
    const newAnimals = (newReserveData.animals || []).filter(
      (_, i) => i !== index,
    );
    setNewReserveData({ ...newReserveData, animals: newAnimals });
    validateField("animals", newAnimals);
  };

  const handleCreateReserve = async () => {
    const isValid = validateForm();
    if (!isValid) {
      console.log("🚫 Form validation failed:", errors);
      return;
    }

    console.log("✅ Form validated, sending:", newReserveData);
    const success = await createReserve(newReserveData);
    if (success) {
      onClose();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  // Update validation on input change
  const handleInputChange = (field, value) => {
    setNewReserveData({ ...newReserveData, [field]: value });
    validateField(field, value);
  };

  const handleCoordChange = (coordType, value) => {
    setNewReserveData({
      ...newReserveData,
      coords: {
        ...(newReserveData.coords || {}),
        [coordType]: parseFloat(value) || 0,
      },
    });
    validateField("coords", newReserveData.coords);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">
            Create New Reserve
          </h3>
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
              className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.name
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Reserve name..."
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Coordinates */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">
              Coordinates <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={newReserveData.coords?.lat || clickedCoords?.lat || ""}
                  onChange={(e) => handleCoordChange("lat", e.target.value)}
                  className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 text-sm ${
                    errors.coords
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="0.0000"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={newReserveData.coords?.lng || clickedCoords?.lng || ""}
                  onChange={(e) => handleCoordChange("lng", e.target.value)}
                  className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 text-sm ${
                    errors.coords
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="0.0000"
                />
              </div>
            </div>
            {errors.coords && (
              <p className="mt-1 text-xs text-red-600">{errors.coords}</p>
            )}
          </div>

          {/* Type Field */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">
              Type <span className="text-red-500">*</span>
            </label>
            <select
              value={newReserveData.type || ""}
              onChange={(e) => handleInputChange("type", e.target.value)}
              className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 ${
                errors.type
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300"
              }`}
            >
              <option value="">Select type...</option>
              {Array.from(
                new Set(
                  mapicons
                    .map((icon) => icon.type?.toLowerCase()?.trim())
                    .filter(Boolean),
                ),
              ).map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
            {errors.type && (
              <p className="mt-1 text-xs text-red-600">{errors.type}</p>
            )}
          </div>

          {/* Species */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">
              Species <span className="text-red-500">*</span>
            </label>
            <div className="space-y-1 mb-2">
              {(newReserveData.animals || []).length === 0 ? (
                <p className="text-xs text-gray-500 italic">No species added</p>
              ) : (
                newReserveData.animals.map((animal, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={animal || ""}
                      onChange={(e) => updateSpecies(i, e.target.value)}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-400 outline-none"
                      placeholder="Species name..."
                    />
                    <button
                      type="button"
                      onClick={() => removeSpecies(i)}
                      className="px-3 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>
            {errors.animals && (
              <p className="mb-2 text-xs text-red-600">{errors.animals}</p>
            )}
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
            <label className="text-sm font-semibold text-gray-700 block mb-2">
              Description
            </label>
            <textarea
              value={newReserveData.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Description..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleCreateReserve}
              disabled={
                Object.values(errors).some(Boolean) ||
                !newReserveData.name?.trim()
              }
              className={`flex-1 px-6 py-3 font-semibold rounded-xl shadow-lg transition-all ${
                Object.values(errors).some(Boolean) ||
                !newReserveData.name?.trim()
                  ? "bg-gray-300 cursor-not-allowed text-gray-500"
                  : "bg-emerald-500 hover:bg-emerald-600 text-white"
              }`}
            >
              Create Reserve
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
