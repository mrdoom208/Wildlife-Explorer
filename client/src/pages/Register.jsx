import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  Shield,
  ArrowRight,
  ArrowLeft,
  Upload,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function UserRegistration() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "", // ✅ Fixed field name consistency
    role: "user",
    researcherProof: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  // ✅ Form validation
  const isStep1Valid = formData.email && formData.password && formData.name;
  const isStep2Valid = formData.researcherProof;

  // ✅ Fixed handleSubmit - proper FormData + Enter key support
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (formData.researcherProof) {
        submitData.append("researcherProof", formData.researcherProof);
      }

      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData), // ✅ Proper FormData usage
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Registration failed");

      // ✅ Auth context + localStorage
      login(data.token, data.user);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ Role-based redirect
      if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/"); // Regular users go home
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Step navigation
  const nextStep = () => {
    if (step === 1 && formData.role === "researcher") {
      setStep(2);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-blue-900 flex items-center justify-center p-3 ">
      {/* Back button */}
      <motion.div
        className="text-2xl font-bold bg-gradient-to-r from-green-600 via-blue-400 to-green-600 bg-[length:300%_100%] bg-clip-text text-transparent absolute top-6 left-6 animate-gradient cursor-pointer select-none"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        whileHover={{ scale: 1.05, x: -5, transition: { duration: 0.2 } }}
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
        className="bg-white/10 backdrop-blur-xl rounded-3xl px-12 py-8 max-w-md w-full border border-white/20 shadow-2xl"
      >
        <div className="text-center mb-5">
          <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-600 rounded-3xl mx-auto flex items-center justify-center mb-3">
            <User className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mb-4">
            Create Account
          </h1>
          <p className="text-gray-300">Join Wildlife Research Platform</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-between mb-8">
          <div
            className={`w-1/2 h-2 rounded-full transition-all duration-500 ${step === 1 ? "bg-green-500" : "bg-white/30"}`}
          />
          {step === 2 && (
            <div className="w-1/2 h-2 bg-green-500 rounded-full" />
          )}
        </div>

        {/* ✅ Fixed form with Enter key support */}
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
            {/* Step 1: Basic Info + Role Selection */}
            {step === 1 && (
              <>
                <div>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-transparent"
                      placeholder="Full Name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-transparent"
                      placeholder="Email Address"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-transparent"
                      placeholder="Password"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center space-x-4">
                    <label className="text-lg font-semibold text-gray-200 min-w-[40px]">
                      Role:
                    </label>
                    <div className="flex-1 relative min-w-0">
                      <svg
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                      <select
                        value={formData.role}
                        onChange={(e) =>
                          setFormData({ ...formData, role: e.target.value })
                        }
                        className="w-full pl-12 pr-8 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-transparent appearance-none"
                      >
                        <option
                          className="text-gray-900 bg-white hover:bg-gray-100"
                          value="user"
                        >
                          User
                        </option>
                        <option
                          className="text-gray-900 bg-white hover:bg-gray-100"
                          value="researcher"
                        >
                          Researcher
                        </option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg
                          className="w-5 h-5 text-gray-400"
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
                  </div>

                  {formData.role === "researcher" && (
                    <p className="text-sm text-green-300 mt-2 flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      Researcher accounts require verification
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Step 2: Researcher Proof */}
            {step === 2 && (
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-3">
                  Researcher Verification Document
                </label>
                <div className="relative border-2 border-dashed border-white/30 rounded-3xl p-8 text-center hover:border-green-400/50 transition-colors">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-300 mb-2">
                    Upload ID, Research Permit, or University Affiliation
                  </p>
                  <p className="text-sm text-gray-500 mb-6">
                    PDF, JPG, PNG (max 5MB)
                  </p>

                  <input
                    id="researcherProof"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        researcherProof: e.target.files[0],
                      })
                    }
                    className="hidden"
                  />
                  <label
                    htmlFor="researcherProof"
                    className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white py-3 px-8 rounded-xl font-bold cursor-pointer inline-block transition-all duration-300"
                  >
                    Choose File
                  </label>

                  {formData.researcherProof && (
                    <p className="text-green-400 mt-4 text-sm">
                      ✅ {formData.researcherProof.name} selected
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* ✅ Fixed buttons - Enter key works! */}
            {step === 1 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" // ✅ Enter key works here
                disabled={!isStep1Valid || loading}
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-xl hover:shadow-green-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  "Creating Account..."
                ) : formData.role === "researcher" ? (
                  <>
                    Continue as Researcher{" "}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                ) : (
                  <>
                    Create Account <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </motion.button>
            )}

            {step === 2 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" // ✅ Enter key works here too
                disabled={!isStep2Valid || loading}
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-xl hover:shadow-green-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? "Creating Account..." : "Complete Registration"}
                <ArrowRight className="ml-2 w-5 h-5" />
              </motion.button>
            )}

            {/* Continue button for researchers (Step 1 only) */}
            {step === 1 && formData.role === "researcher" && !loading && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={nextStep}
                disabled={!isStep1Valid}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-xl hover:shadow-blue-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                Continue to Upload Proof <ArrowRight className="ml-2 w-5 h-5" />
              </motion.button>
            )}
          </div>

          <div className="text-center text-gray-300 mt-6">
            Already have an account?{" "}
            <Link to="../login" className="text-green-400 hover:underline">
              Login
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
