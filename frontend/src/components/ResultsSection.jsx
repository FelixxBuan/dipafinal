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

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
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
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [selectedSchools, setSelectedSchools] = useState([]);
  const [userLocation, setUserLocation] = useState({ lat: null, lng: null });
  const [userCity, setUserCity] = useState(null);
  const [schoolStrengths, setSchoolStrengths] = useState({});
  const [pinnedLocation, setPinnedLocation] = useState(null);
  const [showPinMap, setShowPinMap] = useState(false); // toggled per active card
  const navigate = useNavigate();
  

  // Reset the pin map toggle when switching expanded cards
  useEffect(() => {
    setShowPinMap(false);
  }, [expandedIndex]);

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
            .catch((error) => console.error("Reverse geocoding error:", error));
        },
        (error) => {
          console.error("Geolocation error:", error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    }
  }, []);

  useEffect(() => {
    fetch("http://localhost:8000/api/school-strengths")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const dataObject = {};
        (data.schools || []).forEach((school) => {
          dataObject[school.name] = school;
        });
        setSchoolStrengths(dataObject);
      })
      .catch((error) => {
        console.error("Error fetching school strengths:", error);
        setSchoolStrengths({});
      });
  }, []);

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

  if (!results || results.length === 0) {
    return (
      <div>
        <Navbar />
        <p className="text-center text-gray-500 mt-20">
          {message || "No results found."}
        </p>
      </div>
    );
  }

  return (
    <div className="font-Poppins">
      {/* Navbar at the top */}
      <Navbar sticky={false} />

      {/* Outer container */}
      <div className="pt-12 pb-4 px-4 w-full max-w-7xl mx-auto text-white">



        {/* Title & Note */}
        <div className="flex flex-col items-center mb-8 text-center space-y-3">
          <h1 className="text-2xl md:text-3xl font-bold font-Merriweather text-white tracking-wide">
            Top 10 Recommended Programs
          </h1>

          <div className="bg-white/10 backdrop-blur-md rounded-lg px-5 py-3 shadow-md max-w-4xl flex items-start">
            <svg
              className="w-5 h-5 text-blue-300 mt-[2px] mr-2 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-white/90 leading-snug font-medium">
              These recommendations are generated based on your stated
              interests. While we aim to guide you toward relevant options,
              the final choice is yours to make. We encourage exploring
              further before deciding.
            </p>
          </div>
        </div>

        {/* Main Results Section */}
        <div className="space-y-6">
          {message && (
            <p className="text-center font-medium text-sm mb-4">{message}</p>
          )}

          {results.map((item, index) => {
            const isExpanded = expandedIndex === index;
            const isSelected = selectedSchools.some(
              (school) => school.school === item.school && school.program === item.program
            );

            const schoolInfo = schoolStrengths[item.school] || {};
            const mapsQuery = schoolInfo.maps_query;

            const referenceLocation = pinnedLocation || userLocation;

            let distanceText = null;
if (
  referenceLocation.lat &&
  referenceLocation.lng &&
  schoolInfo?.coords?.lat &&
  schoolInfo?.coords?.lng
) {
  const distance = getDistanceFromLatLonInKm(
    referenceLocation.lat,
    referenceLocation.lng,
    schoolInfo.coords.lat,
    schoolInfo.coords.lng
  );

  distanceText = `Approx. ${distance.toFixed(2)} km from your detected/pinned location to ${item.school}`;
}

const PesoIcon = () => (
  <span className="text-green-400 font-bold text-xl">₱</span>
)



            return (
              <div
                key={index}
                className={`rounded-2xl bg-blue-800/20 backdrop-blur-md border border-white shadow-md transition-all duration-300 cursor-pointer hover:shadow-xl p-6 w-[95%] md:w-[90%] lg:w-[85%] mx-auto ${
    isExpanded ? "bg-blue-800/40" : ""
  }`}
                onClick={() => setExpandedIndex(isExpanded ? null : index)}
              >
                {/* Card Header */}
                <div className="flex items-center gap-4 mb-3">
                  {item.school_logo && (
                    <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white overflow-visible relative">
  <img
    src={item.school_logo}
    alt={`${item.school} logo`}
    className="w-20 h-20 object-contain absolute"
  />
</div>

                  )}
                  <div className="flex-1">
                    <h2 className="font-semibold text-xl text-white">{item.program}</h2>
                    <p className="text-white text-base leading-relaxed">{item.school}</p>
                  </div>

                 <button
  className={`!px-2.5 !py-1.5 !rounded-full ${
    isSelected
      ? "!bg-red-600/40 hover:!bg-red-600/60"
      : "!bg-blue-800/20 hover:!bg-blue-800/30"
  } !backdrop-blur-md !border !border-white/30 !text-white text-xs font-Poppins font-medium !shadow-md transition duration-300 ease-in-out`}
  style={{ WebkitBackdropFilter: "blur(10px)", backdropFilter: "blur(10px)" }}
  onClick={(e) => {
    e.stopPropagation();
    handleCheckboxChange(item);
  }}
>
  {isSelected ? "Remove" : "Add to Compare"}
</button>



                </div>

                

                
                {/* Expanded Section */}
{isExpanded && (
  <div
    className="mt-5 text-base animate-fade-in text-white"
    onClick={(e) => e.stopPropagation()}
  >
    {/* Description */}
    <p className="text-sm leading-relaxed">{item.description}</p>
    <p className="text-xs text-right mt-2 italic opacity-80">
      ⭐ Score: {item.score}
    </p>

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

          {/* Compare Button */}
          {selectedSchools.length >= 2 && (
            <div className="text-center mt-6">
              <button
                className="!px-8 !py-3 !rounded-full !bg-blue-800/20 !backdrop-blur-md !border !border-white/30 !text-white text-sm font-Poppins font-medium !shadow-lg hover:!bg-blue-800/30 transition duration-300 ease-in-out"
                style={{ WebkitBackdropFilter: "blur(10px)", backdropFilter: "blur(10px)" }}
                onClick={() => navigate("/compare-program", { state: { selectedSchools } })}
              >
                Compare Now ({selectedSchools.length})
              </button>
            </div>
          )}
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
