import { useState, useEffect } from "react";
import { X, Trash2 } from "lucide-react";

export default function PreviousResultsModal({ isOpen, onClose }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to view previous results.");
      return;
    }

    const fetchPreviousResults = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch("http://localhost:8000/previous-results", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch previous results");
        const data = await res.json();

        // ✅ Handle cases where data might be an object or array
        const userResults = Array.isArray(data)
          ? data
          : Array.isArray(data.results)
          ? data.results
          : [];

        setResults(userResults);
      } catch (err) {
        console.error(err);
        setError("Error loading previous results.");
      } finally {
        setLoading(false);
      }
    };

    fetchPreviousResults();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-screen h-screen z-[9999] flex justify-center items-start bg-black/60 backdrop-blur-sm overflow-y-auto py-10 px-4">
      <div className="relative bg-[#0a1733]/90 backdrop-blur-2xl border border-blue-400/20 rounded-2xl w-full max-w-6xl p-6 text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/80 hover:text-red-400 transition"
        >
          <X size={24} />
        </button>

        <h2 className="text-3xl font-bold mb-6 text-center">Previous Results</h2>

        {/* Clear Results Button */}
        <div className="flex justify-end mb-4">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-red-600/70 hover:bg-red-500 rounded-lg text-white font-semibold text-sm"
            onClick={() => alert("Clear results feature coming soon!")}
          >
            <Trash2 size={16} /> Clear Results
          </button>
        </div>

        {/* Loading / Error / Empty states */}
        {loading ? (
          <p className="text-center text-white/70">Loading previous results...</p>
        ) : error ? (
          <p className="text-center text-red-400">{error}</p>
        ) : results.length === 0 ? (
          <p className="text-center text-white/70">No previous results found.</p>
        ) : (
          <div className="space-y-8">
            {results.map((resItem, index) => (
              <div
                key={resItem._id || index}
                className="bg-blue-900/20 p-4 rounded-xl border border-blue-400/30"
              >
                <h3 className="text-xl font-semibold mb-2">Result #{index + 1}</h3>

                {/* User Answers */}
                <div className="mb-4">
                  <h4 className="font-semibold mb-1">User Answers:</h4>
                  <ul className="list-disc list-inside text-sm xs:text-base">
                    {Object.entries(resItem.answers || {}).map(([key, value]) => (
                      <li key={key}>
                        <strong>{key}:</strong>{" "}
                        {Array.isArray(value)
                          ? value.join(", ")
                          : typeof value === "object"
                          ? JSON.stringify(value)
                          : value?.toString()}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div>
                  <h4 className="font-semibold mb-2">Recommended Programs:</h4>
                  {resItem.results && resItem.results.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-sm xs:text-base">
                        <thead>
                          <tr className="border-b border-blue-400/50">
                            <th className="py-2 px-3">School</th>
                            <th className="py-2 px-3">Program</th>
                            <th className="py-2 px-3">Score</th>
                            <th className="py-2 px-3">Tuition</th>
                            <th className="py-2 px-3">Location</th>
                          </tr>
                        </thead>
                        <tbody>
                          {resItem.results.map((r, i) => (
                            <tr
                              key={i}
                              className={`border-b border-blue-400/30 ${
                                i % 2 === 0 ? "bg-blue-900/20" : "bg-blue-900/10"
                              }`}
                            >
                              <td className="py-2 px-3">{r.school || "-"}</td>
                              <td className="py-2 px-3">{r.program || "-"}</td>
                              <td className="py-2 px-3">{r.score || "-"}</td>
                              <td className="py-2 px-3">{r.tuition_per_semester || "-"}</td>
                              <td className="py-2 px-3">{r.location || "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-white/70">No recommendations found for this result.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
