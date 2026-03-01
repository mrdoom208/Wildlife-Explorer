import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit3, Trash2, Search, Loader2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import debounce from "lodash/debounce";
import { useNewsUpdates } from "../../../hooks/useNewsUpdates"; // You'll need to create this hook
import NewsUpdateModal from "./NewsUpdateModal"; // You'll need to create this modal

const categories = [
  "all",
  "environment",
  "conservation",
  "wildlife",
  "research",
  "policy",
  "events",
  "awareness",
];

export default function NewsUpdateCollection() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: "environment",
    title: "",
    excerpt: "",
    image: "",
    imageSrc: "",
    fullContent: "",
    date: new Date().toISOString().split("T")[0], // Today's date
    author: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isFiltering, setIsFiltering] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  const navigate = useNavigate();

  const {
    newsUpdates,
    isLoading: isLoadingNews,
    refetch,
    deleteNewsUpdate,
    createNewsUpdate,
    updateNewsUpdate,
  } = useNewsUpdates();

  const debouncedSetSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
      setIsFiltering(false);
      setCurrentPage(1);
    }, 300),
    [],
  );

  const handleSearchChange = (e) => {
    setIsFiltering(true);
    debouncedSetSearch(e.target.value);
  };

  const searchResults = useMemo(() => {
    let filtered = newsUpdates.filter((update) => {
      const matchesSearch =
        searchTerm === "" ||
        update.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        update.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        update.author?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        selectedFilter === "all" || update.category === selectedFilter;
      return matchesSearch && matchesFilter;
    });

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    const totalPagesCount = Math.ceil(filtered.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginated = filtered.slice(startIndex, endIndex);

    return {
      filteredUpdates: filtered,
      paginatedUpdates: paginated,
      totalPages: totalPagesCount,
      totalFiltered: filtered.length,
    };
  }, [newsUpdates, searchTerm, selectedFilter, currentPage, itemsPerPage]);

  const { filteredUpdates, paginatedUpdates, totalPages, totalFiltered } =
    searchResults || {};

  const handleChange = useCallback((e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files?.[0]) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const handleSubmit = async (formDataToSubmit) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const success = editingId
        ? await updateNewsUpdate(editingId, formDataToSubmit)
        : await createNewsUpdate(formDataToSubmit);

      if (!success) {
        throw new Error("Failed to submit news update");
      }
    } catch (error) {
      console.error("Submit error:", error);
      throw error;
    } finally {
      setLoading(false);
      refetch(); // Refresh the news updates list
      resetForm();
    }
  };

  const handleEdit = (update) => {
    setFormData({
      category: update.category,
      title: update.title,
      excerpt: update.excerpt,
      image: update.image,
      imageSrc: update.imageSrc,
      fullContent: update.fullContent,
      date: update.date.split("T")[0], // Format for date input
      author: update.author,
    });
    setImagePreview(update.imageSrc);
    setEditingId(update._id);
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setImagePreview(null);
    setFormData({
      category: "environment",
      title: "",
      excerpt: "",
      image: "",
      imageSrc: "",
      fullContent: "",
      date: new Date().toISOString().split("T")[0],
      author: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-22">
      {/* Header */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            News & Updates
          </h1>
          <p className="text-gray-600 mt-2">
            Manage news updates ({newsUpdates.length} total)
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all cursor-pointer"
          >
            <Plus size={20} />
            {showForm ? "Cancel" : "Add Update"}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <NewsUpdateModal
            show={showForm}
            formData={formData}
            imagePreview={imagePreview}
            loading={loading}
            uploadingImage={false}
            editingId={editingId}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onClose={resetForm}
          />
        )}
      </AnimatePresence>

      {/* Table Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto bg-white rounded-3xl p-8 shadow-2xl"
      >
        {/* Search/Filter */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8 items-center lg:items-start">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by title, excerpt, or author..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
              onChange={handleSearchChange}
            />
            {isFiltering && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-sm text-purple-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Filtering...</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setSelectedFilter(filter);
                  setCurrentPage(1);
                }}
                className={`px-4 py-4 rounded-xl font-medium transition-all text-sm ${
                  selectedFilter === filter
                    ? "bg-purple-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                {filter === "all"
                  ? "All"
                  : filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>

          <div className="text-sm text-gray-600 ml-auto hidden lg:block">
            {totalFiltered} Updates (Page {currentPage} of {totalPages})
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 font-semibold text-gray-800">
                  Image
                </th>
                <th className="text-left py-4 font-semibold text-gray-800 hidden border md:table-cell">
                  Title
                </th>
                <th className="text-left py-4 font-semibold text-gray-800 border sm:table-cell">
                  Category
                </th>
                <th className="text-left py-4 font-semibold text-gray-800 hidden border md:table-cell">
                  Excerpt
                </th>
                <th className="text-left py-4 font-semibold text-gray-800 hidden border lg:table-cell">
                  Author
                </th>
                <th className="text-left py-4 font-semibold text-gray-800 hidden border md:table-cell">
                  Date
                </th>
                <th className="text-left py-4 font-semibold text-gray-800 border md:table-cell">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoadingNews ? (
                <tr>
                  <td colSpan="6" className="py-16 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                      <span>Loading news updates...</span>
                    </div>
                  </td>
                </tr>
              ) : isFiltering ? (
                <tr>
                  <td colSpan="6" className="py-16 text-center">
                    <div className="flex items-center gap-2 text-purple-600">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>Filtering {totalFiltered} updates...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedUpdates.length > 0 ? (
                paginatedUpdates.map((update) => (
                  <motion.tr
                    key={update._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4">
                      <img
                        src={update.imageSrc}
                        alt={update.title}
                        className="w-16 h-16 rounded-xl object-cover shadow-md"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "block";
                        }}
                      />
                      <div className="w-16 h-16 rounded-xl bg-gray-200 flex items-center justify-center text-gray-500 text-xs hidden">
                        No Image
                      </div>
                    </td>
                    <td className="py-4 font-semibold text-gray-900 max-w-xs truncate">
                      {update.title}
                    </td>
                    <td className="py-4 hidden md:table-cell">
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                        {update.category}
                      </span>
                    </td>
                    <td className="py-4 hidden md:table-cell">
                      {update.excerpt}
                    </td>
                    <td className="py-4 hidden lg:table-cell max-w-xs truncate">
                      {update.author}
                    </td>
                    <td className="py-4 hidden xl:table-cell">
                      {new Date(update.date).toLocaleDateString()}
                    </td>
                    <td className="py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(update)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-xl transition-all shadow-sm"
                          title="Edit"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() => deleteNewsUpdate(update._id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-xl transition-all shadow-sm"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-16 text-center text-gray-500">
                    {searchTerm || selectedFilter !== "all"
                      ? `No updates match "${searchTerm}" in ${selectedFilter}.`
                      : "No news updates found. Add your first update!"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, totalFiltered)} of{" "}
              {totalFiltered} updates
            </div>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-xl font-medium hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum =
                    currentPage <= 3 ? i + 1 : totalPages - 4 + i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-xl font-medium transition-all ${
                        currentPage === pageNum
                          ? "bg-purple-500 text-white shadow-md"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-xl font-medium hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
