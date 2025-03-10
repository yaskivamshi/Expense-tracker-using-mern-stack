
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", { name, email, password });

      alert("Signup successful! Redirecting to login...");
      navigate("/login");
    } catch (err) {
      setError(err?.response?.data?.msg || "Error signing up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-10">
      <h2 className="text-2xl font-bold text-green-700 text-center">
          Welcome to Expense Management System
      </h2>
        <h2 className="text-3xl font-bold text-left mb-6 text-green-600"> Sign Up</h2>

        {error && <p className="text-red-500 text-center font-semibold">{error}</p>}

        <form onSubmit={handleSignup} className="space-y-5">
          <label className="block font-semibold">Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label className="block font-semibold">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="block font-semibold">Password</label>
          <input
            type="password"
            placeholder="Enter a strong password"
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className={`w-full p-3 text-white font-bold rounded ${loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"}`}
            disabled={loading}
          >
            {loading ? "Signing up..." : "SIGN UP"}
          </button>
        </form>

        <div className="text-center mt-5">
          <p className="text-sm font-semibold">
            Already have an account?{" "}
            <a href="/login" className="text-green-500 hover:underline font-bold">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
