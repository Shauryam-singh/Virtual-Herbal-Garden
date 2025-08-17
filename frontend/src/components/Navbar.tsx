import { useState } from "react";
import { Link } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white w-full z-50 shadow-lg">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <h1 className="text-2xl font-bold text-green-500">Healthify</h1>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6">
          <Link to="/" className="hover:text-green-400 transition">Home</Link>
          <Link to="/garden" className="hover:text-green-400 transition">Garden</Link>
          <Link to="/disease" className="hover:text-green-400 transition">Disease & Treatment</Link>
          <Link to="/quiz" className="hover:text-green-400 transition">Quiz</Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <HiX size={28} /> : <HiMenu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 flex flex-col px-6 py-4 space-y-4">
          <Link
            to="/"
            className="hover:text-green-400 transition"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/garden"
            className="hover:text-green-400 transition"
            onClick={() => setIsOpen(false)}
          >
            Garden
          </Link>
          <Link
            to="/disease"
            className="hover:text-green-400 transition"
            onClick={() => setIsOpen(false)}
          >
            Disease & Treatment
          </Link>
          <Link
            to="/quiz"
            className="hover:text-green-400 transition"
            onClick={() => setIsOpen(false)}
          >
            Quiz
          </Link>
        </div>
      )}
    </nav>
  );
}
