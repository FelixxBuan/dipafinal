import { useNavigate } from "react-router-dom";
import { Users, Search, GraduationCap } from "lucide-react";
import Navbar from "../components/Navbar";
import { ArrowRight } from "lucide-react";

function Home() {
  const navigate = useNavigate();

  return (
    <>
      {/* Sticky Navbar */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-[#020617]/90 to-[#0a0f1f]/90 backdrop-blur-md">
        <Navbar />
      </div>

      {/* Global Wrapper with swipe snapping */}
      <div className="h-screen overflow-y-scroll snap-y snap-mandatory bg-gradient-to-br from-[#020617] to-[#0a0f1f] text-white font-Poppins">
        
        {/* Hero Section */}
        <section className="h-screen snap-start flex items-center justify-center px-3 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-Merriweather font-extrabold leading-snug mb-4 sm:mb-6">
              Explore Your Ideal
              <span className="text-blue-400 block drop-shadow-lg">
                University & Program
              </span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/80 mb-6 sm:mb-10 max-w-xl mx-auto">
              UniFinder helps you locate the perfect{" "}
              <span className="text-blue-400">school</span> and{" "}
              <span className="text-blue-400">program</span> tailored to your{" "}
              <span className="text-blue-400">interests</span>,{" "}
              <span className="text-blue-400">budget</span>, and{" "}
              <span className="text-blue-400">location preferences</span>.
            </p>
            <button
              onClick={() => navigate("/unifinder")}
              className="
                inline-flex items-center justify-center gap-2
                px-5 sm:px-6 md:px-8 lg:px-10
                py-2 sm:py-2.5 md:py-3 lg:py-3.5
                rounded-full 
                bg-blue-900/40 backdrop-blur-md
                border border-blue-300/40
                text-white 
                text-sm sm:text-base md:text-lg lg:text-xl
                font-Poppins font-medium 
                shadow-lg 
                hover:bg-blue-500/50 hover:shadow-xl 
                transition duration-300 ease-in-out
              "
            >
              Find My Program
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="h-screen snap-start flex items-center justify-center px-3 py-8 sm:py-12 md:py-16 lg:py-20 relative z-10">
          <div className="container mx-auto px-3">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-Merriweather font-bold text-center mb-8 sm:mb-12 md:mb-16">
              How Uni-Finder Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8 md:gap-10 max-w-6xl mx-auto">
              
              {/* Step 1 */}
              <div className="bg-blue-900/40 backdrop-blur-md border border-blue-300/40 rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 hover:bg-blue-500/50 transition-all duration-300">
                <div className="text-center">
                  <div className="bg-blue-500/20 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-6">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-blue-400" />
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3 md:mb-4">
                    1. Share Your Interests
                  </h3>
                  <p className="text-white/70 text-xs sm:text-sm md:text-base">
                    Tell us about your passions, hobbies, and career interests to
                    help us understand what you’re looking for.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-blue-900/40 backdrop-blur-md border border-blue-300/40 rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 hover:bg-blue-500/50 transition-all duration-300">
                <div className="text-center">
                  <div className="bg-green-500/20 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-6">
                    <Search className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-green-400" />
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3 md:mb-4">
                    2. Set Your Preferences
                  </h3>
                  <p className="text-white/70 text-xs sm:text-sm md:text-base">
                    Choose between public or private institutions, set your
                    budget range, and select your preferred locations.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-blue-900/40 backdrop-blur-md border border-blue-300/40 rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 hover:bg-blue-500/50 transition-all duration-300">
                <div className="text-center">
                  <div className="bg-purple-500/20 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-6">
                    <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-purple-400" />
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3 md:mb-4">
                    3. Get Recommendations
                  </h3>
                  <p className="text-white/70 text-xs sm:text-sm md:text-base">
                    Receive personalized program and school recommendations that
                    match your criteria perfectly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="h-screen snap-start flex items-center justify-center border-t border-white/10 px-3 py-8 sm:py-12 md:py-16 lg:py-20 relative z-10">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-Merriweather font-bold text-center mb-6 sm:mb-8 md:mb-12">
              Frequently Asked Questions
            </h2>

            <div className="space-y-3 sm:space-y-4">
              {[
                {
                  question: "What is UniFinder?",
                  answer:
                    "UniFinder is a smart recommendation platform that helps students discover ideal programs and schools based on their preferences like interests, location, and budget.",
                },
                {
                  question: "Is UniFinder free to use?",
                  answer: "Yes! UniFinder is completely free for students to explore and use.",
                },
                {
                  question: "How accurate are the recommendations?",
                  answer:
                    "Our recommendations are generated using smart filters and similarity matching to align with the data you provide. The more accurate your input, the better the results.",
                },
                {
                  question: "Can I use UniFinder without creating an account?",
                  answer:
                    "Yes. You can try UniFinder without an account, but creating one lets you save your preferences and get better suggestions.",
                },
              ].map((faq, index) => (
                <details
                  key={index}
                  className="bg-blue-900/40 backdrop-blur-md border border-blue-300/40 rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 md:p-5 hover:bg-blue-500/50 transition-all duration-300"
                >
                  <summary className="font-semibold text-sm sm:text-base md:text-lg cursor-pointer flex justify-between items-center text-white group-open:text-blue-400">
                    {faq.question}
                    <span className="ml-2 transform transition-transform group-open:rotate-180">
                      ⌄
                    </span>
                  </summary>
                  <p className="mt-2 sm:mt-3 text-white/70 text-xs sm:text-sm md:text-base">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Home;
