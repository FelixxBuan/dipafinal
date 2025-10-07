import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  MapPin,
  Star,
  ListChecks,
  Award,
  Home,
  Bus,
  GraduationCap,
  ArrowLeft,
} from "lucide-react";
import Navbar from "../components/Navbar";

function normalize(str) {
  return str.toLowerCase().replace(/\s+/g, " ").trim();
}

function findSchoolData(schoolName, schoolsArray) {
  const normalizedName = normalize(schoolName);
  return (
    schoolsArray.find((school) => normalize(school.name) === normalizedName) ||
    null
  );
}

export default function ComparePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedSchools = location.state?.selectedSchools || [];
  const [schoolsData, setSchoolsData] = useState([]);

  // ✅ Remove duplicates (case-insensitive, normalized)
  const uniqueSchools = Array.from(
    new Map(
      selectedSchools.map((school) => [normalize(school.school), school])
    ).values()
  );

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/school-strengths`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => setSchoolsData(data.schools || []))
      .catch((error) => {
        console.error("Error fetching school strengths:", error);
        setSchoolsData([]);
      });
  }, []);

  const specs = [
    { label: "Address", key: "address", icon: MapPin },
    { label: "Known For", key: "what_theyre_known_for", icon: Star },
    {
      label: "Institutional Strengths",
      key: "institutional_strengths",
      icon: ListChecks,
      format: (v) => (v?.length ? v.join(", ") : "No data available"),
    },
    {
      label: "Central Luzon Rank",
      key: "unirank",
      icon: Award,
      format: (v) =>
        v?.central_luzon_rank
          ? `#${v.central_luzon_rank} Central Luzon`
          : v?.country_rank && v?.world_rank
          ? `#${v.country_rank} PH / #${v.world_rank} Global`
          : "No ranking available",
    },
    { label: "Dorm / Apartment", key: "dorm_apartment", icon: Home },
    { label: "Transport Access", key: "transport_access", icon: Bus },
    {
      label: "Scholarships Offered",
      key: "scholarships_offered",
      icon: GraduationCap,
      format: (v) => (v?.length ? v.join(", ") : "No scholarships listed"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] to-[#0a0f1f] pt-20 px-4 text-white pb-24">
      <Navbar />

      {uniqueSchools.length === 0 ? (
        <p className="text-center text-gray-400 font-Poppins">
          No schools selected. Please return and choose at least two.
        </p>
      ) : (
        <div>
          {/* Grid of Schools */}
          <div
            className={`mt-8 grid gap-6 justify-center ${
              uniqueSchools.length === 1
                ? "grid-cols-1 max-w-md mx-auto"
                : uniqueSchools.length === 2
                ? "grid-cols-1 sm:grid-cols-2 max-w-6xl mx-auto"
                : "md:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {uniqueSchools.map((school, i) => {
              const data = findSchoolData(school.school, schoolsData);

              return (
                <div
                  key={i}
                  className={`bg-blue-800/20 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition ${
                    uniqueSchools.length === 2 ? "w-full" : ""
                  }`}
                >
                  {/* Logo */}
                  {data?.logo && (
                    <div className="flex justify-center mb-4">
                      <div className="bg-white p-2 rounded-full">
                        <img
                          src={`/logos/${data.logo}`}
                          alt={school.school}
                          className="w-16 h-16 object-contain"
                        />
                      </div>
                    </div>
                  )}

                  {/* School Name */}
                  <h2 className="text-xl font-bold text-center mb-4 font-Merriweather">
                    {school.school}
                  </h2>

                  {/* Specs */}
                  <ul className="divide-y divide-white/10 mt-4">
                    {specs.map((spec, idx) => {
                      const Icon = spec.icon;
                      const value = spec.format
                        ? spec.format(data?.[spec.key])
                        : data?.[spec.key] || "No data available";

                      return (
                        <li
                          key={idx}
                          className="flex items-start gap-3 py-2 text-sm text-gray-200 font-Poppins"
                        >
                          <Icon className="w-5 h-5 mt-0.5 text-blue-300 shrink-0" />
                          <div>
                            <p className="font-medium text-white font-Merriweather">
                              {spec.label}
                            </p>
                            <p className="text-gray-400 font-Poppins">
                              {value}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Back Button */}
          <div className="mt-10 flex justify-center">
            <button
              onClick={() =>
                navigate("/compare-program", { state: { selectedSchools } })
              }
              className="!px-8 !py-3 !rounded-full !bg-blue-800/20 !backdrop-blur-md !border !border-white/30 !text-white text-sm font-Poppins font-medium !shadow-lg hover:!bg-blue-800/30 transition duration-300 ease-in-out flex items-center"
              style={{
                WebkitBackdropFilter: "blur(10px)",
                backdropFilter: "blur(10px)",
              }}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
