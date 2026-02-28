import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { FaLeaf } from "react-icons/fa";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Garden", path: "/garden" },
    { name: "Disease & Treatment", path: "/disease" },
    { name: "Quiz", path: "/quiz" },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled 
          ? "bg-gray-900/90 backdrop-blur-lg py-3 shadow-2xl border-b border-gray-800" 
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-2">
          <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
            <FaLeaf className="text-white text-xl" />
          </div>
          <h1 className={`text-2xl font-black tracking-tight transition-colors duration-300 ${
            scrolled ? "text-white" : "text-gray-900"
          }`}>
            Health<span className="text-green-500">ify</span>
          </h1>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative text-sm font-bold uppercase tracking-wider transition-colors duration-300 hover:text-green-500 ${
                  isActive 
                    ? "text-green-500" 
                    : scrolled ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {link.name}
                {isActive && (
                  <motion.div 
                    layoutId="underline" 
                    className="absolute -bottom-2 left-0 w-full h-0.5 bg-green-500 rounded-full" 
                  />
                )}
              </Link>
            );
          })}
          <button className="bg-green-600 hover:bg-green-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-green-900/20 transition-all transform hover:scale-105 active:scale-95">
            Get Started
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className={`md:hidden p-2 rounded-lg transition-colors ${
            scrolled ? "text-white" : "text-gray-900"
          }`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <HiX size={28} /> : <HiMenuAlt3 size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-gray-900 border-t border-gray-800 shadow-2xl md:hidden"
          >
            <div className="flex flex-col p-8 space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-xl font-bold transition-colors ${
                    location.pathname === link.path ? "text-green-500" : "text-gray-300"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <button className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg">
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}