import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Heart, MapPin, DollarSign, School, Search } from "lucide-react"
import Navbar from "../components/navbar"
import Footer from "../components/Footer"

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
    { key: "fields", title: "Which fields or careers are you most drawn to?", choices: ["Engineering & Architecture", "Business & Entrepreneurship", "Arts & Media", "Healthcare & Medicine", "Education & Teaching", "Social Work", "Law & Government", "Science & Research", "Technology"] },
    { key: "activities", title: "What kinds of tasks or activities do you enjoy doing?", choices: ["Designing", "Solving puzzles or problems", "Writing", "Building or fixing things", "Helping or mentoring others", "Researching or analyzing", "Speaking or presenting", "Working in teams or leading", "Hands-on"] },
    { key: "goals", title: "What goals matter most to you in a future career?", choices: ["Innovating", "Making a positive impact on people’s lives", "Educating", "Advancing technology", "Protecting the environment", "Supporting communities", "Business growth", "Promoting justice",] },
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
  const totalSteps = 3;
  const percent = Math.round((step / totalSteps) * 100);

  return (
    <div className="mb-12 px-6">
      {/* Step counter */}
      <div className="text-center mb-2 text-blue-200 text-lg font-medium">
        Step {step} of {totalSteps}
      </div>

      {/* Progress bar */}
      <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden relative">
        <div
          className="h-4 rounded-full"
          style={{
            width: `${percent}%`,
            background: "rgba(59, 130, 246, 0.6)",
            animation: "pulseBlue 2s ease-in-out infinite",
          }}
        />
      </div>

      <style>
        {`
          @keyframes pulseBlue {
            0% {
              box-shadow: 0 0 8px rgba(59,130,246,0.5), 0 0 15px rgba(147,197,253,0.3);
            }
            50% {
              box-shadow: 0 0 16px rgba(59,130,246,0.7), 0 0 30px rgba(147,197,253,0.5);
            }
            100% {
              box-shadow: 0 0 8px rgba(59,130,246,0.5), 0 0 15px rgba(147,197,253,0.3);
            }
          }
        `}
      </style>
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
            <h2 className="text-2xl font-semibold font-poppins">{q.title}</h2>
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
                    text-white font-merriweather
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
      className="px-6 py-3 rounded-xl text-lg font-merriweather text-white 
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
    <div className="bg-blue-800/20 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-400/20 p-3 rounded-lg">
          <School className="text-blue-300 w-7 h-7" />
        </div>
        <div>
          <h2 className="text-3xl font-semibold font-poppins">Preferred School Type</h2>
          <p className="text-base text-blue-100 font-merriweather">
            Choose which type of school you prefer
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {[{ value: "public", label: "Public Schools", desc: "State-funded, affordable options" },
          { value: "private", label: "Private Schools", desc: "Privately-run with more variety" },
          { value: "any", label: "Both Types", desc: "I'm open to all options" }].map(({ value, label, desc }) => (
            <label
              key={value}
              className={`flex items-start gap-4 p-5 rounded-xl border transition cursor-pointer text-lg
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
                className="w-6 h-6 opacity-0 cursor-pointer"
              />
              <div>
                <span className="font-semibold font-poppins">{label}</span>
                <p className="text-base text-blue-100 font-merriweather">{desc}</p>
              </div>
            </label>
        ))}
      </div>
    </div>

    {schoolType === "private" && (
      <div className="bg-blue-800/20 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-lg mt-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-300/20 p-3 rounded-lg">
            <DollarSign className="text-blue-300 w-7 h-7" />
          </div>
          <div>
            <h2 className="text-3xl font-semibold font-poppins">Maximum Tuition</h2>
            <p className="text-base text-blue-100 font-merriweather">
              Set your budget per semester
            </p>
          </div>
        </div>

        <label className="block text-blue-100 font-medium mb-3 font-merriweather text-lg">
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

        <div className="flex justify-between text-base text-blue-200 mt-2 font-merriweather">
          <span>₱5,000</span>
          <span>₱50,000</span>
          <span>₱100,000</span>
        </div>
      </div>
    )}

    <div className="flex justify-between pt-6">
  <button
    className="px-6 py-3 rounded-xl text-lg font-merriweather text-white 
               border border-white/20 backdrop-blur-sm transition
               hover:border-blue-300"
    style={{ backgroundColor: "rgba(59, 130, 246, 0.2)" }}
    onClick={() => setStep(1)}
  >
    Back
  </button>

  <button
    className="px-8 py-4 rounded-xl text-lg font-poppins font-medium text-white 
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
          <h2 className="text-3xl font-semibold font-poppins">Preferred Locations</h2>
          <p className="text-base text-blue-100 font-merriweather">
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
                px-6 py-3 rounded-full text-lg font-medium font-merriweather cursor-pointer transition
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

    <div className="flex justify-between pt-6">
  <button
    className="px-6 py-3 rounded-xl text-lg font-merriweather text-white 
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
      <Footer />
    </>
  )
}

export default UniFinder
