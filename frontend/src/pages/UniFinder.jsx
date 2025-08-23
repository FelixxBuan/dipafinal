import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Heart, MapPin, DollarSign, School, Search, HelpCircle } from "lucide-react"
import Navbar from "../components/navbar"

function UniFinder() {
  const [step, setStep] = useState(1)
  const navigate = useNavigate()

  const [answers, setAnswers] = useState({
    academics: [],
    fields: [],
    activities: [],
    goals: [],
    environment: [],
    custom: {
      academics: "", fields: "", activities: "", goals: "", environment: "",
    }
  })

  const [schoolType, setSchoolType] = useState("any")
  const [locations, setLocations] = useState([])
  const [maxBudget, setMaxBudget] = useState(50000)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  const handleCheckboxChange = (questionKey, choice) => {
    setAnswers(prevAnswers => {
      const selected = prevAnswers[questionKey];
      const isSelected = selected.includes(choice);
      if (isSelected) {
        return {
          ...prevAnswers,
          [questionKey]: selected.filter(item => item !== choice)
        };
      } else {
        if (selected.length >= 3) return prevAnswers;
        return {
          ...prevAnswers,
          [questionKey]: [...selected, choice]
        };
      }
    });
  };

  const handleCustomChange = (category, value) => {
    setAnswers(prev => ({
      ...prev,
      custom: { ...prev.custom, [category]: value }
    }))
  }

  const allLocations = ["Angeles", "Apalit", "Bacolor", "Candaba", "Mabalacat", "Magalang", "Malolos", "Mexico", "Porac", "San Fernando"]
  const filteredLocations = schoolType === "private" ? ["Angeles", "San Fernando"] : allLocations

  const questions = [
    { key: "academics", title: "What subjects or academic areas do you enjoy the most?", choices: ["Math", "Science", "English", "History or Social Studies", "PE or Sports", "Arts or Design", "Technology or ICT", "Business or Economics", "Foreign Languages"] },
    { key: "fields", title: "Which fields or careers are you most drawn to?", choices: ["Engineering & Architecture", "Arts & Media", "Healthcare & Medicine", "Education & Teaching", "Social Work", "Law & Government", "Science & Research", "Technology"] },
    { key: "activities", title: "What kinds of tasks or activities do you enjoy doing?", choices: ["Designing", "Solving puzzles or problems", "Writing", "Building or fixing things", "Helping or mentoring others", "Researching or analyzing", "Speaking or presenting"] },
    { key: "goals", title: "What goals matter most to you in a future career?", choices: ["Innovating", "Making a positive impact on people’s lives", "Educating","Business growth", "Promoting justice","Protecting the environment",] },
    { key: "environment", title: "What environment or setting do you see yourself working in?", choices: ["Office", "Academic setting", "Hospitals", "Outdoor", "Workshop or laboratory", "Creative space", "Tech-driven", "Government institutions", "freelance setup"] }
  ];

  const search = async () => {
    const payload = { answers, school_type: schoolType, locations }
    if (schoolType === "private") payload.max_budget = maxBudget

    const response = await fetch("http://127.0.0.1:8000/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const data = await response.json()
    localStorage.setItem("results", JSON.stringify(data.results || []))
    localStorage.setItem("message", data.message || "")
    localStorage.setItem("type", data.type || "exact")
    navigate("/results")
  }

const ProgressBar = () => {
  const steps = [
    { id: 1, label: "Questions", icon: <HelpCircle size={24} /> },
    { id: 2, label: "School Type", icon: <School size={24} /> },
    { id: 3, label: "Location", icon: <MapPin size={24} /> },
  ];

  // Progress calculation
  let progressPercent = 0;

  if (step === 1) {
    // Only start moving after the 1st question
    if (currentQuestionIndex === 0) {
      progressPercent = 0; // still at circle 1
    } else {
      // 4 equal segments between circle 1 and circle 2
      progressPercent =
        (currentQuestionIndex / (questions.length - 1)) *
        (100 / (steps.length - 1));
    }
  } else if (step === 2) {
    progressPercent = 100 / (steps.length - 1); // exactly at circle 2
  } else if (step === 3) {
    progressPercent = 100; // full bar
  }

  return (
    <div className="w-full max-w-3xl mx-auto mt-12 relative">
      {/* Background Line */}
      <div
        className="absolute top-1/2 h-[6px] bg-blue-900 rounded-full transform -translate-y-1/2"
        style={{ left: "4rem", right: "3rem" }}
      ></div>

      {/* Progress Line */}
      <div
        className="absolute top-1/2 h-[6px] rounded-full bg-blue-400 shadow-[0_0_20px_4px_rgba(59,130,246,0.8)] transform -translate-y-1/2 transition-all duration-500"
        style={{
          left: "4rem",
          width: `calc((100% - 7rem) * ${progressPercent / 100})`,
        }}
      ></div>

      {/* Circles */}
      <div className="flex justify-between relative z-10 px-4">
        {steps.map((s) => {
          // Extra glow for Step 2 during question progress
          let extraGlow = "";
          if (s.id === 2 && step === 1 && currentQuestionIndex > 0) {
            const progressToStep2 =
              currentQuestionIndex / (questions.length - 1);
            extraGlow = `shadow-[0_0_${10 + progressToStep2 * 20}px_${
              2 + progressToStep2 * 4
            }px_rgba(59,130,246,${0.3 + progressToStep2 * 0.5})]`;
          }

          return (
            <div key={s.id} className="flex flex-col items-center">
              <div
                className={`w-14 h-14 flex items-center justify-center rounded-full border-2 transition-all duration-500
                  ${
                    s.id === step
                      ? "bg-blue-900 text-white border-blue-400"
                      : s.id < step
                      ? "bg-blue-900 text-white border-blue-400"
                      : "bg-blue-900 text-gray-400 border-blue-900/50"
                  } ${extraGlow}`}
              >
                {s.icon}
              </div>
              <span className="mt-3 text-sm text-white">{s.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};


  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#020617] to-[#0a0f1f] pt-24 px-4 text-white">


        <div className="max-w-5xl mx-auto space-y-8">

          <ProgressBar />

          {/* Step 1 */}
         {step === 1 && (
  <>
    {(() => {
      const q = questions[currentQuestionIndex]
      return (
        <div className="bg-blue-800/20 backdrop-blur-md p-10 rounded-3xl border border-white/20 shadow-lg space-y-8">
          <div className="flex items-center gap-3">
            <div className="bg-blue-300/20 p-3 rounded-md">
              <Heart className="text-blue-300 w-7 h-7" />
            </div>
          <h2 className="text-2xl font-semibold font-inter">{q.title}</h2>
          </div>

          <div className="flex flex-wrap gap-4">
            {q.choices.map((choice) => {
              const isSelected = answers[q.key].includes(choice);
              return (
                <div
                  key={choice}
                  onClick={() => handleCheckboxChange(q.key, choice)}
                  className={`
                    px-4 py-2 rounded-full text-lg font-medium cursor-pointer transition
                    ${isSelected 
                      ? "border-4 border-white" 
                      : "border-2 border-blue-400 opacity-80 hover:opacity-100"} 
                    bg-white/10 backdrop-blur-sm
                    text-white font-poppins
                  `}
                >
                  {choice}
                </div>
              );
            })}
</div>
                    <input
                      type="text"
                      placeholder="Other (optional)..."
                      className="mt-2 w-full border border-white/20 bg-white/10 rounded-lg px-4 py-2 text-sm placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={answers.custom[q.key]}
                      onChange={(e) => handleCustomChange(q.key, e.target.value)}
                    />
                  </div>
                )
              })()}
              <div className="flex justify-between mt-4">
  {currentQuestionIndex > 0 ? (
    <button
      className="px-6 py-3 rounded-xl text-lg font-poppins text-white 
                 border border-white/20 backdrop-blur-sm transition
                 hover:border-blue-300"
      style={{ backgroundColor: "rgba(59, 130, 246, 0.2)" }}
      onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
    >
      Back
    </button>
  ) : <span></span>}

  {currentQuestionIndex < questions.length - 1 ? (
    <button
      className="px-6 py-3 rounded-xl text-lg font-poppins font-medium text-white 
                 border border-white/20 backdrop-blur-sm transition
                 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
      style={{ backgroundColor: "rgba(59, 130, 246, 0.2)" }}
      disabled={
        answers[questions[currentQuestionIndex].key].length === 0 &&
        answers.custom[questions[currentQuestionIndex].key].trim() === ""
      }
      onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
    >
      Next
    </button>
  ) : (
    <button
      className="px-6 py-3 rounded-xl text-lg font-poppins font-medium text-white 
                 border border-white/20 backdrop-blur-sm transition
                 hover:border-blue-300"
      style={{ backgroundColor: "rgba(59, 130, 246, 0.2)" }}
      onClick={() => setStep(2)}
    >
      Continue
    </button>
  )}
</div>
              
            </>
          )}

          {/* Step 2 */}
          {step === 2 && (
  <>
    <div className="bg-blue-800/20 backdrop-blur-md border border-white/20 
                    rounded-xl shadow-lg p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-blue-400/20 p-2.5 rounded-lg">
          <School className="text-blue-300 w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold font-inter">Preferred School Type</h2>
          <p className="text-sm text-blue-100 font-poppins">
            Choose which type of school you prefer
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {[{ value: "public", label: "Public Schools", desc: "State-funded, affordable options" },
          { value: "private", label: "Private Schools", desc: "Privately-run with more variety" },
          { value: "any", label: "Both Types", desc: "I'm open to all options" }].map(({ value, label, desc }) => (
            <label
              key={value}
              className={`flex items-start gap-3 p-4 rounded-lg border transition cursor-pointer text-base
                ${schoolType === value
                  ? "border-4 border-blue-400 bg-blue-500/20"
                  : "border-2 border-white/20 hover:border-blue-300"}`}
            >
              <input
                type="radio"
                name="schoolType"
                value={value}
                checked={schoolType === value}
                onChange={(e) => {
                  const selected = e.target.value
                  setSchoolType(selected)
                  if (selected === "private") {
                    setLocations(prev => prev.filter(loc => ["Angeles", "San Fernando"].includes(loc)))
                  }
                }}
                className="w-5 h-5 opacity-0 cursor-pointer"
              />
              <div>
                <span className="font-semibold font-poppins">{label}</span>
                <p className="text-sm text-blue-100 font-poppins">{desc}</p>
              </div>
            </label>
        ))}
      </div>
    </div>

    {schoolType === "private" && (
      <div className="bg-blue-800/20 backdrop-blur-md border border-white/20 
                      rounded-xl p-6 shadow-lg max-w-3xl mx-auto mt-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-300/20 p-2.5 rounded-lg">
            <DollarSign className="text-blue-300 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold font-inter">Maximum Tuition</h2>
            <p className="text-sm text-blue-100 font-poppins">
              Set your budget per semester
            </p>
          </div>
        </div>

        <label className="block text-blue-100 font-medium mb-2 font-poppins text-base">
          Selected: ₱{maxBudget.toLocaleString()}
        </label>

        <input
          type="range"
          min={5000}
          max={100000}
          step={1000}
          value={maxBudget}
          onChange={(e) => setMaxBudget(Number(e.target.value))}
          className="w-full accent-blue-400"
        />

        <div className="flex justify-between text-sm text-blue-200 mt-2 font-poppins">
          <span>₱5,000</span>
          <span>₱50,000</span>
          <span>₱100,000</span>
        </div>
      </div>
    )}

    <div className="flex justify-between mt-5 pb-6 max-w-3xl mx-auto">
      <button
        className="px-6 py-2.5 rounded-lg text-base font-poppins text-white 
                   border border-white/20 backdrop-blur-sm transition
                   hover:border-blue-300"
        style={{ backgroundColor: "rgba(59, 130, 246, 0.2)" }}
        onClick={() => setStep(1)}
      >
        Back
      </button>

      <button
        className="px-7 py-3 rounded-lg text-base font-poppins font-medium text-white 
                   border border-white/20 backdrop-blur-sm transition
                   hover:border-blue-300"
        style={{ backgroundColor: "rgba(59, 130, 246, 0.2)" }}
        onClick={() => setStep(3)}
      >
        Next
      </button>
    </div>
  </>
)}



          
          {/* Step 3 */}
{step === 3 && (
  <>
    <div className="bg-blue-800/20 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-300/20 p-3 rounded-lg">
          <MapPin className="text-blue-300 w-7 h-7" />
        </div>
        <div>
          <h2 className="text-3xl font-semibold font-inter">Preferred Locations</h2>
<p className="text-base text-blue-100 font-inter">
  Choose cities in Pampanga where you'd like to study
</p>

        </div>
      </div>

      {/* Pill-shaped multi-select like Step 1 */}
      <div className="flex flex-wrap gap-4">
        {filteredLocations.map((loc) => {
          const isSelected = locations.includes(loc);
          return (
            <div
              key={loc}
              onClick={() => {
                setLocations((prev) =>
                  isSelected ? prev.filter((l) => l !== loc) : [...prev, loc]
                );
              }}
              className={`
                px-6 py-3 rounded-full text-lg font-medium font-poppins cursor-pointer transition
                ${isSelected
                  ? "border-4 border-white"
                  : "border-2 border-blue-400 opacity-80 hover:opacity-100"}
                bg-white/10 backdrop-blur-sm
                text-white
              `}
            >
              {loc}
            </div>
          );
        })}
      </div>
    </div>

    <div className="flex justify-between mt-6 mb-12">
  <button
    className="px-6 py-3 rounded-xl text-lg font-poppins text-white 
               border border-white/20 backdrop-blur-sm transition
               hover:border-blue-300"
    style={{ backgroundColor: "rgba(59, 130, 246, 0.2)" }}
    onClick={() => setStep(2)}
  >
    Back
  </button>

  <button
    onClick={search}
    className="px-8 py-4 rounded-xl text-lg font-poppins font-semibold text-white 
               border border-white/20 backdrop-blur-sm transition
               hover:border-blue-300 flex items-center"
    style={{ backgroundColor: "rgba(59, 130, 246, 0.2)" }}
  >
    <Search className="inline-block w-6 h-6 mr-2" />
    Find Programs
  </button>
</div>

  </>
)}

        </div>
      </div>
      
    </>
  )
}

export default UniFinder
