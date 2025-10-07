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
  n.admission_requirements = valueOf(school, [
    "admission_requirements",
    "admission",
  ]);
  n.grade_requirements = valueOf(school, [
    "grade_requirements",
    "gwa_requirement",
  ]);
  n.school_requirements = valueOf(school, [
    "school_requirements",
    "other_requirements",
  ]);
  n.tuition_per_semester = valueOf(school, [
    "tuition_per_semester",
    "tuition_semester",
  ]);
  n.tuition_annual = valueOf(school, ["tuition_annual", "annual_tuition"]);
  n.tuition_notes = valueOf(school, ["tuition_notes", "notes"]);
  n.board_passing_rate = valueOf(school, [
    "board_passing_rate",
    "passing_rate",
  ]);
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
      <div
        className="min-h-screen bg-cover bg-center text-white font-Poppins"
        style={{ backgroundImage: "url('/images/bg-home3.jpg')" }}
      >
        <Navbar />
        <div className="p-6 sm:p-8 text-center pt-24 font-Poppins">
          <p className="text-sm sm:text-base">
            No schools selected for comparison.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 !px-6 sm:!px-8 !py-2.5 sm:!py-3 !rounded-full !bg-blue-800/30 !backdrop-blur-md !border !border-white/30 !text-white text-xs sm:text-sm font-medium !shadow-lg hover:!bg-blue-800/40 transition duration-300 ease-in-out"
            style={{
              WebkitBackdropFilter: "blur(10px)",
              backdropFilter: "blur(10px)",
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const normalizedSchools = selectedSchools.map((s) => normalizeSchool(s));

  const rows = [
    {
      label: "Program",
      key: "program",
      icon: (
        <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1 text-sky-400" />
      ),
    },
    {
      label: "Category",
      key: "category",
      icon: (
        <ListChecks className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1 text-sky-400" />
      ),
    },
    {
      label: "Type",
      key: "school_type",
      icon: (
        <Building2 className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1 text-sky-400" />
      ),
    },
    {
      label: "Location",
      key: "location",
      icon: (
        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1 text-sky-400" />
      ),
    },
    {
      label: "Admission Requirements",
      key: "admission_requirements",
      icon: (
        <FileText className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1 text-sky-400" />
      ),
    },
    {
      label: "Grade Requirements",
      key: "grade_requirements",
      icon: (
        <ListChecks className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1 text-sky-400" />
      ),
    },
    {
      label: "Other Requirements",
      key: "school_requirements",
      icon: (
        <FileText className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1 text-sky-400" />
      ),
    },
    {
      label: "Tuition / Semester",
      key: "tuition_per_semester",
      icon: (
        <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1 text-sky-400" />
      ),
    },
    {
      label: "Tuition / Year",
      key: "tuition_annual",
      icon: (
        <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1 text-sky-400" />
      ),
    },
    {
      label: "Tuition Notes",
      key: "tuition_notes",
      icon: (
        <FileText className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1 text-sky-400" />
      ),
    },
    {
      label: "Board Passing Rate",
      key: "board_passing_rate",
      icon: (
        <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1 text-sky-400" />
      ),
    },
    {
      label: "Website",
      key: "school_website",
      icon: (
        <Globe className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1 text-sky-400" />
      ),
      isLink: true,
    },
  ];

  const softGradients = [
    "from-[#1e3a8a]/40 via-[#3b82f6]/20 to-[#93c5fd]/10", // blue
    "from-[#6d28d9]/30 via-[#8b5cf6]/20 to-[#c4b5fd]/10", // violet
    "from-[#064e3b]/30 via-[#10b981]/20 to-[#6ee7b7]/10", // green
    "from-[#b45309]/40 via-[#f59e0b]/25 to-[#fde68a]/10", // sunset orange
    "from-[#9d174d]/40 via-[#ec4899]/25 to-[#f9a8d4]/10", // rose pink
  ];

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat text-white pt-20 px-4 sm:px-8 pb-28 font-Poppins"
      style={{ backgroundImage: "url('/images/bg20.jpg')" }}
    >
      <Navbar />

      {/* School Cards Grid */}
      <div
        className="mt-12 grid gap-8 sm:gap-10 justify-center"
        style={{
          gridTemplateColumns:
            normalizedSchools.length === 1
              ? "minmax(280px, 520px)"
              : normalizedSchools.length === 2
              ? "repeat(2, minmax(300px, 480px))"
              : "repeat(auto-fit, minmax(240px, 1fr))",
        }}
      >
        {normalizedSchools.map((s, idx) => (
          <div
            key={idx}
            className={`bg-gradient-to-br ${
              softGradients[idx % softGradients.length]
            } border border-white/30 rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition backdrop-blur-lg`}
            style={{
              WebkitBackdropFilter: "blur(16px)",
              backdropFilter: "blur(16px)",
            }}
          >
            {/* School Header */}
            <div className="flex flex-col items-center mb-6 sm:mb-8">
              {hasValue(s.school_logo) && (
                <img
                  src={s.school_logo}
                  alt={s.school}
                  className="w-16 h-16 sm:w-24 sm:h-24 object-contain rounded-full mb-3 sm:mb-4 bg-white p-1.5 sm:p-2"
                />
              )}
              <h2 className="font-semibold text-gray-100 text-center text-base sm:text-lg break-words">
                {s.school}
              </h2>
            </div>

            {/* Features */}
            <div className="flex flex-col gap-3 sm:gap-4">
              {rows.map((row, rIdx) => (
                <div
                  key={rIdx}
                  className="bg-white/10 rounded-xl p-3 sm:p-4 flex flex-col text-left hover:bg-white/20 transition"
                >
                  <h3 className="font-semibold text-gray-200 flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2 text-xs sm:text-base">
                    {row.icon} {row.label}
                  </h3>
                  {row.isLink && hasValue(s[row.key]) ? (
                    <a
                      href={s[row.key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-300 underline text-xs sm:text-base hover:text-blue-100 break-all"
                    >
                      {new URL(s[row.key]).hostname.replace("www.", "")}
                    </a>
                  ) : (
                    <span className="text-gray-300 text-xs sm:text-base break-words leading-relaxed">
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
      <div className="mt-12 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center flex-wrap">
        <button
          onClick={() => navigate("/results")}
          className="w-full sm:w-auto !px-6 sm:!px-10 !py-3 sm:!py-4 !rounded-full !bg-blue-800/30 !backdrop-blur-md !border !border-white/30 !text-white text-xs sm:text-base font-medium !shadow-lg hover:!bg-blue-800/40 transition duration-300 ease-in-out"
          style={{
            WebkitBackdropFilter: "blur(10px)",
            backdropFilter: "blur(10px)",
          }}
        >
          Back to Results
        </button>

        <button
          onClick={() => navigate("/Compare", { state: { selectedSchools } })}
          className="w-full sm:w-auto !px-6 sm:!px-10 !py-3 sm:!py-4 !rounded-full !bg-blue-800/30 !backdrop-blur-md !border !border-white/30 !text-white text-xs sm:text-base font-medium !shadow-lg hover:!bg-blue-800/40 transition duration-300 ease-in-out"
          style={{
            WebkitBackdropFilter: "blur(10px)",
            backdropFilter: "blur(10px)",
          }}
        >
          Schools Strength
        </button>
      </div>
    </div>
  );
}
