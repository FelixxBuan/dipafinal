import { useState } from "react";
import axios from "axios";
import { X, GraduationCap, Eye, EyeOff } from "lucide-react";

export default function AuthModal({ isOpen, onClose, defaultIsLogin = true }) {
  const [isLogin, setIsLogin] = useState(defaultIsLogin);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (isLogin) {
        // 🔹 LOGIN
        const res = await axios.post("http://127.0.0.1:8000/login", {
          email,
          password,
        });

        const { access_token, user } = res.data;
        localStorage.setItem("token", access_token);
        localStorage.setItem("user", JSON.stringify(user));

        setMessage("Login successful!");
        onClose();
      } else {
        // 🔹 REGISTER
        await axios.post("http://127.0.0.1:8000/register", {
          email,
          password,
          full_name: fullName,
        });
        setMessage("✅ Registration successful! You can now log in.");
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.detail || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center 
                 min-h-screen backdrop-blur-lg bg-black/40 font-[Poppins] px-4"
      onClick={onClose} // close on background click
    >
      <div
        className="relative w-full max-w-lg rounded-3xl shadow-2xl 
                   bg-blue-900/60 backdrop-blur-2xl border border-blue-400/20 
                   text-white p-10 flex flex-col items-center"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        {/* ❌ Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-red-500 hover:text-red-600 transition"
        >
          <X size={24} />
        </button>

        {/* 🎓 UniFinder Logo */}
        <div className="flex items-center gap-2 mb-6">
          <GraduationCap size={32} className="text-white" />
          <h1 className="text-2xl font-semibold leading-none">Uni-Finder</h1>
        </div>

        {/* 🔹 Title */}
        <h2 className="text-lg font-medium mb-6">
          {isLogin ? "Welcome Back" : "Create an Account"}
        </h2>

        {/* 🧾 Form */}
        <form onSubmit={handleAuth} className="w-full space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-300 
                         focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-300 
                       focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          {/* 👁 Password Input with Toggle */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-300 
                         focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 
                       transition-all shadow-md shadow-blue-900/40"
          >
            {loading ? "Processing..." : isLogin ? "Login" : "Register"}
          </button>
        </form>

        {/* 🔹 Message */}
        {message && (
          <p className="text-center text-sm mt-3 text-blue-300">{message}</p>
        )}

        {/* 🔹 Toggle Login/Register */}
        <div className="text-center mt-5 text-sm text-gray-300">
          {isLogin ? (
            <p>
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setMessage("");
                }}
                className="text-blue-400 hover:underline"
              >
                Register
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setMessage("");
                }}
                className="text-blue-400 hover:underline"
              >
                Login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
