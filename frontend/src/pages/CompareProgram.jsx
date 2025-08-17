import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../components/navbar";
import {
  GraduationCap,
  BookOpen,
  Building2,
  MapPin,
  ListChecks,
  FileText,
  DollarSign,
  Globe,
} from "lucide-react";

/** Helpers */
const hasValue = (v) => {
  if (v === 0) return true;
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === "string") return v.trim().length > 0;
  return v !== null && v !== undefined;
};

const valueOf = (obj, aliases) => {
  for (const key of aliases) {
    if (Object.prototype.hasOwnProperty.call(obj ?? {}, key)) {
      const v = obj[key];
      if (hasValue(v)) return v;
      return v;
    }
  }
  return null;
};

const renderValue = (v) => {
  if (!hasValue(v)) return "N/A";
  if (Array.isArray(v)) return v.join(", ");
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
};

/** Normalize fields */
const normalizeSchool = (school) => {
  const n = {};
  n.school = valueOf(school, ["school", "school_name", "name"]);
  n.school_logo = valueOf(school, ["school_logo", "logo", "image"]);
  n.program = valueOf(school, ["program", "course", "degree"]);
  n.category = valueOf(school, ["category", "field", "discipline"]);
  n.school_type = valueOf(school, ["school_type", "type"]);
  n.location = valueOf(school, ["location", "city", "address"]);
  n.admission_requirements = valueOf(school, ["admission_requirements", "admission"]);
  n.grade_requirements = valueOf(school, ["grade_requirements", "gwa_requirement"]);
  n.school_requirements = valueOf(school, ["school_requirements", "other_requirements"]);
  n.tuition_per_semester = valueOf(school, ["tuition_per_semester", "tuition_semester"]);
  n.tuition_annual = valueOf(school, ["tuition_annual", "annual_tuition"]);
  n.tuition_notes = valueOf(school, ["tuition_notes", "notes"]);
  n.board_passing_rate = valueOf(school, ["board_passing_rate", "passing_rate"]);
  n.school_website = valueOf(school, ["school_website", "website"]);
  return n;
};

export default function CompareProgram() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedSchools = location.state?.selectedSchools || [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!selectedSchools.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#020617] to-[#0a0f1f] pt-20 px-4 text-white">
        <Navbar />
        <div className="p-8 text-center text-white">
          <p>No schools selected for comparison.</p>
          <button
            onClick={() => navigate(-1)}
            className="!px-8 !py-3 !rounded-full !bg-blue-800/20 !backdrop-blur-md !border !border-white/30 !text-white text-sm font-Poppins font-medium !shadow-lg hover:!bg-blue-800/30 transition duration-300 ease-in-out"
            style={{ WebkitBackdropFilter: "blur(10px)", backdropFilter: "blur(10px)" }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const normalizedSchools = selectedSchools.map((s) => normalizeSchool(s));

  const rows = [
  { label: "Program", key: "program", icon: <BookOpen className="w-4 h-4 inline mr-1 text-green-400" /> },
  { label: "Category", key: "category", icon: <ListChecks className="w-4 h-4 inline mr-1 text-purple-400" /> },
  { label: "Type", key: "school_type", icon: <Building2 className="w-4 h-4 inline mr-1 text-orange-400" /> },
  { label: "Location", key: "location", icon: <MapPin className="w-4 h-4 inline mr-1 text-red-400" /> },
  { label: "Admission Requirements", key: "admission_requirements", icon: <FileText className="w-4 h-4 inline mr-1 text-teal-400" /> },
  { label: "Grade Requirements", key: "grade_requirements", icon: <ListChecks className="w-4 h-4 inline mr-1 text-pink-400" /> },
  { label: "Other Requirements", key: "school_requirements", icon: <FileText className="w-4 h-4 inline mr-1 text-yellow-400" /> },
  { label: "Tuition / Semester", key: "tuition_per_semester", icon: <DollarSign className="w-4 h-4 inline mr-1 text-emerald-400" /> },
  { label: "Tuition / Year", key: "tuition_annual", icon: <DollarSign className="w-4 h-4 inline mr-1 text-lime-400" /> },
  { label: "Tuition Notes", key: "tuition_notes", icon: <FileText className="w-4 h-4 inline mr-1 text-sky-400" /> },
  { label: "Board Passing Rate", key: "board_passing_rate", icon: <GraduationCap className="w-4 h-4 inline mr-1 text-indigo-400" /> },
  { label: "Website", key: "school_website", icon: <Globe className="w-4 h-4 inline mr-1 text-cyan-400" />, isLink: true },
];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] to-[#0a0f1f] pt-20 px-4 text-white pb-24">
      <Navbar />

      <div className="overflow-x-auto mt-8">
        <table className="min-w-full border border-white/20 text-sm text-center">
          <thead>
            <tr>
              {normalizedSchools.map((s, idx) => (
                <th key={idx} className="p-4 border border-white/20 bg-blue-900/40">
                  {hasValue(s.school_logo) && (
                    <img
                      src={s.school_logo}
                      alt={s.school}
                      className="w-16 h-16 mx-auto object-contain rounded-full bg-white p-1 mb-2"
                    />
                  )}
                  <div className="font-bold">{renderValue(s.school)}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-blue-800/10">
                {normalizedSchools.map((s, cIdx) => (
                  <td key={cIdx} className="p-3 border border-white/20">
                    {row.isLink && hasValue(s[row.key]) ? (
                      <a
                        href={s[row.key]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-300 underline hover:text-blue-100"
                      >
                        Visit
                      </a>
                    ) : (
                      <>
                        {row.icon} {renderValue(s[row.key])}
                      </>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom Buttons */}
      <div className="mt-10 flex gap-4 justify-center">
        <button
          onClick={() => navigate(-1)}
          className="!px-8 !py-3 !rounded-full !bg-blue-800/20 !backdrop-blur-md !border !border-white/30 !text-white text-sm font-Poppins font-medium !shadow-lg hover:!bg-blue-800/30 transition duration-300 ease-in-out"
          style={{ WebkitBackdropFilter: "blur(10px)", backdropFilter: "blur(10px)" }}
        >
          Back to Results
        </button>
        <button
          onClick={() => navigate("/Compare", { state: { selectedSchools } })}
          className="!px-8 !py-3 !rounded-full !bg-blue-800/20 !backdrop-blur-md !border !border-white/30 !text-white text-sm font-Poppins font-medium !shadow-lg hover:!bg-blue-800/30 transition duration-300 ease-in-out"
          style={{ WebkitBackdropFilter: "blur(10px)", backdropFilter: "blur(10px)" }}
        >
          Compare Schools
        </button>
      </div>
    </div>
  );
}
