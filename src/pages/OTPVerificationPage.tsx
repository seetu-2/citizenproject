import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function OTPVerificationPage() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { user, setOtpVerified } = useAuth();

  const email = useMemo(() => {
    return localStorage.getItem("pendingEmail") || user?.email || "";
  }, [user?.email]);

  useEffect(() => {
    if (!email) navigate("/login", { replace: true });
  }, [email, navigate]);

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      const response = await apiRequest("/auth/verify-otp", "POST", { otp, email });
      const serverVerified = Boolean(response?.success);
      const token =
        response?.token || response?.accessToken || response?.data?.token || response?.authToken;

      const devBypass = process.env.NODE_ENV !== "production" && otp === "123456";

      if (!serverVerified && !devBypass) {
        setError("Invalid OTP. Please try again.");
        return;
      }

      if (token) localStorage.setItem("token", token);

      localStorage.removeItem("pendingEmail");
      setOtpVerified(true);

      const redirectTo = localStorage.getItem("postOtpRedirect");
      localStorage.removeItem("postOtpRedirect");

      alert("OTP verified successfully!");
      navigate(redirectTo || (user ? `/${user.role}/dashboard` : "/login"), { replace: true });
    } catch (error) {
      console.error("OTP verification failed", error);
      const devBypass = process.env.NODE_ENV !== "production" && otp === "123456";
      if (devBypass) {
        localStorage.removeItem("pendingEmail");
        setOtpVerified(true);
        const redirectTo = localStorage.getItem("postOtpRedirect");
        localStorage.removeItem("postOtpRedirect");
        alert("OTP verified successfully!");
        navigate(redirectTo || (user ? `/${user.role}/dashboard` : "/login"), { replace: true });
        return;
      }
      setError("OTP verification failed. Please try again.");
    }
  };

  const handleResendOTP = async () => {
    try {
      await apiRequest("/auth/resend-otp", "POST", { email });
      alert("OTP resent to your email.");
    } catch (error) {
      console.error("Resend OTP failed", error);
      setError("Failed to resend OTP. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          OTP Verification
        </h2>

        {error && (
          <p className="text-red-600 mb-4 text-sm font-medium">
            {error}
          </p>
        )}

        <p className="text-sm text-gray-600 mb-4">
          Enter the 6-digit OTP sent to your email.
        </p>

        <input
          type="text"
          placeholder="Enter OTP"
          className="w-full border border-gray-300 p-2 mb-4 rounded text-black"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
          maxLength={6}
        />

        <button
          onClick={handleVerifyOTP}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition font-semibold mb-3"
        >
          Verify OTP
        </button>

        <button
          onClick={handleResendOTP}
          className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition font-semibold"
        >
          Resend OTP
        </button>

        {process.env.NODE_ENV !== "production" && (
          <p className="mt-4 text-xs text-gray-500">
            Dev tip: use <span className="font-mono">123456</span> if your backend OTP endpoint
            isn’t available.
          </p>
        )}
      </div>
    </div>
  );
}