import { useNavigate } from "react-router-dom";
import { Users, Search, GraduationCap } from "lucide-react";
import Navbar from "../components/navbar";

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      {/* Global Wrapper with one shared background */}
      <div className="h-screen overflow-y-scroll snap-y snap-mandatory min-h-screen bg-gradient-to-br from-[#020617] to-[#0a0f1f] pt-24 px-4 text-white font-Poppins relative">
        
  

       {/* Hero Section */}
<section className="h-screen snap-start flex items-center justify-center pt-20 px-6 relative z-10">
  <div className="max-w-4xl mx-auto text-center">
    <h1 className="text-6xl md:text-7xl font-Merriweather font-extrabold leading-tight mb-8">
      Explore Your Ideal
      <span className="text-blue-400 block drop-shadow-lg">
        University & Program
      </span>
    </h1>
    <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto">
      UniFinder helps you locate the perfect <span className="text-blue-400">school</span> and <span className="text-blue-400">program</span> tailored to your <span className="text-blue-400">interests</span>, <span className="text-blue-400">budget</span>, and <span className="text-blue-400">location preferences</span>.
    </p>
   <button
  onClick={() => navigate("/unifinder")}
  className="px-10 py-5 rounded-lg bg-blue-600 border border-white/30 text-white text-lg md:text-xl font-Poppins font-medium shadow-lg hover:bg-blue-500 transition duration-300 ease-in-out"
>
  Find My Program
</button>



  </div>
</section>


        {/* How It Works Section */}
        <section className="h-screen snap-start flex items-center justify-center px-6 py-20 relative z-10">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-Merriweather font-bold text-center mb-16">
              How UniFinder Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
              {/* Step 1 */}
              <div className="backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-8 hover:bg-white/5 transition-all duration-300">
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
              <div className="backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-8 hover:bg-white/5 transition-all duration-300">
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
              <div className="backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-8 hover:bg-white/5 transition-all duration-300">
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

        {/* FAQ Section */}
        <section className="h-screen snap-start flex items-center justify-center border-t border-white/10 px-6 relative z-10">
          <div className="container mx-auto max-w-4xl">
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
                  className="group border border-white/20 rounded-2xl p-5 backdrop-blur-sm open:bg-white/5 transition-all duration-300"
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
    </>
  );
}

export default Home;
