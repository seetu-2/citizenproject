import { apiRequest } from "../api/api";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, Role } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<Role>("citizen");
  const [error, setError] = useState("");

  const validateEmail = (value: string) =>
    /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(value);

  const validatePassword = (value: string) => {
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(value);
  };

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      setError("Email must end with @gmail.com.");
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special character (@$!%*?&)."
      );
      return;
    }

    try {
      const response = await apiRequest("/auth/login", "POST", {
        email,
        password,
      });

      const token =
        typeof response === "string"
          ? response
          : response?.token ||
            response?.accessToken ||
            response?.data?.token ||
            response?.authToken;

      if (!token) {
        // For OTP flow, token might not be returned yet
        localStorage.setItem("pendingEmail", email);
        alert("OTP sent to your email. Please verify.");
        navigate("/otp-verification");
        return;
      }

      localStorage.setItem("token", token);

      const authenticatedUser = {
        id: email,
        name: email,
        email,
        role,
      };

      login(authenticatedUser);

      alert("Login successful!");
      navigate(`/${authenticatedUser.role}/dashboard`);
    } catch (error) {
      console.error("Login failed", error);
      setError(
        error instanceof Error
          ? error.message
          : "Login failed. Please check your credentials and try again."
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          CitizenConnect Login
        </h2>

        {error && (
          <p className="text-red-600 mb-4 text-sm font-medium">
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Email (@gmail.com)"
          className="w-full border border-gray-300 p-2 mb-3 rounded text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="relative mb-3">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full border border-gray-300 p-2 rounded text-black pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 text-gray-600 hover:text-gray-800"
          >
            {showPassword ? "👁️" : "👁️‍🗨️"}
          </button>
        </div>

        <p className="text-xs text-gray-600 mb-3 p-2 bg-gray-100 rounded">
          Password must contain: 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special char (@$!%*?&)
        </p>

        <select
          className="w-full border border-gray-300 p-2 mb-4 rounded text-black"
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
        >
          <option value="citizen">Citizen</option>
          <option value="politician">Politician</option>
          <option value="moderator">Moderator</option>
          <option value="admin">Admin</option>
        </select>

        <p className="mt-3 text-sm text-center text-gray-600">
          Don't have an account?{' '}
          <a href="/signup" className="text-indigo-600 hover:underline">
            Sign up
          </a>
        </p>

        <button
          onClick={handleLogin}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition font-semibold"
        >
          Login
        </button>
      </div>
    </div>
  );
}
