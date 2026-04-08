"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, Role } from "@/context/AuthContext";

export default function LoginPage() {
  const { login, setOtpVerified } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("citizen");
  const [error, setError] = useState("");

  const validateName = (value: string) =>
    /^[A-Z][a-zA-Z ]*$/.test(value);

  const validateEmail = (value: string) =>
    /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(value);

  const validatePassword = (value: string) => value.length >= 6;

  const handleLogin = () => {
    if (!validateName(name)) {
      setError("Name must start with a Capital letter.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Email must end with @gmail.com.");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 6 characters.");
      return;
    }

    login({ name, email, password, role });
    localStorage.setItem("postOtpRedirect", `/${role}/dashboard`);
    setOtpVerified(false);
    router.push("/otp-verification");
  };

  return (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-white dark:from-indigo-900 dark:via-purple-900 dark:to-black">
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-96">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        CitizenConnect Login
      </h2>

      {error && (
        <p className="text-red-600 mb-4 text-sm font-medium">
          {error}
        </p>
      )}

      <input
        type="text"
        placeholder="Full Name"
        className="w-full border border-gray-300 p-2 mb-3 rounded text-black"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="email"
        placeholder="Email (@gmail.com)"
        className="w-full border border-gray-300 p-2 mb-3 rounded text-black dark:text-white dark:bg-gray-700"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password (min 6 characters)"
        className="w-full border border-gray-300 p-2 mb-3 rounded text-black dark:text-white dark:bg-gray-700"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <select
        className="w-full border border-gray-300 p-2 mb-4 rounded text-black dark:text-white dark:bg-gray-700"
        value={role}
        onChange={(e) =>
          setRole(e.target.value as Role)
        }
      >
        <option value="citizen">Citizen</option>
        <option value="politician">Politician</option>
        <option value="moderator">Moderator</option>
        <option value="admin">Admin</option>
      </select>

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