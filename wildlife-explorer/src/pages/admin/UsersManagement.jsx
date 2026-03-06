// UsersManagement.jsx - Fully Responsive with Stats Card One-Time Animation
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import {
  Users,
  CheckCircle2,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useUsers } from "../../hooks/useUsers";
import { useNavigate, useSearchParams } from "react-router-dom";
import UserModal from "../../components/UserModal";

export default function UsersManagement() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    users,
    isLoading: loading,
    error,
    fetchUsers,
    createUser,
    deleteUser,
    updateUser,
  } = useUsers();

  // Animation state - only animate stats once on initial load
  const [hasAnimatedStats, setHasAnimatedStats] = useState(false);

  // Core states
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    role: searchParams.get("role") || "all",
    status: searchParams.get("status") || "all",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    status: "pending",
  });
  const [showModal, setShowModal] = useState(false);

  const USERS_PER_PAGE = 10;

  // Trigger stats animation only once when users load
  useEffect(() => {
    if (users.length > 0 && !hasAnimatedStats) {
      setHasAnimatedStats(true);
    }
  }, [users, hasAnimatedStats]);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
      return;
    }
    fetchUsers();
  }, [isAdmin, navigate, fetchUsers]);

  useEffect(() => {
    setSearchParams(filters, { replace: true });
  }, [filters, setSearchParams]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        !filters.search ||
        user.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email?.toLowerCase().includes(filters.search.toLowerCase());
      const matchesRole = filters.role === "all" || user.role === filters.role;
      const matchesStatus =
        filters.status === "all" || user.status === filters.status;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, filters]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * USERS_PER_PAGE;
    return filteredUsers.slice(startIndex, startIndex + USERS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  const stats = useMemo(
    () => ({
      total: users.length,
      active: users.filter((u) => u.status === "verified").length,
      pending: users.filter((u) => u.status === "pending").length,
      researchers: users.filter((u) => u.role === "researcher").length,
    }),
    [users],
  );

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  }, []);

  const handleAddUser = async (userData) => {
    try {
      if (userData._id) {
        await updateUser(userData._id, userData);
      } else {
        await createUser(userData);
      }
      setShowModal(false);
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "user",
        status: "pending",
      });
      fetchUsers();
      console.log("User data saved:", userData);
    } catch (err) {
      console.error("Error saving user:", err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(userId);
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 sm:pt-24 flex items-center justify-center bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
        <div className="text-center p-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20 sm:pt-24 flex items-center justify-center bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
        <div className="p-6 sm:p-8 bg-white rounded-3xl shadow-2xl max-w-sm sm:max-w-md w-full mx-4 text-center">
          <p className="text-xl sm:text-2xl text-red-600 mb-4">
            Error loading users
          </p>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">{error}</p>
          <button
            onClick={fetchUsers}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-emerald-600 text-white rounded-2xl font-semibold hover:bg-emerald-700 transition-all text-sm sm:text-base"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const StatsCard = ({ icon: Icon, title, value }) => {
    return (
      <motion.div
        initial={hasAnimatedStats ? false : { opacity: 0, y: 20 }}
        animate={hasAnimatedStats ? false : { opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="group bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-emerald-200 h-full"
      >
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-emerald-100 to-blue-100 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
            <Icon className="w-5 h-5 sm:w-7 sm:h-7 text-emerald-600" />
          </div>
        </div>
        <h3 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 group-hover:bg-gradient-to-r group-hover:from-emerald-600 group-hover:to-blue-600 group-hover:bg-clip-text group-hover:text-transparent transition-all leading-tight">
          {value}
        </h3>
        <p className="text-sm sm:text-xl font-semibold text-gray-700 leading-tight">
          {title}
        </p>
      </motion.div>
    );
  };

  const StatusBadge = ({ status }) => {
    const colors = {
      verified: "bg-emerald-100 text-emerald-800",
      active: "bg-blue-100 text-blue-800",
      pending: "bg-yellow-100 text-yellow-800",
      inactive: "bg-gray-100 text-gray-800",
    };
    return (
      <span
        className={`px-2 py-1 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold ${colors[status] || colors.inactive}`}
      >
        {status?.charAt(0).toUpperCase() + status?.slice(1) || "Unknown"}
      </span>
    );
  };

  const RoleBadge = ({ role }) => {
    const colors = {
      admin: "bg-purple-100 text-purple-800",
      researcher: "bg-emerald-100 text-emerald-800",
      user: "bg-gray-100 text-gray-800",
    };
    return (
      <span
        className={`px-2 py-1 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold ${colors[role] || colors.user}`}
      >
        {role?.charAt(0).toUpperCase() + role?.slice(1) || "User"}
      </span>
    );
  };

  return (
    <div className="min-h-screen pt-16 sm:pt-20 lg:pt-24 pb-12 sm:pb-16 lg:pb-20 bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 max-w-7xl mx-auto space-y-8 sm:space-y-12 lg:space-y-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4 sm:mb-6">
            Users Management
          </h1>
          <p className="text-base sm:text-xl lg:text-2xl max-w-3xl mx-auto text-gray-700 leading-relaxed px-4">
            Complete control over your user base with advanced filtering,
            search, and management tools.
          </p>
        </motion.div>

        {/* Stats Cards - One-time animation */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
          <StatsCard
            icon={Users}
            title="Total Users"
            value={stats.total}
      
          />
          <StatsCard
            icon={CheckCircle2}
            title="Verified"
            value={stats.active}
            
          />
          <StatsCard
            icon={AlertCircle}
            title="Pending"
            value={stats.pending}
        
          />
          <StatsCard
            icon={Users}
            title="Researchers"
            value={stats.researchers}
    
          />
        </section>

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/50 overflow-hidden"
        >
          {/* Filters Row */}
          <div className="p-4 sm:p-6 lg:p-8 border-b border-emerald-100 bg-gradient-to-r from-emerald-50/50 to-blue-50/50">
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-stretch lg:items-center justify-between">
              {/* Search Input */}
              <div className="flex-1 max-w-full lg:max-w-md">
                <div className="relative">
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={filters.search}
                    onChange={(e) =>
                      handleFilterChange("search", e.target.value)
                    }
                    className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:border-emerald-300 focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all duration-300 text-base sm:text-lg"
                  />
                </div>
              </div>

              {/* Filters & Add Button */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center lg:w-auto">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 w-full sm:w-auto">
                  {/* Role Filter */}
                  <div className="relative">
                    <select
                      value={filters.role}
                      onChange={(e) =>
                        handleFilterChange("role", e.target.value)
                      }
                      className="w-full min-w-[160px] px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:border-emerald-300 focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all duration-300 text-base sm:text-lg bg-white appearance-none cursor-pointer pr-10"
                    >
                      <option value="all">All Roles</option>
                      <option value="admin">Admin</option>
                      <option value="researcher">Researcher</option>
                      <option value="user">User</option>
                    </select>
                    <svg
                      className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-all"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>

                  {/* Status Filter */}
                  <div className="relative">
                    <select
                      value={filters.status}
                      onChange={(e) =>
                        handleFilterChange("status", e.target.value)
                      }
                      className="w-full min-w-[160px] px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:border-emerald-300 focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all duration-300 text-base sm:text-lg bg-white appearance-none cursor-pointer pr-10"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="verified">Verified</option>
                      <option value="pending">Pending</option>
                      <option value="inactive">Inactive</option>
                    </select>
                    <svg
                      className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-all"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Add User Button */}
                <motion.button
                  onClick={() => setShowModal(true)}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-blue-600 text-white px-4 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-lg shadow-xl hover:shadow-2xl hover:from-emerald-700 hover:to-blue-700 transition-all duration-300 flex-shrink-0 w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Add User</span>
                </motion.button>
              </div>
            </div>

            <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-600">
              Showing {paginatedUsers.length} of {filteredUsers.length} users
              {filteredUsers.length !== users.length && (
                <span className="ml-1 sm:ml-2 text-emerald-600 font-semibold">
                  ({filteredUsers.length} filtered)
                </span>
              )}
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="block lg:hidden p-4 sm:p-6">
            {paginatedUsers.map((user, index) => (
              <motion.div
                key={user._id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white border border-gray-100 rounded-xl mb-4 p-4 sm:p-6 hover:bg-gray-50 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-lg sm:text-xl text-gray-900 flex-1 pr-4">
                    {user.name}
                  </h3>
                  <div className="flex gap-2">
                    <motion.button
                      className="p-2 sm:p-3 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-xl transition-all hover:scale-110"
                      whileHover={{ scale: 1.1 }}
                      onClick={() => navigate(`/admin/users/${user._id}`)}
                      disabled={user.role === "admin"}
                    >
                      <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.button>
                    <motion.button
                      className="p-2 sm:p-3 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100 rounded-xl transition-all hover:scale-110"
                      whileHover={{ scale: 1.1 }}
                      disabled={user.role === "admin"}
                      onClick={() => {
                        setFormData({
                          name: user.name,
                          email: user.email,
                          password: "",
                          role: user.role,
                          status: user.status,
                          _id: user._id,
                        });
                        setSelectedUser(user);
                        setShowModal(true);
                      }}
                    >
                      <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.button>
                    <motion.button
                      className="p-2 sm:p-3 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-xl transition-all hover:scale-110"
                      whileHover={{ scale: 1.1 }}
                      onClick={() => handleDeleteUser(user._id)}
                      disabled={user.role === "admin"}
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.button>
                  </div>
                </div>
                <div className="space-y-2 text-sm sm:text-base">
                  <p className="text-gray-700">{user.email}</p>
                  <div className="flex gap-2 flex-wrap">
                    <RoleBadge role={user.role} />
                    <StatusBadge status={user.status} />
                  </div>
                  <p className="text-gray-600">
                    Joined:{" "}
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-emerald-50 to-blue-50">
                <tr>
                  <th className="text-left p-4 sm:p-6 text-gray-800 font-semibold text-base sm:text-lg whitespace-nowrap">
                    Name
                  </th>
                  <th className="text-left p-4 sm:p-6 text-gray-800 font-semibold text-base sm:text-lg whitespace-nowrap">
                    Email
                  </th>
                  <th className="text-left p-4 sm:p-6 text-gray-800 font-semibold text-base sm:text-lg whitespace-nowrap">
                    Role
                  </th>
                  <th className="text-left p-4 sm:p-6 text-gray-800 font-semibold text-base sm:text-lg whitespace-nowrap">
                    Status
                  </th>
                  <th className="text-left p-4 sm:p-6 text-gray-800 font-semibold text-base sm:text-lg whitespace-nowrap">
                    Joined
                  </th>
                  <th className="text-left p-4 sm:p-6 text-gray-800 font-semibold text-base sm:text-lg whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user, index) => (
                  <motion.tr
                    key={user._id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-t border-gray-100 hover:bg-gray-50 transition-all duration-300"
                  >
                    <td className="p-4 sm:p-6 font-bold text-base sm:text-xl text-gray-900 max-w-xs">
                      {user.name}
                    </td>
                    <td className="p-4 sm:p-6 text-sm sm:text-lg text-gray-700 max-w-md truncate">
                      {user.email}
                    </td>
                    <td className="p-4 sm:p-6">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="p-4 sm:p-6">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="p-4 sm:p-6 text-sm sm:text-lg text-gray-600 whitespace-nowrap">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="p-4 sm:p-6">
                      <div className="flex space-x-2 sm:space-x-3">
                        <motion.button
                          className="p-2 sm:p-3 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-xl sm:rounded-2xl transition-all hover:scale-110"
                          whileHover={{ scale: 1.1 }}
                          onClick={() => navigate(`/admin/users/${user._id}`)}
                          disabled={user.role === "admin"}
                        >
                          <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                        </motion.button>
                        <motion.button
                          className="p-2 sm:p-3 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100 rounded-xl sm:rounded-2xl transition-all hover:scale-110"
                          whileHover={{ scale: 1.1 }}
                          disabled={user.role === "admin"}
                          onClick={() => {
                            setFormData({
                              name: user.name,
                              email: user.email,
                              password: "",
                              role: user.role,
                              status: user.status,
                              _id: user._id,
                            });
                            setSelectedUser(user);
                            setShowModal(true);
                          }}
                        >
                          <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                        </motion.button>
                        <motion.button
                          className="p-2 sm:p-3 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-xl sm:rounded-2xl transition-all hover:scale-110"
                          whileHover={{ scale: 1.1 }}
                          onClick={() => handleDeleteUser(user._id)}
                          disabled={user.role === "admin"}
                        >
                          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredUsers.length > USERS_PER_PAGE && (
            <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-emerald-50 to-blue-50 border-t border-emerald-100">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 sm:space-x-2">
                <motion.button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl bg-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm sm:text-base font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Previous
                </motion.button>
                <span className="px-4 py-2 sm:px-6 sm:py-3 font-semibold text-base sm:text-lg text-center">
                  Page {currentPage} of{" "}
                  {Math.ceil(filteredUsers.length / USERS_PER_PAGE)}
                </span>
                <motion.button
                  onClick={() =>
                    setCurrentPage((p) =>
                      Math.min(
                        p + 1,
                        Math.ceil(filteredUsers.length / USERS_PER_PAGE),
                      ),
                    )
                  }
                  disabled={
                    currentPage ===
                    Math.ceil(filteredUsers.length / USERS_PER_PAGE)
                  }
                  className="px-4 py-2 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl bg-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm sm:text-base font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Next
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <UserModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedUser(null);
          setFormData({
            name: "",
            email: "",
            password: "",
            role: "user",
            status: "pending",
          });
        }}
        formData={formData}
        selectedUser={selectedUser}
        onSubmit={handleAddUser}
        onChange={setFormData}
      />
    </div>
  );
}
