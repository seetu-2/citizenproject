import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api/api";

export default function OTPVerificationPage() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const email = localStorage.getItem("pendingEmail");

  if (!email) {
    navigate("/login");
    return null;
  }

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      const response = await apiRequest("/auth/verify-otp", "POST", { otp, email });
      if (response.success) {
        localStorage.setItem("token", response.token);
        localStorage.removeItem("pendingEmail");

        // For demo, create user object
        const authenticatedUser = {
          id: email,
          name: email,
          email,
          role: "citizen", // Default role, adjust as needed
        };

        // We need to login here, but since AuthContext is not available, we'll navigate
        alert("OTP verified successfully!");
        navigate("/enter-email");
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("OTP verification failed", error);
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
      </div>
    </div>
  );
}