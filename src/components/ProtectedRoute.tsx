import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode; 
  allowedRoles: string[] 
}) {
  const { user, otpVerified } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!otpVerified) {
    localStorage.setItem("postOtpRedirect", `/${user.role}/dashboard`);
    return <Navigate to="/otp-verification" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
