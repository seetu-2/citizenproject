"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export type Role =
  | "admin"
  | "moderator"
  | "citizen"
  | "politician";

type User = {
  id: string;        // ✅ Added unique ID
  name: string;
  email: string;
  password: string;  // ✅ Added password field
  role: Role;
};

type AuthContextType = {
  user: User | null;
  otpVerified: boolean;
  login: (user: Omit<User, "id">) => void;
  logout: () => void;
  setOtpVerified: (verified: boolean) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [otpVerified, setOtpVerifiedState] = useState<boolean>(() => {
    return typeof window !== "undefined" && localStorage.getItem("otpVerified") === "true";
  });
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setOtpVerifiedState(localStorage.getItem("otpVerified") === "true");
  }, []);

  const login = (userData: Omit<User, "id">) => {
    const userWithId: User = {
      ...userData,
      id: userData.email, // ✅ Use email as unique ID
    };

    localStorage.setItem("authUser", JSON.stringify(userWithId));
    setUser(userWithId);
  };

  const setOtpVerified = (verified: boolean) => {
    localStorage.setItem("otpVerified", verified ? "true" : "false");
    setOtpVerifiedState(verified);
  };

  const logout = () => {
    localStorage.removeItem("authUser");
    localStorage.removeItem("otpVerified");
    localStorage.removeItem("postOtpRedirect");
    setUser(null);
    setOtpVerifiedState(false);
    router.push("/login");
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