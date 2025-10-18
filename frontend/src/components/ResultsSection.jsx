import Navbar from "./Navbar"; // import your Navbar
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import {
  GraduationCap,
  MapPin,
  FileText,
  BookOpen,
  ListChecks,
  Link as LinkIcon,
  Building2,
  Ruler,
  AlertCircle,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Leaflet + React-Leaflet imports
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix missing Leaflet marker icons
const customMarker = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

// Calculate distance between two lat/lng points
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Component for pinning location
function LocationMarker({ setPinnedLocation }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      setPinnedLocation(e.latlng);
    }
  });

  return position ? <Marker position={position} icon={customMarker} /> : null;
}

function ResultsSection({ results, message }) {
  const navigate = useNavigate();

  // States
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [selectedSchools, setSelectedSchools] = useState([]);
  const [userLocation, setUserLocation] = useState({ lat: null, lng: null });
  const [userCity, setUserCity] = useState(null);
  const [schoolStrengths, setSchoolStrengths] = useState({});
  const [pinnedLocation, setPinnedLocation] = useState(null);
  const [showPinMap, setShowPinMap] = useState(false);

  // Sorting / filtering
  const [sortOption, setSortOption] = useState("");
  const [tuitionRange, setTuitionRange] = useState("");
  const [schoolTypeFilter, setSchoolTypeFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  // Dynamic filter states
const [activeFilter, setActiveFilter] = useState(""); // Main filter selected
const [subOption, setSubOption] = useState(""); // Sub-option selected (High-Low, Tuition range, etc.)


  // Get user geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });

          fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          )
            .then((res) => res.json())
            .then((data) => {
              const address = data.address || {};
              const city =
                address.city || address.town || address.village || address.county;
              setUserCity(city || null);
            })
            .catch(console.error);
        },
        (error) => console.error("Geolocation error:", error.message),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  }, []);

  // Fetch school strengths
  useEffect(() => {
    fetch("http://localhost:8000/api/school-strengths")
      .then((res) => res.json())
      .then((data) => {
        const dataObject = {};
        (data.schools || []).forEach((school) => {
          dataObject[school.name] = school;
        });
        setSchoolStrengths(dataObject);
      })
      .catch(console.error);
  }, []);

  // Reset pin map when switching expanded card
  useEffect(() => setShowPinMap(false), [expandedIndex]);

  // Handle compare checkbox
  const handleCheckboxChange = (item) => {
    const isAlreadySelected = selectedSchools.some(
      (school) => school.school === item.school && school.program === item.program
    );
    if (isAlreadySelected) {
      setSelectedSchools((prev) =>
        prev.filter(
          (school) => !(school.school === item.school && school.program === item.program)
        )
      );
    } else {
      setSelectedSchools((prev) => [...prev, item]);
    }
  };

  // Determine displayed results based on only one active filter/subOption
let displayedResults = results ? [...results] : [];

