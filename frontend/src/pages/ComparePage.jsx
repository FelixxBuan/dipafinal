import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";


function normalize(str) {
  return str.toLowerCase().replace(/\s+/g, " ").trim();
}

function findSchoolData(schoolName, schoolsArray) {
  const normalizedName = normalize(schoolName);
  return (
    schoolsArray.find(
      (school) => normalize(school.name) === normalizedName
    ) || null
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
    { label: "Address", key: "address" },
    { label: "Known For", key: "what_theyre_known_for" },
    {
      label: "Institutional Strengths",
      key: "institutional_strengths",
      format: (v) => (v?.length ? v.join(", ") : "No data available"),
    },
    {
      label: "Central Luzon Rank",
      key: "unirank",
      format: (v) =>
        v?.central_luzon_rank
          ? `#${v.central_luzon_rank} Central Luzon`
          : v?.country_rank && v?.world_rank
          ? `#${v.country_rank} PH / #${v.world_rank} Global`
          : "No ranking available",
    },
    { label: "Dorm / Apartment", key: "dorm_apartment" },
    { label: "Transport Access", key: "transport_access" },
    {
      label: "Scholarships Offered",
      key: "scholarships_offered",
      format: (v) => (v?.length ? v.join(", ") : "No scholarships listed"),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 overflow-x-auto">
      <h1 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
        🎓 School Comparison
      </h1>

      {selectedSchools.length === 0 ? (
        <p className="text-center text-gray-500">
          No schools selected. Please return and choose at least two.
        </p>
      ) : (
        <table className="min-w-full border border-gray-200 rounded-lg bg-white">
          <thead>
            <tr>
              <th className="p-4 border-b border-gray-200 bg-gray-100 text-left text-gray-600 font-medium">
                Specification
              </th>
              {selectedSchools.map((school, i) => {
                const data = findSchoolData(school.school, schoolsData);
                return (
                  <th
                    key={i}
                    className="p-4 border-b border-gray-200 text-center text-gray-800 font-medium"
                  >
                    <div className="flex flex-col items-center">
                      {data?.logo && (
                        <img
                          src={`/logos/${data.logo}`}
                          alt={school.school}
                          className="w-12 h-12 object-contain mb-2"
                        />
                      )}
                      <span>{school.school}</span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {specs.map((spec, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition">
                <td className="p-4 border-t border-gray-200 text-gray-700 font-medium">
                  {spec.label}
                </td>
                {selectedSchools.map((school, i) => {
                  const data = findSchoolData(school.school, schoolsData);

                  let value;
                  if (spec.key === "program") {
                    value = school.program || "No data available";
                  } else {
                    value = spec.format
                      ? spec.format(data?.[spec.key])
                      : data?.[spec.key] || "No data available";
                  }

                  return (
                    <td
                      key={i}
                      className="p-4 border-t border-gray-200 text-gray-600 text-center"
                    >
                      {value}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
