import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Activity,
  MapPin,
  BarChart3,
  Settings,
  LogOut,
  Eye,
  Edit,
  Trash2,
  Plus,
  Clock,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAnimals: 123,
    totalSightings: 456,
    activeResearchers: 23,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
      return;
    }
    fetchDashboardData();
  }, [isAdmin, navigate]);

  const fetchDashboardData = async () => {
    try {
      setRecentUsers([
        {
          id: 1,
          name: "Dr. Jane Smith",
          email: "jane@research.org",
          role: "researcher",
          status: "verified",
        },
        {
          id: 2,
          name: "John Doe",
          email: "john@example.com",
          role: "user",
          status: "active",
        },
        {
          id: 3,
          name: "Admin User",
          email: "admin@wildlife.com",
          role: "admin",
          status: "active",
        },
      ]);

      // Recent activity data
      setRecentActivity([
        {
          id: 1,
          action: "New sighting added",
          user: "Dr. Jane Smith",
          time: "2 min ago",
          type: "sighting",
          icon: Activity,
        },
        {
          id: 2,
          action: "User verified",
          user: "John Doe",
          time: "15 min ago",
          type: "user",
          icon: Users,
        },
        {
          id: 3,
          action: "Species updated",
          user: "Admin User",
          time: "1 hr ago",
          type: "animal",
          icon: MapPin,
        },
        {
          id: 4,
          action: "Report generated",
          user: "Sarah Wilson",
          time: "3 hrs ago",
          type: "report",
          icon: TrendingUp,
        },
      ]);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const StatsCard = ({ icon: Icon, title, value, trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-emerald-200"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-emerald-100 to-blue-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
          <Icon className="w-7 h-7 text-emerald-600" />
        </div>
        <div
          className={`text-sm px-3 py-1 rounded-full font-semibold ${
            trend === "up"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          +12%
        </div>
      </div>
      <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 group-hover:bg-gradient-to-r group-hover:from-emerald-600 group-hover:to-blue-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">
        {value}
      </h3>
      <p className="text-xl font-semibold text-gray-700">{title}</p>
    </motion.div>
  );

  return (
    <div className="min-h-screen pt-24 pb-20 bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-12">
        {/* Hero Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">
            Admin Dashboard
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-700 leading-relaxed">
            Manage users, track wildlife sightings, and monitor conservation
            efforts across the platform.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatsCard
            icon={Users}
            title="Total Users"
            value={stats.totalUsers}
            trend="up"
          />
          <StatsCard
            icon={Activity}
            title="Animal Sightings"
            value={stats.totalSightings}
            trend="up"
          />
          <StatsCard
            icon={MapPin}
            title="Wildlife Species"
            value={stats.totalAnimals}
            trend="up"
          />
          <StatsCard
            icon={Users}
            title="Researchers"
            value={stats.activeResearchers}
            trend="up"
          />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8"
            >
              <div className="flex space-x-2 bg-gradient-to-r from-emerald-100 via-blue-100 to-purple-100 rounded-2xl p-2">
                {["overview", "users", "animals", "reports"].map(
                  (tab, index) => (
                    <motion.button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
                        activeTab === tab
                          ? "bg-gradient-to-r from-emerald-600 to-blue-600 text-white shadow-xl"
                          : "text-gray-700 hover:text-gray-900 hover:bg-white/50 hover:shadow-lg"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </motion.button>
                  ),
                )}
              </div>
            </motion.div>

            {/* Users Table */}
            {activeTab === "users" && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden"
              >
                <div className="p-8 border-b border-emerald-100">
                  <h2 className="text-4xl font-bold text-gray-900 flex items-center space-x-4">
                    <Users className="w-9 h-9 text-emerald-600" />
                    <span>Manage Users</span>
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-emerald-50 to-blue-50">
                      <tr>
                        <th className="text-left p-6 text-gray-800 font-semibold text-lg">
                          Name
                        </th>
                        <th className="text-left p-6 text-gray-800 font-semibold text-lg">
                          Email
                        </th>
                        <th className="text-left p-6 text-gray-800 font-semibold text-lg">
                          Role
                        </th>
                        <th className="text-left p-6 text-gray-800 font-semibold text-lg">
                          Status
                        </th>
                        <th className="text-left p-6 text-gray-800 font-semibold text-lg">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentUsers.map((user, index) => (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border-t border-gray-100 hover:bg-gray-50 transition-all duration-300"
                        >
                          <td className="p-6 font-bold text-xl text-gray-900">
                            {user.name}
                          </td>
                          <td className="p-6 text-lg text-gray-700">
                            {user.email}
                          </td>
                          <td>
                            <span
                              className={`px-4 py-2 rounded-2xl text-sm font-bold ${
                                user.role === "admin"
                                  ? "bg-purple-100 text-purple-800"
                                  : user.role === "researcher"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`px-4 py-2 rounded-2xl text-sm font-bold ${
                                user.status === "verified"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {user.status}
                            </span>
                          </td>
                          <td className="p-6">
                            <div className="flex space-x-3">
                              <motion.button
                                className="p-3 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-2xl transition-all hover:scale-110"
                                whileHover={{ scale: 1.1 }}
                              >
                                <Eye className="w-5 h-5" />
                              </motion.button>
                              <motion.button
                                className="p-3 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100 rounded-2xl transition-all hover:scale-110"
                                whileHover={{ scale: 1.1 }}
                              >
                                <Edit className="w-5 h-5" />
                              </motion.button>
                              <motion.button
                                className="p-3 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-2xl transition-all hover:scale-110"
                                whileHover={{ scale: 1.1 }}
                              >
                                <Trash2 className="w-5 h-5" />
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-8 bg-gradient-to-r from-emerald-50 to-blue-50">
                  <Link
                    to="/admin/users"
                    className="inline-flex items-center space-x-3 bg-gradient-to-r from-emerald-600 to-blue-600 text-white px-8 py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:from-emerald-700 hover:to-blue-700 transition-all duration-300 hover:scale-105"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add New User</span>
                  </Link>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar - Recent Activity Feed */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center space-x-3">
                <Clock className="w-8 h-8 text-emerald-600" />
                <span>Recent Activity</span>
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {recentActivity.map(
                  ({ id, action, user, time, icon: Icon, type }, index) => (
                    <motion.div
                      key={id}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group flex items-start space-x-4 p-4 rounded-2xl hover:bg-emerald-50 transition-all cursor-pointer border border-gray-100 hover:border-emerald-200"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-emerald-100 to-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-lg group-hover:text-emerald-700">
                          {action}
                        </p>
                        <p className="text-sm text-gray-500 truncate">{user}</p>
                        <p className="text-xs text-gray-400 mt-1 flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{time}</span>
                        </p>
                      </div>
                    </motion.div>
                  ),
                )}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link
                  to="/admin/users"
                  className="w-full flex items-center space-x-3 p-4 rounded-2xl hover:bg-emerald-50 hover:text-emerald-700 transition-all group"
                >
                  <Users className="w-5 h-5 text-emerald-600 group-hover:scale-110" />
                  <span className="font-semibold">Manage Users</span>
                </Link>
                <Link
                  to="/admin/animals"
                  className="w-full flex items-center space-x-3 p-4 rounded-2xl hover:bg-emerald-50 hover:text-emerald-700 transition-all group"
                >
                  <Activity className="w-5 h-5 text-emerald-600 group-hover:scale-110" />
                  <span className="font-semibold">Animal Collection</span>
                </Link>
                <Link
                  to="/admin/reports"
                  className="w-full flex items-center space-x-3 p-4 rounded-2xl hover:bg-emerald-50 hover:text-emerald-700 transition-all group"
                >
                  <TrendingUp className="w-5 h-5 text-emerald-600 group-hover:scale-110" />
                  <span className="font-semibold">View Reports</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
