import { GraduationCap, Home, Search } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

function Navbar() {
  const location = useLocation();

  const links = [
    { to: "/", icon: Home, text: "Home" },
    { to: "/unifinder", icon: Search, text: "Find Programs" },
  ];

  return (
    <div className="w-full flex justify-center absolute top-3 xs:top-4 sm:top-5 md:top-6 left-0 z-50">
      <nav
        className="flex items-center justify-between 
                   w-[95%] xs:w-[90%] sm:w-[85%] md:w-[80%] lg:w-[70%] xl:w-[60%]
                   px-2 xs:px-3 sm:px-5 md:px-6 
                   py-1 xs:py-1.5 sm:py-2 md:py-3
                   rounded-full bg-blue-400/20 backdrop-blur-md 
                   border border-white/20 shadow-lg text-white
                   transition-all duration-300 ease-in-out
                   max-[400px]:w-[92%] max-[370px]:w-[94%] max-[340px]:w-[96%] max-[320px]:scale-90"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center space-x-1 xs:space-x-2 sm:space-x-3 
                     max-[400px]:space-x-1.5 max-[350px]:space-x-1"
        >
          <GraduationCap
            className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 
                       max-[400px]:w-5 max-[400px]:h-5 max-[350px]:w-4 max-[350px]:h-4 
                       text-white drop-shadow-lg"
          />
          <span
            className="text-base xs:text-lg sm:text-xl md:text-2xl 
                       max-[400px]:text-sm max-[350px]:text-xs 
                       font-bold tracking-wide text-white drop-shadow-lg"
          >
            Uni-Finder
          </span>
        </Link>

        {/* Links */}
        <div
          className="flex items-center space-x-1 xs:space-x-2 sm:space-x-3 md:space-x-4 
                     max-[400px]:space-x-1.5 max-[350px]:space-x-1"
        >
          {links.map(({ to, icon: Icon, text }) => {
            const isActive = location.pathname === to;

            return (
              <motion.div
                key={to}
                className="relative flex flex-col items-center 
                           px-1 xs:px-2 sm:px-3 py-1 rounded-full
                           max-[400px]:px-1 max-[350px]:px-0.5"
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
              >
                {/* Active Tracker */}
                {isActive && (
                  <motion.div
                    layoutId="tracker"
                    className="absolute inset-0 -left-1 xs:-left-2 -right-1 xs:-right-2 
                               rounded-full bg-blue-500/30"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}

                <Link
                  to={to}
                  className="relative flex items-center space-x-1
                             text-xs xs:text-sm sm:text-base md:text-lg 
                             max-[400px]:text-[11px] max-[350px]:text-[10px]
                             font-semibold text-white drop-shadow
                             px-2 xs:px-3 sm:px-4 py-1"
                >
                  <Icon
                    className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 
                               max-[400px]:w-4 max-[400px]:h-4 max-[350px]:w-3.5 max-[350px]:h-3.5 
                               text-white drop-shadow"
                  />
                  <span
                    className="font-semibold text-white 
                               text-xs xs:text-sm sm:text-base md:text-lg 
                               max-[400px]:text-[11px] max-[350px]:text-[10px]"
                  >
                    {text}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
