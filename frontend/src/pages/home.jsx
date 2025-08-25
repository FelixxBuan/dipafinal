import { useNavigate } from "react-router-dom";
import { Users, Search, GraduationCap } from "lucide-react";
import Navbar from "../components/navbar";
import Footer from "../components/Footer";
import ShowcaseCarousel from "../components/ShowcaseCarousel";

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-950 to-black text-white font-Poppins">
        {/* Hero Section */}
        <section className="container mx-auto px-6 py-24 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-Merriweather font-extrabold leading-tight mb-6">
              Find Your Perfect
              <span className="text-blue-400 block drop-shadow-lg">
                Educational Path
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Discover the ideal school and program that matches your{" "}
              <span className="text-teal-400">interests</span>,{" "}
              <span className="text-green-400">budget</span>, and{" "}
              <span className="text-purple-400">location preferences</span> with
              our intelligent recommendation system.
            </p>
            <button
              onClick={() => navigate("/unifinder")}
              className="px-8 py-4 bg-blue-600/40 backdrop-blur-md border border-white/20 text-white text-lg font-semibold rounded-full hover:bg-blue-600/60 transition-all shadow-md"
            >
              Start Finding Programs
            </button>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-Merriweather font-bold text-center mb-16">
              How UniFinder Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
              {/* Step 1 */}
              <div className="bg-blue-800/20 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-8 hover:bg-blue-800/30 transition-all duration-300">
                <div className="text-center">
                  <div className="bg-blue-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">1. Share Your Interests</h3>
                  <p className="text-white/70">
                    Tell us about your passions, hobbies, and career interests to
                    help us understand what you’re looking for.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-blue-800/20 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-8 hover:bg-blue-800/30 transition-all duration-300">
                <div className="text-center">
                  <div className="bg-green-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">2. Set Your Preferences</h3>
                  <p className="text-white/70">
                    Choose between public or private institutions, set your
                    budget range, and select your preferred locations.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-blue-800/20 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-8 hover:bg-blue-800/30 transition-all duration-300">
                <div className="text-center">
                  <div className="bg-purple-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <GraduationCap className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">3. Get Recommendations</h3>
                  <p className="text-white/70">
                    Receive personalized program and school recommendations that
                    match your criteria perfectly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Showcase Carousel Section */}
        <div className="py-20">
          <ShowcaseCarousel />
        </div>

        {/* FAQ Section */}
        <section className="py-20 bg-blue-800/20 backdrop-blur-md border-t border-white/10">
          <div className="container mx-auto px-6 max-w-4xl">
            <h2 className="text-4xl font-Merriweather font-bold text-center mb-12">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              {[
                {
                  question: "What is UniFinder?",
                  answer:
                    "UniFinder is a smart recommendation platform that helps students discover ideal programs and schools based on their preferences like interests, location, and budget.",
                },
                {
                  question: "Is UniFinder free to use?",
                  answer:
                    "Yes! UniFinder is completely free for students to explore and use.",
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
                  className="group bg-blue-900/30 border border-white/20 rounded-2xl p-5 backdrop-blur-sm open:bg-blue-900/50 transition-all duration-300"
                >
                  <summary className="font-semibold text-lg cursor-pointer flex justify-between items-center text-white group-open:text-blue-400">
                    {faq.question}
                    <span className="ml-2 transform transition-transform group-open:rotate-180">
                      ⌄
                    </span>
                  </summary>
                  <p className="mt-3 text-white/70">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}

export default Home;
