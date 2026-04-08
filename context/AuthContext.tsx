import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export type Role =
  | "admin"
  | "moderator"
  | "citizen"
  | "politician";

type User = {
  id: string;        // ✅ Added unique ID
  name: string;
  email: string;
  role: Role;
  password: string;
};

type AuthContextType = {
  user: User | null;
  login: (user: Omit<User, "id">) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData: Omit<User, "id">) => {
    const userWithId: User = {
      ...userData,
      id: userData.email, // ✅ Use email as unique ID
    };

    localStorage.setItem("authUser", JSON.stringify(userWithId));
    setUser(userWithId);
  };

  const logout = () => {
    localStorage.removeItem("authUser");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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