import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, FileText, Calendar, Globe } from "lucide-react";
import { useState } from "react";

export default function PrivacyPolicyModal({ isOpen, onClose }) {
  const [activeSection, setActiveSection] = useState("intro");

  const sections = {
    intro: { title: "Introduction", icon: FileText },
    data: { title: "Data Collection", icon: Shield },
    cookies: { title: "Cookies", icon: Shield },
    security: { title: "Security", icon: Shield },
    children: { title: "Children", icon: Shield },
    contact: { title: "Contact", icon: Globe },
  };

  const scrollToSection = (section) => {
    setActiveSection(section);
    const element = document.getElementById(section);
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-white/50"
          >
            {/* Header */}
            <div className="p-8 border-b border-gray-200/50 sticky top-0 bg-white/80 backdrop-blur-sm z-10 rounded-t-3xl">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    Privacy Policy
                  </h2>
                  <p className="text-gray-600 mt-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Last Updated: March 2, 2026
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all ml-4"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </motion.button>
              </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
              {/* Sidebar Navigation */}
              <div className="w-64 bg-gradient-to-b from-white/90 to-gray-50/90 border-r border-gray-200/50 p-6 hidden lg:block">
                <nav className="space-y-2">
                  {Object.entries(sections).map(([key, section]) => {
                    const Icon = section.icon;
                    return (
                      <motion.button
                        key={key}
                        onClick={() => scrollToSection(key)}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all group ${
                          activeSection === key
                            ? "bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg"
                            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                        <span className="font-medium text-left">
                          {section.title}
                        </span>
                      </motion.button>
                    );
                  })}
                </nav>
              </div>

              {/* Content */}
              <div className="flex-1 p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {/* Introduction */}
                <section id="intro" className="mb-12">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <FileText className="w-8 h-8 text-green-600" />
                    Introduction
                  </h3>
                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-700 leading-relaxed mb-6">
                      Welcome to our Wildlife Conservation Information Website.
                      This Privacy Policy explains how we handle visitor
                      information when you browse our educational content about
                      wildlife conservation, news updates, and animal species
                      information.
                    </p>
                    <p className="text-gray-700 leading-relaxed bg-blue-50 p-4 rounded-xl border-l-4 border-l-blue-500">
                      <strong>Strictly informational:</strong> No accounts,
                      registrations, or personal data collection required.
                    </p>
                  </div>
                </section>

                {/* Data Collection */}
                <section id="data" className="mb-12">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <Shield className="w-8 h-8 text-green-600" />
                    Data Collection
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        No Personal Information
                      </h4>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li>• No accounts or logins</li>
                        <li>• No email signups</li>
                        <li>• No contact forms</li>
                      </ul>
                    </div>
                    <div className="bg-emerald-50 p-6 rounded-xl">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Technical Info Only
                      </h4>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li>• IP address (anonymized)</li>
                        <li>• Browser type</li>
                        <li>• Visit time</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Cookies */}
                <section id="cookies" className="mb-12">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <Shield className="w-8 h-8 text-green-600" />
                    Cookies & Tracking
                  </h3>
                  <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                      <div>
                        <h4 className="text-xl font-semibold text-gray-900 mb-4">
                          Minimal Cookies Only
                        </h4>
                        <ul className="space-y-3 text-gray-700">
                          <li className="flex items-start gap-3">
                            <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                            <span>
                              Session cookies (deleted when browser closes)
                            </span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                            <span>
                              No tracking, advertising, or analytics cookies
                            </span>
                          </li>
                        </ul>
                      </div>
                      <div className="text-center">
                        <div className="w-24 h-24 bg-white rounded-2xl p-4 mx-auto shadow-lg border-4 border-green-100">
                          <Shield className="w-12 h-12 text-green-600 mx-auto" />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Security & Other Sections */}
                <section id="security" className="mb-12">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <Shield className="w-8 h-8 text-green-600" />
                    Security
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    HTTPS encryption, CDN image hosting, no user database,
                    regular security updates.
                  </p>
                </section>

                <section id="children" className="mb-12">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <Shield className="w-8 h-8 text-green-600" />
                    Children's Privacy
                  </h3>
                  <p className="text-gray-700 leading-relaxed bg-emerald-50 p-6 rounded-xl">
                    Public educational website suitable for all ages. No
                    personal information collected.
                  </p>
                </section>

                <section id="contact">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <Globe className="w-8 h-8 text-green-600" />
                    Contact
                  </h3>
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-2xl border-2 border-gray-200">
                    <p className="text-gray-700 mb-4">
                      Wildlife Conservation Information Website
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      info@wildlifeconservation.info
                    </p>
                  </div>
                </section>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200/50 bg-white/80 backdrop-blur-sm rounded-b-3xl">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  © 2026 Wildlife Conservation Information Website
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="w-full max-w-xs bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-4 px-8 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 mx-auto"
                >
                  Close
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
