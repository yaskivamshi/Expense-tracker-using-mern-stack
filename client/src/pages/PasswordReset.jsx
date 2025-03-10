
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { X } from "lucide-react"; 

const PasswordReset = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      setMessage(res.data.msg || "Check your email for the password reset link.");
      setError("");
    } catch (err) {
      setError(err.response?.data?.msg || "Error sending email. Try again.");
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/reset-password", {
        token,
        newPassword,
      });
      setMessage(res.data.msg || "Password reset successful. You can now log in.");
      setError("");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.msg || "Something went wrong");
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white-100">
      <div className="w-full max-w-lg bg-white shadow-lg shadow-gray-400/50 rounded-xl p-10">
      
        {token ? (
          <>
            <h2 className="text-3xl font-bold text-center mb-6 text-purple-600">Forgot Password</h2>
            {message && <p className="text-green-500 text-center">{message}</p>}
            {error && <p className="text-red-500 text-center">{error}</p>}
            <form onSubmit={handleResetPassword} className="space-y-4">
              <input
                type="password"
                placeholder="Enter new password"
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button
                className="w-full p-3 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-gray-400"
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-semibold text-center mb-6 text-purple-600">Forgot Password</h2>
            {message && <p className="text-green-500 text-center">{message}</p>}
            {error && <p className="text-red-500 text-center">{error}</p>}
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button className="w-full p-3 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-gray-400" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Email"}
              </button>
            </form>
            
            <button
              onClick={() => navigate("/login")}
              className="w-full mt-4 bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-300 transition-all duration-300"
            >
              ⬅️ Go Back
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PasswordReset;

