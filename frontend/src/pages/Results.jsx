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
      <div
  className="min-h-screen bg-cover bg-center bg-no-repeat text-white font-Poppins"
  style={{
    backgroundImage: "url('/images/bg10.jpg')",
  }}
>

      
        
        <ResultsSection results={results} message={message} />
      </div>
    
  );
}

export default Results;