if (activeFilter === "board" && subOption) {
  if (subOption === "board_high") {
    displayedResults.sort(
      (a, b) => (parseFloat(b.board_passing_rate) || 0) - (parseFloat(a.board_passing_rate) || 0)
    );
  } else if (subOption === "board_low") {
    displayedResults.sort(
      (a, b) => (parseFloat(a.board_passing_rate) || 0) - (parseFloat(b.board_passing_rate) || 0)
    );
  }
} else if (activeFilter === "tuition" && subOption) {
  displayedResults = displayedResults.filter((item) => {
    const tuition = parseFloat(item.tuition_per_semester) || 0;
    if (subOption === "12000+") return tuition > 12000;
    const [min, max] = subOption.split("-").map(Number);
    return tuition >= min && tuition <= max;
  });
} else if (activeFilter === "school_type" && subOption) {
  displayedResults = displayedResults.filter(
    (item) => item.school_type?.toLowerCase() === subOption
  );
} else if (activeFilter === "location" && subOption) {
  displayedResults = displayedResults.filter((item) => item.location === subOption);
} else if (activeFilter === "unirank") {
  displayedResults.sort((a, b) => (parseInt(a.unirank) || 999) - (parseInt(b.unirank) || 999));
}


  // Peso Icon
  const PesoIcon = () => <span className="text-green-400 font-bold text-xl">₱</span>;

  return (
    <div className="font-Poppins">
      <Navbar sticky={false} />

      <div className="pt-30 pb-4 px-4 w-full max-w-7xl mx-auto text-white">
        {/* Title */}
        <div className="flex flex-col items-center mb-12 mt-12 text-center space-y-6 w-full px-4">
          <h1 className="font-bold text-white text-center w-full"
              style={{ fontSize: "clamp(1.5rem, 5vw, 3rem)", lineHeight: "clamp(2rem, 6vw, 3.5rem)" }}>
            Top Recommended Programs
          </h1>

          {/* Sorting & Filtering */}
<div className="flex flex-wrap justify-center gap-3 mt-6 mb-12 text-white">
  {/* Main Filter Selector */}
  <select
    value={activeFilter}
    onChange={(e) => {
      setActiveFilter(e.target.value);
      setSubOption(""); // reset sub-option when main filter changes
    }}
    className="bg-white/10 border border-white/30 rounded-full px-4 py-2 backdrop-blur-md text-white"
  >
    <option value="">Select Filter / Sort</option>
    <option value="board">Board Passing Rate</option>
    <option value="tuition">Tuition Fee</option>
    <option value="school_type">School Type</option>
    <option value="location">Location</option>
    <option value="unirank">UniRank</option>
  </select>

  {/* Sub-options appear conditionally based on activeFilter */}
  {activeFilter === "board" && (
    <select
      value={subOption}
      onChange={(e) => setSubOption(e.target.value)}
      className="bg-white/10 border border-white/30 rounded-full px-4 py-2 backdrop-blur-md text-white"
    >
      <option value="">Select Board Rate</option>
      <option value="board_high">High → Low</option>
      <option value="board_low">Low → High</option>
    </select>
  )}

  {activeFilter === "tuition" && (
    <select
      value={subOption}
      onChange={(e) => setSubOption(e.target.value)}
      className="bg-white/10 border border-white/30 rounded-full px-4 py-2 backdrop-blur-md text-white"
    >
      <option value="">Select Tuition Range</option>
      <option value="0-3000">₱0 - ₱3,000</option>
      <option value="3000-5000">₱3,000 - ₱5,000</option>
      <option value="5000-8000">₱5,000 - ₱8,000</option>
      <option value="8000-12000">₱8,000 - ₱12,000</option>
      <option value="12000+">₱12,000+</option>
    </select>
  )}

  {activeFilter === "school_type" && (
    <select
      value={subOption}
      onChange={(e) => setSubOption(e.target.value)}
      className="bg-white/10 border border-white/30 rounded-full px-4 py-2 backdrop-blur-md text-white"
    >
      <option value="">Select School Type</option>
      <option value="public">Public</option>
      <option value="private">Private</option>
    </select>
  )}

  {activeFilter === "location" && (
    <select
      value={subOption}
      onChange={(e) => setSubOption(e.target.value)}
      className="bg-white/10 border border-white/30 rounded-full px-4 py-2 backdrop-blur-md text-white"
    >
      <option value="">Select Location</option>
      <option value="Angeles">Angeles</option>
      <option value="San Fernando">San Fernando</option>
      <option value="Mabalacat">Mabalacat</option>
      <option value="Other">Other</option>
    </select>
  )}

  {activeFilter === "unirank" && (
    <div className="text-white font-semibold px-4 py-2 bg-white/10 rounded-full">
      Sorted by UniRank
    </div>
  )}

  {/* Optional Clear Button */}
  {(activeFilter || subOption) && (
    <button
      onClick={() => {
        setActiveFilter("");
        setSubOption("");
      }}
      className="bg-red-600/50 hover:bg-red-600/70 text-white px-4 py-2 rounded-full"
    >
      Clear
    </button>
  )}
</div>

        </div>

        {/* Results */}
        <div className="space-y-6">
          {displayedResults.length === 0 && (
            <p className="text-center text-gray-500 mt-20">
              {message || "No results found."}
            </p>
          )}

          {displayedResults.map((item, index) => {
            const isExpanded = expandedIndex === index;
            const isSelected = selectedSchools.some(
              (school) => school.school === item.school && school.program === item.program
            );
            const schoolInfo = schoolStrengths[item.school] || {};
            const mapsQuery = schoolInfo.maps_query;
            const referenceLocation = pinnedLocation || userLocation;
            let distanceText = null;
            if (referenceLocation.lat && referenceLocation.lng && schoolInfo.coords?.lat) {
              const distance = getDistanceFromLatLonInKm(
                referenceLocation.lat, referenceLocation.lng,
                schoolInfo.coords.lat, schoolInfo.coords.lng
              );
              distanceText = `Approx. ${distance.toFixed(2)} km from your detected/pinned location to ${item.school}`;
            }
            const rank = index + 1;
            const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : "";
            const rankColor = "bg-[rgba(20,40,100,0.4)] backdrop-blur-lg border-[1.5px] border-[rgba(255,255,255,0.25)] shadow-lg";

            return (
              <div key={index}
                className={`rounded-2xl ${rankColor} backdrop-blur-md border shadow-md transition-all duration-300 cursor-pointer hover:shadow-xl p-6 w-full sm:w-[95%] md:w-[90%] lg:w-[85%] mx-auto ${isExpanded ? "scale-[1.02]" : ""}`}
                onClick={() => setExpandedIndex(isExpanded ? null : index)}
              >
                {/* Rank + Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-white font-bold text-lg">
                    <span className="text-2xl">{medal}</span>
                    <span>{rank <= 3 ? ["1st","2nd","3rd"][rank-1] : `${rank}th`} Place</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="flex items-center gap-4 mb-3 w-full px-1 sm:px-3">
                  {item.school_logo && (
                    <div className="flex items-center justify-center rounded-full bg-white overflow-hidden w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex-shrink-0">
                      <img src={item.school_logo} alt={`${item.school} logo`} className="object-contain w-full h-full" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0 text-left">
                    <h2 className="font-semibold text-[13px] sm:text-base md:text-lg text-white line-clamp-3">{item.program}</h2>
                    <p className="text-[12px] sm:text-sm md:text-base text-white opacity-90 line-clamp-2">{item.school}</p>
                  </div>

                  {/* Add / Compare Button */}
                  <button
                    className={`rounded-full font-medium transition !border !border-white/30 backdrop-blur-md !text-white shadow-md ${isSelected ? "!bg-red-600/40 hover:!bg-red-600/60" : "!bg-blue-600/30 hover:!bg-blue-600/50"} px-2 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm md:px-4 md:py-2 md:text-sm`}
                    onClick={(e) => { e.stopPropagation(); handleCheckboxChange(item); }}
                  >
                    <span className="block sm:hidden">{isSelected ? "−" : "+"}</span>
                    <span className="hidden sm:block">{isSelected ? "Remove" : "Compare"}</span>
                  </button>
                </div>



          


                
  {/* Expanded Section */}
{isExpanded && (
  <div
    className="mt-5 text-base animate-fade-in text-white"
    onClick={(e) => e.stopPropagation()}
  >

    {/* Dropdown Description with card styling */}
    <details className="group bg-white/10 p-3 rounded-2xl shadow-md backdrop-blur-md border border-white/20">
  <summary className="flex items-center justify-between cursor-pointer">
    <div className="flex items-center gap-2">
      {/* Changed icon */}
      <FileText className="w-6 h-6 text-indigo-400" />
      {/* Bold white with slightly smaller font */}
      <span className="text-white font-bold text-sm sm:text-base">
        Program Description
      </span>
    </div>
    <span className="ml-2 transform transition-transform group-open:rotate-180">
      ⌄
    </span>
  </summary>

  <p className="mt-3 text-sm leading-relaxed text-white/90">
    {item.description || "No description available."}
  </p>
</details>


   {/* Info Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
  {/* Location */}
  <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl shadow-md backdrop-blur-md border border-white/20">
    <MapPin className="w-6 h-6 text-red-400" />
    <div>
      <p className="text-xs uppercase tracking-wide opacity-70">Location</p>
      <p className="font-semibold">{item.location || "N/A"}</p>
    </div>
  </div>

  {/* Grade Requirements */}
  <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl shadow-md backdrop-blur-md border border-white/20">
    <BookOpen className="w-6 h-6 text-indigo-400" />
    <div>
      <p className="text-xs uppercase tracking-wide opacity-70">Grade Req.</p>
      <p className="font-semibold">{item.grade_requirements || "N/A"}</p>
    </div>
  </div>

  {/* School Type */}
  <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl shadow-md backdrop-blur-md border border-white/20">
    <Building2 className="w-6 h-6 text-blue-400" />
    <div>
      <p className="text-xs uppercase tracking-wide opacity-70">School Type</p>
      <p className="font-semibold">{item.school_type || "N/A"}</p>
    </div>
  </div>

  {/* Admission Requirements */}
  <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl shadow-md backdrop-blur-md border border-white/20">
    <FileText className="w-6 h-6 text-yellow-500" />
    <div>
      <p className="text-xs uppercase tracking-wide opacity-70">Admission Req.</p>
      <p className="font-semibold">{item.admission_requirements || "N/A"}</p>
    </div>
  </div>

  {/* Tuition / Sem */}
<div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl shadow-md backdrop-blur-md border border-white/20">
  <PesoIcon />
  <div>
    <p className="text-xs uppercase tracking-wide opacity-70">Tuition / Sem</p>
    <p className="font-semibold">
      {item.tuition_per_semester || "Free under gov’t-supported program"}
    </p>
  </div>
</div>

  {/* School Requirements */}
  <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl shadow-md backdrop-blur-md border border-white/20">
    <ListChecks className="w-6 h-6 text-teal-400" />
    <div>
      <p className="text-xs uppercase tracking-wide opacity-70">School Req.</p>
      <p className="font-semibold">{item.school_requirements || "N/A"}</p>
    </div>
  </div>

  {/* Tuition / Year */}
<div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl shadow-md backdrop-blur-md border border-white/20">
  <PesoIcon />
  <div>
    <p className="text-xs uppercase tracking-wide opacity-70">Tuition / Year</p>
    <p className="font-semibold">
      {item.tuition_annual || "Free under gov’t-supported program"}
    </p>
  </div>
</div>

  {/* Board Passing Rate */}
  <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl shadow-md backdrop-blur-md border border-white/20">
    <GraduationCap className="w-6 h-6 text-purple-400" />
    <div>
      <p className="text-xs uppercase tracking-wide opacity-70">Board Passing Rate</p>
      <p className="font-semibold">{item.board_passing_rate || "N/A"}</p>
    </div>
  </div>

  {/* Tuition Notes */}
<div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl shadow-md backdrop-blur-md border border-white/20">
  <AlertCircle className="w-8 h-8 text-yellow-400" />  {/* enlarged icon */}
  <div>
    <p className="text-xs uppercase tracking-wide opacity-70">Tuition Notes</p>
    <p className="font-semibold">{item.tuition_notes || "N/A"}</p>
  </div>
</div>


  {/* Website */}
  {item.school_website && (
    <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl shadow-md backdrop-blur-md border border-white/20">
      <LinkIcon className="w-6 h-6 text-blue-500" />
      <div>
        <p className="text-xs uppercase tracking-wide opacity-70">Website</p>
        <a
  href={item.school_website}
  className="font-extrabold underline text-[crimson] hover:text-[darkred]"
  target="_blank"
  rel="noopener noreferrer"
>
  Visit Site
</a>

      </div>
    </div>
  )}
</div>

    {/* Map + Distance Section */}
    {mapsQuery && (
      <div className="mt-6 space-y-4">
        {/* School Map */}
        <iframe
          src={`https://www.google.com/maps?q=${encodeURIComponent(
            mapsQuery
          )}&output=embed`}
          width="100%"
          height="300"
          className="rounded-xl border"
          loading="lazy"
          allowFullScreen
        ></iframe>

        {/* Location + Distance */}
<div className="flex flex-col gap-2">
  <div className="text-sm text-white">
    <span className="font-semibold">Your Detected Location:</span>{" "}
    {userCity ||
      (userLocation.lat && userLocation.lng
        ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`
        : "Not detected")}
  </div>
  {distanceText ? (
    <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl shadow-md backdrop-blur-md border border-white/20">
      <Ruler className="w-8 h-8 text-blue-300" /> {/* enlarged icon */}
      <div>
        <p className="text-xs uppercase tracking-wide opacity-70">Distance</p>
        <p className="font-semibold text-white">{distanceText}</p>
      </div>
    </div>
  ) : (
    <div className="text-sm italic text-white">
      📍 Distance not available. Enable or pin your location to see distance.
    </div>
  )}
</div>

       {/* Toggle Pin Map Button */}
<button
  className="!px-3.5 !py-2 !rounded-full !bg-blue-800/20 hover:!bg-blue-800/30 !text-white !backdrop-blur-md border-2 !border-white/40 text-xs font-Poppins font-medium !shadow-md transition duration-300 ease-in-out"
  onClick={(e) => {
    e.stopPropagation();
    setShowPinMap(true);
  }}
>
  Location not accurate? Pin manually
</button>

{/* Modal for Pinning Map */}
{showPinMap && (
  <div
    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end justify-center z-50"
    onClick={() => setShowPinMap(false)} // closes when clicking background
  >
    <div
      className="bg-blue-800/30 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg w-full max-w-2xl p-5 relative mb-6 text-white"
      onClick={(e) => e.stopPropagation()} // prevents closing when clicking inside modal
    >
      {/* Close Button */}
      <button
        className="absolute top-3 right-3 text-red-600 hover:text-red-800 transition duration-200 bg-transparent border-none outline-none shadow-none p-0 m-0"
        style={{ background: "transparent" }}
        onClick={() => setShowPinMap(false)}
      >
        <X size={20} strokeWidth={2.5} />
      </button>

      <h2 className="text-lg font-semibold mb-3">📍 Pin Your Location</h2>

      {/* Map */}
      <MapContainer
        center={[
          pinnedLocation?.lat || userLocation.lat || 15.0305,
          pinnedLocation?.lng || userLocation.lng || 120.6845,
        ]}
        zoom={12}
        style={{ height: "300px", width: "100%", borderRadius: "12px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        <LocationMarker setPinnedLocation={setPinnedLocation} />
      </MapContainer>

      {/* Pinned Location Text */}
      {pinnedLocation && (
        <div className="mt-3 text-sm opacity-90">
          📌 Pinned at {pinnedLocation.lat.toFixed(5)},{" "}
          {pinnedLocation.lng.toFixed(5)}
        </div>
      )}

      {/* Save Button */}
      <div className="text-right mt-5">
        <button
          className="!px-4 !py-2 !rounded-full !bg-blue-800/20 hover:!bg-blue-800/30 !backdrop-blur-md !border !border-white/30 !text-white text-sm font-Poppins font-medium !shadow-md transition duration-300 ease-in-out"
          style={{
            WebkitBackdropFilter: "blur(10px)",
            backdropFilter: "blur(10px)",
          }}
          onClick={() => setShowPinMap(false)}
        >
          Okay
        </button>
      </div>
    </div>
  </div>
)}

 
      </div>
    )}
  </div>
)}

              </div>
            );
          })}
          
          {/* Centered Buttons Container */}
<div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8 px-4">
  {/* Try Again Button */}
  <button
    onClick={() => navigate("/unifinder")}
    className="flex items-center justify-center gap-2 text-white text-xs sm:text-sm font-Poppins font-medium 
               !px-8 !py-3 sm:!px-8 sm:!py-3 !rounded-full !bg-blue-800/20 !backdrop-blur-md 
               !border !border-white/30 !shadow-lg hover:!bg-blue-800/30 transition duration-300 ease-in-out 
               w-full sm:w-auto"
    style={{
      WebkitBackdropFilter: "blur(10px)",
      backdropFilter: "blur(10px)",
    }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
    <span>Try Again</span>
  </button>

  {/* Compare Button (only shows if 2 or more selected) */}
  {selectedSchools.length >= 2 && (
    <button
      className="flex items-center justify-center text-white text-xs sm:text-sm font-Poppins font-medium 
                 !px-8 !py-3 sm:!px-8 sm:!py-3 !rounded-full !bg-blue-800/20 !backdrop-blur-md 
                 !border !border-white/30 !shadow-lg hover:!bg-blue-800/30 transition duration-300 ease-in-out 
                 w-full sm:w-auto"
      style={{
        WebkitBackdropFilter: "blur(10px)",
        backdropFilter: "blur(10px)",
      }}
      onClick={() => navigate("/compare-program", { state: { selectedSchools } })}
    >
      Compare Now ({selectedSchools.length})
    </button>
  )}
</div>

            
          
        </div>
      </div>
    </div>
  );
}

ResultsSection.propTypes = {
  results: PropTypes.array.isRequired,
  message: PropTypes.string
};

export default ResultsSection;
