import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../components/Navbar";
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
      <div className="min-h-screen bg-gradient-to-br from-[#020617] to-[#0a0f1f] pt-20 px-4 text-white font-Poppins">
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
    { label: "Program", key: "program", icon: <BookOpen className="w-5 h-5 inline mr-1 text-sky-400" /> },
    { label: "Category", key: "category", icon: <ListChecks className="w-5 h-5 inline mr-1 text-sky-400" /> },
    { label: "Type", key: "school_type", icon: <Building2 className="w-5 h-5 inline mr-1 text-sky-400" /> },
    { label: "Location", key: "location", icon: <MapPin className="w-5 h-5 inline mr-1 text-sky-400" /> },
    { label: "Admission Requirements", key: "admission_requirements", icon: <FileText className="w-5 h-5 inline mr-1 text-sky-400" /> },
    { label: "Grade Requirements", key: "grade_requirements", icon: <ListChecks className="w-5 h-5 inline mr-1 text-sky-400" /> },
    { label: "Other Requirements", key: "school_requirements", icon: <FileText className="w-5 h-5 inline mr-1 text-sky-400" /> },
    { label: "Tuition / Semester", key: "tuition_per_semester", icon: <DollarSign className="w-5 h-5 inline mr-1 text-sky-400" /> },
    { label: "Tuition / Year", key: "tuition_annual", icon: <DollarSign className="w-5 h-5 inline mr-1 text-sky-400" /> },
    { label: "Tuition Notes", key: "tuition_notes", icon: <FileText className="w-5 h-5 inline mr-1 text-sky-400" /> },
    { label: "Board Passing Rate", key: "board_passing_rate", icon: <GraduationCap className="w-5 h-5 inline mr-1 text-sky-400" /> },
    { label: "Website", key: "school_website", icon: <Globe className="w-5 h-5 inline mr-1 text-sky-400" />, isLink: true },
  ];

  const softGradients = [
    "from-[#1e3a8a]/40 via-[#3b82f6]/20 to-[#93c5fd]/10", // soft blue
    "from-[#6d28d9]/30 via-[#8b5cf6]/20 to-[#c4b5fd]/10", // violet
    "from-[#3730a3]/30 via-[#6366f1]/20 to-[#a5b4fc]/10", // indigo

    "from-[#064e3b]/30 via-[#10b981]/20 to-[#6ee7b7]/10", // jade green
    "from-[#92400e]/30 via-[#f59e0b]/20 to-[#fcd34d]/10", // amber
    "from-[#7c2d12]/30 via-[#ea580c]/20 to-[#fdba74]/10", // warm orange
    "from-[#1e293b]/30 via-[#334155]/20 to-[#64748b]/10", // gray-blue
  ];

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#0a0f2e] via-[#0d1a45] to-[#102a5c] pt-20 px-2 sm:px-4 text-white pb-24 font-Poppins">
      <Navbar />

      {/* School Cards Grid */}
      <div
        className="mt-16 grid gap-4 sm:gap-6"
        style={{
          gridTemplateColumns:
            normalizedSchools.length === 1
              ? "1fr"
              : normalizedSchools.length === 2
              ? "repeat(auto-fit, minmax(260px, 1fr))"
              : "repeat(auto-fit, minmax(280px, 1fr))",
        }}
      >
        {normalizedSchools.map((s, idx) => (
          <div
            key={idx}
            className={`bg-gradient-to-br ${softGradients[idx % softGradients.length]} border border-white/30 rounded-2xl p-5 shadow-lg hover:shadow-xl transition backdrop-blur-md`}
            style={{
              WebkitBackdropFilter: "blur(12px)",
              backdropFilter: "blur(12px)",
            }}
          >
            {/* School Header */}
            <div className="flex flex-col items-center mb-5">
              {hasValue(s.school_logo) && (
                <img
                  src={s.school_logo}
                  alt={s.school}
                  className="w-14 h-14 sm:w-16 sm:h-16 object-contain rounded-full mb-3 bg-white p-1"
                />
              )}
              <h2 className="font-semibold text-gray-100 text-center text-sm sm:text-base break-words font-Poppins">
                {s.school}
              </h2>
            </div>

            {/* Features */}
            <div className="flex flex-col gap-3">
              {rows.map((row, rIdx) => (
                <div
                  key={rIdx}
                  className="bg-white/10 rounded-lg p-3 flex flex-col text-left hover:bg-white/20 transition"
                >
                  <h3 className="font-medium text-gray-200 flex items-center gap-1 mb-1 text-sm font-Poppins">
                    {row.icon} {row.label}
                  </h3>
                  {row.isLink && hasValue(s[row.key]) ? (
                    <a
                      href={s[row.key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-300 underline text-xs sm:text-sm hover:text-blue-100 break-all font-Poppins"
                    >
                      {new URL(s[row.key]).hostname.replace("www.", "")}
                    </a>
                  ) : (
                    <span className="text-gray-300 text-xs sm:text-sm break-words font-Poppins">
                      {renderValue(s[row.key])}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Buttons */}
      <div className="mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center flex-wrap">
        <button
          onClick={() => navigate("/results")}
          className="!px-5 !py-2.5 sm:!px-8 sm:!py-3 !rounded-full !bg-blue-800/20 !backdrop-blur-md !border !border-white/30 !text-white text-xs sm:text-sm font-Poppins font-medium !shadow-lg hover:!bg-blue-800/30 transition duration-300 ease-in-out w-full sm:w-auto"
          style={{ WebkitBackdropFilter: "blur(10px)", backdropFilter: "blur(10px)" }}
        >
          Back to Results
        </button>

        <button
          onClick={() => navigate("/Compare", { state: { selectedSchools } })}
          className="!px-5 !py-2.5 sm:!px-8 sm:!py-3 !rounded-full !bg-blue-800/20 !backdrop-blur-md !border !border-white/30 !text-white text-xs sm:text-sm font-Poppins font-medium !shadow-lg hover:!bg-blue-800/30 transition duration-300 ease-in-out w-full sm:w-auto"
          style={{ WebkitBackdropFilter: "blur(10px)", backdropFilter: "blur(10px)" }}
        >
          Schools Strength
        </button>
      </div>
    </div>
  );
}
