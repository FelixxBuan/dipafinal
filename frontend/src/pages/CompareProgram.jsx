import { useLocation, useNavigate } from "react-router-dom";

export default function CompareProgram() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedSchools = location.state?.selectedSchools || [];

  if (!selectedSchools.length) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>No schools selected for comparison.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Compare Programs</h1>

      <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-200">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="p-3 text-left text-sm font-semibold text-gray-700">Field</th>
              {selectedSchools.map((school, idx) => (
                <th key={idx} className="p-3 text-center text-sm font-semibold text-gray-700">
                  {school.school_logo && (
                    <div className="mb-2 flex justify-center">
                      <img
                        src={school.school_logo}
                        alt={school.school}
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                  )}
                  {school.school}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { key: "program", label: "Program Name" },
              { key: "category", label: "Category" },
              { key: "school_type", label: "School Type" },
              { key: "location", label: "Location" },
              { key: "admission_requirements", label: "Admission Requirements" },
              { key: "grade_requirements", label: "Grade Requirements" },
              { key: "school_requirements", label: "School Requirements" },
              { key: "tuition_per_semester", label: "Tuition Fee" },
              { key: "tuition_annual", label: "Tuition (Annual)" },
              { key: "tuition_notes", label: "Tuition Notes" },
              { key: "board_passing_rate", label: "Board Passing Rate" },
              { key: "school_website", label: "School Website for more information" }
            ].map((field) => (
              <tr
                key={field.key}
                className="border-b border-gray-100 hover:bg-gray-50 transition"
              >
                <td className="p-3 text-sm font-medium text-gray-600">{field.label}</td>
                {selectedSchools.map((school, idx) => (
                  <td
                    key={idx}
                    className="p-3 text-sm text-gray-800 text-center"
                  >
                    {field.key === "school_website" && school[field.key] ? (
                      <a
                        href={school[field.key]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        Visit
                      </a>
                    ) : (
                      school[field.key] || "N/A"
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex gap-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg shadow"
        >
          Back to Results
        </button>
        <button
          onClick={() => navigate("/Compare", { state: { selectedSchools } })
}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
        >
          Compare Schools
        </button>
      </div>
    </div>
  );
}
