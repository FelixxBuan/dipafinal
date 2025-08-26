import { useState } from "react";
import { GraduationCap, Home, Search, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

function Navbar({ sticky = true }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`w-full flex justify-center ${
        sticky ? "fixed top-6 left-0 z-50" : "relative"
      }`}
    >
      <nav
        className="flex items-center justify-between w-[850px] px-10 py-4 rounded-full 
                   bg-blue-400/20 backdrop-blur-md border-2 border-white/20 shadow-lg text-white"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3">
          <GraduationCap className="w-8 h-8 text-white" />
          <span className="text-2xl font-bold tracking-wide text-white">
            Uni-Finder
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center space-x-10">
          {[
            { to: "/", icon: Home, text: "Home" },
            { to: "/unifinder", icon: Search, text: "Find Programs" },
          ].map(({ to, icon: Icon, text }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center space-x-2 text-xl font-semibold text-white hover:text-gray-300 transition-colors duration-200"
            >
              <Icon className="w-6 h-6 text-white" />
              <span className="text-white">{text}</span>
            </Link>
          ))}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded text-white"
          >
            {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu (dropdown under pill) */}
      {isOpen && (
        <div className="absolute top-20 w-[850px] bg-blue-400/20 backdrop-blur-md border-2 border-white/20 rounded-lg shadow-md p-4 md:hidden text-white">
          {[
            { to: "/", icon: Home, text: "Home" },
            { to: "/unifinder", icon: Search, text: "Find Programs" },
          ].map(({ to, icon: Icon, text }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center space-x-3 py-3 text-xl font-semibold text-white hover:text-gray-300 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              <Icon className="w-6 h-6 text-white" />
              <span className="text-white">{text}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Navbar;
