import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthWrapper from "./AuthWrapper";

export default function ForgotPasswordFlow() {
  const [step, setStep] = useState(1);
  const [identifier, setIdentifier] = useState("");
  const [userId, setUserId] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  // ---------------- Step 1: Send OTP ----------------
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: identifier.trim() }),
      });
      const data = await res.json();
      if (!data.success) return setError(data.message || "Error sending OTP");

      setUserId(data.userId);
      setMessage("✅ OTP sent! Check your email or mobile.");
      setStep(2);
    } catch (err) {
      console.error(err);
      setError("❌ Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Step 2: Verify OTP ----------------
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/verify-forgot-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, otp: otp.trim() }),
      });
      const data = await res.json();
      if (!data.success) return setError(data.message || "Invalid OTP");

      setMessage("✅ OTP verified! Enter new password.");
      setStep(3);
    } catch (err) {
      console.error(err);
      setError("❌ Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Step 3: Reset Password ----------------
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, newPassword: password }),
      });
      const data = await res.json();
      if (!data.success) return setError(data.message || "Failed to reset password");

      setMessage("✅ Password reset successfully! Redirecting to Sign In...");
      setTimeout(() => navigate("/signin"), 2000);
    } catch (err) {
      console.error(err);
      setError("❌ Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthWrapper>
      <h2 className="text-2xl font-bold mb-6 text-center text-white">
        {step === 1 ? "Forgot Password" : step === 2 ? "Verify OTP" : "Reset Password"}
      </h2>

      {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded text-center">{error}</div>}
      {message && <div className="bg-green-100 text-green-700 p-2 mb-4 rounded text-center">{message}</div>}

      {step === 1 && (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <input
            type="text"
            placeholder="Enter Email or Mobile"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-200"
            required
            autoFocus
          />
          <button
            disabled={loading}
            className="w-full bg-purple-600 text-white p-3 rounded hover:bg-purple-700 transition"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-200"
            required
            autoFocus
          />
          <button
            disabled={loading}
            className="w-full bg-purple-600 text-white p-3 rounded hover:bg-purple-700 transition"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <input
            type="password"
            placeholder="Enter New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-200"
            required
            autoFocus
          />
          <button
            disabled={loading}
            className="w-full bg-purple-600 text-white p-3 rounded hover:bg-purple-700 transition"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      )}
    </AuthWrapper>
  );
}
