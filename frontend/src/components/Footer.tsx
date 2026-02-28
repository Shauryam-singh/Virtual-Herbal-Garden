import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaLeaf } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <FaLeaf className="text-green-500 text-2xl" />
              <span className="text-2xl font-bold text-white tracking-tight">
                Health<span className="text-green-500">ify</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              Empowering your wellness journey with plant-based knowledge, disease prevention, and interactive learning.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-green-400 transition">Home</Link></li>
              <li><Link to="/garden" className="hover:text-green-400 transition">My Garden</Link></li>
              <li><Link to="/disease" className="hover:text-green-400 transition">Disease Library</Link></li>
              <li><Link to="/quiz" className="hover:text-green-400 transition">Health Quiz</Link></li>
            </ul>
          </div>

          {/* Support / Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-green-400 transition">About Us</a></li>
              <li><a href="#" className="hover:text-green-400 transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-green-400 transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-green-400 transition">Contact</a></li>
            </ul>
          </div>

          {/* Newsletter / Social */}
          <div>
            <h3 className="text-white font-semibold mb-4">Stay Connected</h3>
            <div className="flex space-x-4 mb-6">
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-green-600 hover:text-white transition">
                <FaFacebook size={18} />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-green-600 hover:text-white transition">
                <FaTwitter size={18} />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-green-600 hover:text-white transition">
                <FaInstagram size={18} />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-green-600 hover:text-white transition">
                <FaLinkedin size={18} />
              </a>
            </div>
            <p className="text-xs uppercase tracking-widest font-bold text-gray-500">Subscribe to updates</p>
            <div className="mt-2 flex">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-gray-800 border-none rounded-l-md px-4 py-2 text-sm focus:ring-1 focus:ring-green-500 outline-none w-full"
              />
              <button className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-r-md transition">
                Go
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>&copy; {currentYear} Healthify Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              System Status: Healthy
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}