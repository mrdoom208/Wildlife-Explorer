import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, ArrowLeft } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // Add this import

export default function AdminLogin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); // Add this hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      // Store token and user data (keeping your existing logic)
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Call the auth context login function to update global state
      login(data.token, data.user);

      navigate("/admin/animalCollection");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Rest of your component remains exactly the same...
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-blue-900 flex items-center justify-center p-4">
      <motion.div
        className="text-2xl font-bold bg-gradient-to-r from-green-600 via-blue-400 to-green-600 bg-[length:300%_100%] bg-clip-text text-transparent absolute top-6 left-6 animate-gradient cursor-pointer select-none"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        whileHover={{
          scale: 1.05,
          x: -5,
          transition: { duration: 0.2 },
        }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/")}
      >
        <div className="flex items-center">
          <motion.div
            className="mr-2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </motion.div>
          WildLife Explorer
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 max-w-md w-full border border-white/20 shadow-2xl"
      >
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-600 rounded-3xl mx-auto flex items-center justify-center mb-6">
            <Mail className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mb-4">
            Login Portal
          </h1>
          <p className="text-gray-300">Manage your own wildlife database</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/20 border border-red-500/50 text-red-100 p-4 rounded-2xl mb-6"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-3">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-transparent"
                  placeholder="admin@wildlife.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-3">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="text-right mt-2">
                <Link
                  to="../register"
                  className="text-sm text-green-400 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-xl hover:shadow-green-500/25 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? (
                "Signing In..."
              ) : (
                <>
                  Login
                  <ArrowRight className="ml-2 inline w-5 h-5" />
                </>
              )}
            </motion.button>
            <div className="text-center text-gray-300">
              Don't have an account?{" "}
              <Link to="../register" className="text-green-400 hover:underline">
                Sign Up
              </Link>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
