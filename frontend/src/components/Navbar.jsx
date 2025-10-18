import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Home,
  Search,
  User,
  LogIn,
  UserPlus,
  History,
  FileText,
  LogOut,
  Trash2,
} from "lucide-react";

import AuthModal from "./AuthModal";
import HistoryLogModal from "./HistoryLogModal";
import PreviousResultsModal from "./PreviousResultsModal"; // <-- import

function Navbar() {
  const location = useLocation();
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState(true);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showPreviousResultsModal, setShowPreviousResultsModal] = useState(false); // new
  const isLoggedIn = !!localStorage.getItem("token");
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowAccountMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const links = [
    { to: "/", icon: Home, text: "Home" },
    { to: "/unifinder", icon: Search, text: "Find Programs" },
  ];

  return (
    <>
      <div className="w-full flex justify-center absolute top-3 xs:top-4 sm:top-5 md:top-6 left-0 z-50">
        <nav className="flex items-center justify-between w-[95%] xs:w-[90%] sm:w-[85%] md:w-[80%] lg:w-[70%] xl:w-[60%] px-3 sm:px-5 py-2 sm:py-3 rounded-full bg-[#003C8F]/90 backdrop-blur-md shadow-lg text-white">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-white">
            <GraduationCap className="w-6 xs:w-7 h-6 xs:h-7 text-white drop-shadow-lg" />
            <span className="text-sm xs:text-base sm:text-lg md:text-2xl font-bold text-white tracking-wide leading-tight whitespace-nowrap">
              Uni-Finder
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1 xs:space-x-2 sm:space-x-4 md:space-x-6 relative">
            {links.map(({ to, icon: Icon, text }) => {
              const isActive = location.pathname === to;
              return (
                <motion.div key={to} className="relative flex flex-col items-center" whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.05 }}>
                  {isActive && <motion.div layoutId="tracker" className="absolute inset-0 rounded-full bg-blue-500/40" transition={{ type: "spring", stiffness: 300, damping: 25 }} />}
                  <Link to={to} className="relative flex items-center sm:space-x-2 px-2 sm:px-3 py-1 text-xs xs:text-sm sm:text-base md:text-lg font-semibold text-white hover:text-white z-10">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    <span className="hidden sm:inline text-white">{text}</span>
                  </Link>
                </motion.div>
              );
            })}

            {/* Account Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowAccountMenu((prev) => !prev)} className="flex items-center space-x-2 text-white px-2 sm:px-3 py-1 rounded-full font-semibold text-sm sm:text-base">
                <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </motion.button>

              <AnimatePresence>
                {showAccountMenu && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 12 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }} className="absolute right-0 mt-4 w-60 rounded-2xl shadow-lg border border-blue-800/40 overflow-hidden z-50 bg-[#003C8F]/70 backdrop-blur-xl">
                    {!isLoggedIn ? (
                      <>
                        <button className="flex items-center gap-3 w-full text-left px-5 py-3 text-white hover:bg-blue-800/60" onClick={() => { setAuthMode(true); setShowAuthModal(true); setShowAccountMenu(false); }}>
                          <LogIn className="w-5 h-5 text-white" /> Login
                        </button>
                        <button className="flex items-center gap-3 w-full text-left px-5 py-3 text-white hover:bg-blue-800/60" onClick={() => { setAuthMode(false); setShowAuthModal(true); setShowAccountMenu(false); }}>
                          <UserPlus className="w-5 h-5 text-white" /> Register
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="flex items-center gap-3 w-full text-left px-5 py-3 text-white hover:bg-blue-800/60" onClick={() => { setShowHistoryModal(true); setShowAccountMenu(false); }}>
                          <History className="w-5 h-5 text-white" /> History Log
                        </button>

                        {/* PREVIOUS RESULTS */}
                        <button className="flex items-center gap-3 w-full text-left px-5 py-3 text-white hover:bg-blue-800/60" onClick={() => { setShowPreviousResultsModal(true); setShowAccountMenu(false); }}>
                          <FileText className="w-5 h-5 text-white" /> View Previous Results
                        </button>

                        <button className="flex items-center gap-3 w-full text-left px-5 py-3 text-white hover:bg-blue-800/60" onClick={async () => { const token = localStorage.getItem("token"); if (!token) return; try { await fetch("http://localhost:8000/logout", { method: "POST", headers: { Authorization: `Bearer ${token}` } }); localStorage.clear(); setShowAccountMenu(false); window.location.reload(); alert("Logged out successfully!"); } catch { alert("Logout failed"); } }}>
                          <LogOut className="w-5 h-5 text-white" /> Logout
                        </button>

                        <button className="flex items-center gap-3 w-full text-left px-5 py-3 text-white hover:bg-red-600/70" onClick={async () => { const confirmDelete = window.confirm("Are you sure you want to delete your account?"); if (!confirmDelete) return; const token = localStorage.getItem("token"); if (!token) return; try { await fetch("http://localhost:8000/delete-account", { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }); localStorage.clear(); setShowAccountMenu(false); window.location.reload(); alert("Account deleted successfully!"); } catch { alert("Failed to delete account."); } }}>
                          <Trash2 className="w-5 h-5 text-white" /> Delete Account
                        </button>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </nav>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} defaultIsLogin={authMode} />
      <HistoryLogModal isOpen={showHistoryModal} onClose={() => setShowHistoryModal(false)} />
      <PreviousResultsModal isOpen={showPreviousResultsModal} onClose={() => setShowPreviousResultsModal(false)} /> {/* new */}
    </>
  );
}

export default Navbar;
