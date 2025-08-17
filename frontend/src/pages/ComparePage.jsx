import { useLocation } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import {
  MapPin,
  Star,
  ListChecks,
  Award,
  Home,
  Bus,
  GraduationCap,
} from "lucide-react";
import Navbar from "../components/navbar";

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
  const selectedSchools = location.state?.selectedSchools || [];
  const [schoolsData, setSchoolsData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/school-strengths")
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
      <h1 className="text-2xl font-semibold text-white mb-8 text-center">
        🎓 School Comparison
      </h1>

      {selectedSchools.length === 0 ? (
        <p className="text-center text-gray-400">
          No schools selected. Please return and choose at least two.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
          {selectedSchools.map((school, i) => {
            const data = findSchoolData(school.school, schoolsData);

            return (
              <div
                key={i}
                className="bg-blue-800/20 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition"
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
                <h2 className="text-xl font-bold text-center mb-4">
                  {school.school}
                </h2>

                {/* Specs */}
                <div className="space-y-2">
                  {specs.map((spec, idx) => {
                    const Icon = spec.icon;
                    const value = spec.format
                      ? spec.format(data?.[spec.key])
                      : data?.[spec.key] || "No data available";

                    return (
                      <p
                        key={idx}
                        className="flex items-center text-sm text-gray-200"
                      >
                        <Icon className="w-4 h-4 mr-2 text-blue-300" />
                        <span className="font-medium">{spec.label}:</span>
                        <span className="ml-1">{value}</span>
                      </p>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
