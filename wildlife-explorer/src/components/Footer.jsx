import { motion } from "framer-motion";
import {
  Twitter,
  Instagram,
  Facebook,
  Mail,
  MapPin,
  Phone,
  ChevronRight,
  Heart,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useNewsletter } from "../hooks/useNewsletter";

export default function Footer() {
  const { subscribe, loading, message, setMessage } = useNewsletter();
  const [email, setEmail] = useState("");
  const Navigate = useNavigate();

  const handleFooterSubscribe = async (e) => {
    e.preventDefault();
    if (email) {
      try {
        await subscribe(email);
        setEmail("");
        setMessage("Thanks for subscribing!");
      } catch (err) {
        console.error("Subscription error:", err);
      }
    }
  };

  // Add scrollToSection function
  // Updated scrollToSection function
  const scrollToSection = (href) => {
    // Handle external navigation (starts with http/https)
    if (href.startsWith("http")) {
      window.open(href, "_blank");
      return;
    }

    const url = new URL(href, window.location.origin);
    const targetPath = url.pathname;
    const hash = url.hash;

    if (targetPath !== window.location.pathname) {
      // Navigate to the new page
      Navigate(targetPath);

      // After navigation, scroll to hash (with small delay for route transition)
      if (hash) {
        setTimeout(() => {
          const element = document.querySelector(hash);
          if (element) {
            element.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }, 100); // Small delay to allow route to load
      }
    } else {
      // Same page - direct scroll to hash
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      } else {
        // No hash, scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Gallery", href: "gallery" }, // Update to section IDs
    { name: "Reserves", href: "/reserves" },
    { name: "About", href: "/about" },
    { name: "Donate", href: "/about#donate" },
    { name: "Contact", href: "/about#contact" },
  ];

  const quickLinks = [
    { name: "Privacy Policy", href: "#privacy" },
    { name: "Terms of Service", href: "#terms" },
    { name: "Careers", href: "#careers" },
    { name: "Press", href: "#press" },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-green-900 via-blue-900 to-gray-900 text-white relative overflow-hidden"
    >
      {/* Background Pattern - unchanged */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-16">
          {/* Logo & Description - unchanged */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="col-span-1 lg:col-span-1"
          >
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Heart className="w-7 h-7 text-green-400" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                  Wildlife Explorer
                </h2>
                <p className="text-sm text-gray-400">
                  Protecting biodiversity worldwide
                </p>
              </div>
            </Link>
            <p className="text-gray-400 leading-relaxed mb-6 max-w-sm">
              Dedicated to preserving endangered species and their natural
              habitats through conservation, education, and global partnerships.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="group p-3 bg-white/10 hover:bg-white/20 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5 group-hover:-rotate-12 transition-transform" />
              </a>
              <a
                href="#"
                className="group p-3 bg-white/10 hover:bg-white/20 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 group-hover:-rotate-12 transition-transform" />
              </a>
              <a
                href="#"
                className="group p-3 bg-white/10 hover:bg-white/20 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 group-hover:-rotate-12 transition-transform" />
              </a>
            </div>
          </motion.div>

          {/* Navigation Links - Updated with onClick */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <h4 className="text-lg font-bold text-white mb-6 flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Explore
            </h4>
            <nav className="space-y-3">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="group flex items-center w-full text-left text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 text-sm font-medium bg-transparent border-none p-0 cursor-pointer"
                >
                  {item.name}
                  <ChevronRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </nav>
          </motion.div>

          {/* Quick Links - Updated with onClick */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <h4 className="text-lg font-bold text-white mb-6 flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              Legal
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="w-full text-left text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 text-sm font-medium group bg-transparent border-none p-0 cursor-pointer"
                  >
                    {link.name}
                    <ChevronRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 inline-block transition-all" />
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter Signup - unchanged */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <h4 className="text-lg font-bold text-white mb-6 flex items-center">
              <Phone className="w-5 h-5 mr-2" />
              Stay Connected
            </h4>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              Join 50K+ conservationists. Get monthly updates on wildlife
              protection.
            </p>
            <form className="relative" onSubmit={handleFooterSubscribe}>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-transparent text-sm font-medium"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !email}
                className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl font-semibold shadow-lg transition-all text-xs ${
                  loading || !email
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 hover:shadow-xl hover:scale-105"
                }`}
              >
                {loading ? "..." : "Subscribe"}
              </button>
            </form>

            {message && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-4 text-xs text-green-400 text-center"
              >
                {message}
              </motion.p>
            )}
            <div className="flex items-center space-x-2 pt-2 text-xs text-gray-500">
              <input
                type="checkbox"
                id="privacy"
                className="w-4 h-4 rounded accent-green-400"
                required
              />
              <label htmlFor="privacy" className="cursor-pointer select-none">
                I agree to privacy policy
              </label>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar - unchanged */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="border-t border-white/10 pt-8 pb-6 text-center text-xs text-gray-500"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p>
              © 2026 Wildlife Explorer. All rights reserved. Based in{" "}
              <span className="font-semibold text-green-400">
                Quezon City, Philippines
              </span>
              .
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">
                Cookies
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Accessibility
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Modern Slavery
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Styles - unchanged */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </motion.footer>
  );
}
