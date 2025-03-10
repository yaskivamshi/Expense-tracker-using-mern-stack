

import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { login } = useContext(AuthContext); // ✅ Get login function from context
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

const API_URL = import.meta.env.VITE_API_BASE_URL;
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "${API_URL}/api/auth/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      // Store token
      
      localStorage.setItem("token", res.data.token);
      login(res.data.user.name); // ✅ Update username in context instantly

      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.msg || "Invalid Credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="absolute top-8 left-9">       
        <h1 className="text-3xl font-bold text-black-600">Expense Management System</h1>
        <p className="text-gray-600 text-lg">Track and manage your expenses efficiently.</p>
      </div>
      <div className="w-full max-w-mg bg-white drop-shadow-lg rounded-lg p-12 ">
      <h2 className="text-2xl font-bold text-center text-green-700">Welcome Back!</h2>
      <h3 className="text-lg text-center text-gray-600 mt-3">Login to continue</h3>
      <h2 className="text-3xl font-bold text-center mb-7 text-green-600">Login</h2>

        {error && <p className="text-red-500 text-center font-semibold">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <label className="block font-semibold">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-400 mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="block font-semibold">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-400 mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />


          <button
            type="submit"
            className={`w-full p-3 text-white font-bold rounded ${
              loading ? "bg-gray-400" : "bg-green-500 hover:bg-blue-600 hover:scale-105 transition-transform"
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "LOGIN"}
          </button>
        </form>

        <div className="text-center mt-5">
          <p className="text-sm font-semibold">
            Don't have an account?{" "}
            <a href="/signup" className="text-green-500 hover:underline font-bold">
              Sign Up
            </a>
          </p>
          <p className="text-sm mt-2 font-semibold">
            <a href="/forgot-password" className="text-green-500 hover:underline font-bold">
              Forgot Password?
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;



