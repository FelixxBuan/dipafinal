import { useState } from "react";
import { GraduationCap, Home, Search, BookOpen, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const mediumNavy = "#1A3A6D"; // dark navy blue
  const hoverNavy = "#0D2B5B"; // darker shade for hover

  return (
    <nav
  className="fixed top-0 left-0 w-full z-50 backdrop-blur-md"
  style={{
    fontFamily: "Poppins, sans-serif",
    background: "rgba(255, 255, 255, 0.95)",
    boxShadow: "0 0 15px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 255, 255, 0.5)",
    borderBottom: "1px solid rgba(255,255,255,0.3)",
  }}
>

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <GraduationCap className="w-10 h-10" style={{ color: mediumNavy }} />
            <span
              className="text-2xl font-bold tracking-wide"
              style={{ color: mediumNavy }}
            >
              Uni-Finder
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-6">
            {[
              { to: "/", icon: Home, text: "Home" },
              { to: "/unifinder", icon: Search, text: "Find Programs" },
              { to: "/programs", icon: BookOpen, text: "All Programs & Schools" },
            ].map(({ to, icon: Icon, text }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center space-x-2 transition-colors duration-200"
                style={{ color: mediumNavy }}
                onMouseEnter={(e) => (e.currentTarget.style.color = hoverNavy)}
                onMouseLeave={(e) => (e.currentTarget.style.color = mediumNavy)}
              >
                <Icon className="w-5 h-5" style={{ color: mediumNavy }} />
                <span className="text-lg font-semibold">{text}</span>
              </Link>
            ))}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded focus:outline-none focus:ring-2"
              style={{
                backgroundColor: mediumNavy,
                color: "white",
              }}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-2 space-y-2 pb-4">
            {[
              { to: "/", icon: Home, text: "Home" },
              { to: "/unifinder", icon: Search, text: "Find Programs" },
              { to: "/programs", icon: BookOpen, text: "All Programs & Schools" },
            ].map(({ to, icon: Icon, text }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center space-x-2 transition-colors duration-200"
                style={{ color: mediumNavy }}
                onMouseEnter={(e) => (e.currentTarget.style.color = hoverNavy)}
                onMouseLeave={(e) => (e.currentTarget.style.color = mediumNavy)}
                onClick={() => setIsOpen(false)}
              >
                <Icon className="w-5 h-5" style={{ color: mediumNavy }} />
                <span className="text-lg font-semibold">{text}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
