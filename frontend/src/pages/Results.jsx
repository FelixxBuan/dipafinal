import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ResultsSection from "../components/ResultsSection";

function Results() {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedResults = JSON.parse(localStorage.getItem("results"));
    const storedMessage = localStorage.getItem("message");

    if (!storedResults || storedResults.length === 0) {
      navigate("/unifinder");
    } else {
      setResults(storedResults);
      setMessage(storedMessage);
    }
  }, [navigate]);

  return (
      <div className="min-h-screen bg-gradient-to-tr from-[#0a0f2e] via-[#0d1a45] to-[#102a5c] text-white font-Poppins">
      
        
        <ResultsSection results={results} message={message} />
      </div>
    
  );
}

export default Results;
