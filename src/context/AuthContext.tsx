import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export type Role =
  | "admin"
  | "moderator"
  | "citizen"
  | "politician";

type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

type AuthContextType = {
  user: User | null;
  otpVerified: boolean;
  login: (userData: User) => void;
  logout: () => void;
  setOtpVerified: (verified: boolean) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [otpVerified, setOtpVerifiedState] = useState<boolean>(() => {
    return localStorage.getItem("otpVerified") === "true";
  });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored auth user", error);
      }
    }
  }, []);

  const login = (userData: User) => {
    localStorage.setItem("authUser", JSON.stringify(userData));
    setUser(userData);
  };

  const setOtpVerified = (verified: boolean) => {
    localStorage.setItem("otpVerified", verified ? "true" : "false");
    setOtpVerifiedState(verified);
  };

  const logout = () => {
    localStorage.removeItem("authUser");
    localStorage.removeItem("token");
    localStorage.removeItem("otpVerified");
    localStorage.removeItem("pendingEmail");
    localStorage.removeItem("postOtpRedirect");
    setUser(null);
    setOtpVerifiedState(false);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, otpVerified, login, logout, setOtpVerified }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth must be used within AuthProvider");
  return context;
}
