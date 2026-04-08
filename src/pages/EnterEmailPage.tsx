import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, Role } from "../context/AuthContext";
import { apiRequest } from "../api/api";

export default function EnterEmailPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (value: string) =>
    /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(value);

  const handleSubmitEmail = async () => {
    if (!validateEmail(email)) {
      setError("Email must end with @gmail.com.");
      return;
    }

    try {
      const response = await apiRequest("/auth/update-email", "POST", { email });
      if (response.success) {
        const authenticatedUser = {
          id: email,
          name: email,
          email,
          role: "citizen" as Role,
        };
        login(authenticatedUser);

        alert("Email updated successfully!");
        navigate(`/${authenticatedUser.role}/dashboard`);
      } else {
        setError("Failed to update email. Please try again.");
      }
    } catch (error) {
      console.error("Update email failed", error);
      setError("Failed to update email. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Enter Your Email
        </h2>

        {error && (
          <p className="text-red-600 mb-4 text-sm font-medium">
            {error}
          </p>
        )}

        <p className="text-sm text-gray-600 mb-4">
          Please enter your email address.
        </p>

        <input
          type="email"
          placeholder="Email (@gmail.com)"
          className="w-full border border-gray-300 p-2 mb-4 rounded text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleSubmitEmail}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition font-semibold"
        >
          Submit Email
        </button>
      </div>
    </div>
  );
}