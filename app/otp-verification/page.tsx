"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export default function OTPVerificationPage() {
  const router = useRouter();
  const { user, setOtpVerified } = useAuth();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState(false);

  const email = useMemo(() => user?.email || "", [user?.email]);

  useEffect(() => {
    if (!email) router.replace("/login");
  }, [email, router]);

  const redirectAfterOtp = () => {
    const redirectTo = localStorage.getItem("postOtpRedirect");
    localStorage.removeItem("postOtpRedirect");
    router.replace(redirectTo || (user ? `/${user.role}/dashboard` : "/login"));
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    setError("");
    setIsVerifying(true);
    try {
      // Backend is not modified. If the endpoint exists, we'll use it.
      const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp, email }),
      });

      const data = await res.json().catch(() => ({}));
      const serverVerified = Boolean(res.ok && data?.success);

      const devBypass = process.env.NODE_ENV !== "production" && otp === "123456";
      if (!serverVerified && !devBypass) {
        setError("Invalid OTP. Please try again.");
        return;
      }

      if (data?.token) localStorage.setItem("token", data.token);
      setOtpVerified(true);
      redirectAfterOtp();
    } catch {
      const devBypass = process.env.NODE_ENV !== "production" && otp === "123456";
      if (devBypass) {
        setOtpVerified(true);
        redirectAfterOtp();
        return;
      }
      setError("OTP verification failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setError("");
    try {
      await fetch(`${API_BASE_URL}/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      setError("Failed to resend OTP. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-white dark:from-indigo-900 dark:via-purple-900 dark:to-black">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-96">
        <h2 className="text-2xl font-bold mb-2 text-center text-gray-800 dark:text-white">
          OTP Verification
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 text-center">
          Enter the 6-digit OTP sent to <span className="font-semibold">{email}</span>.
        </p>

        {error && (
          <p className="text-red-600 mb-4 text-sm font-medium">
            {error}
          </p>
        )}

        <input
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="Enter OTP"
          className="w-full border border-gray-300 p-2 mb-4 rounded text-black dark:text-white dark:bg-gray-700"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
          maxLength={6}
        />

        <button
          onClick={handleVerify}
          disabled={isVerifying}
          className="w-full bg-indigo-600 disabled:opacity-60 text-white py-2 rounded hover:bg-indigo-700 transition font-semibold mb-3"
        >
          {isVerifying ? "Verifying..." : "Verify OTP"}
        </button>

        <button
          onClick={handleResend}
          className="w-full bg-gray-700 text-white py-2 rounded hover:bg-gray-800 transition font-semibold"
        >
          Resend OTP
        </button>

        {process.env.NODE_ENV !== "production" && (
          <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            Dev tip: use <span className="font-mono">123456</span> if the OTP API isn’t available.
          </p>
        )}
      </div>
    </div>
  );
}

