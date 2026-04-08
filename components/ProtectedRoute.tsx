"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, Role } from "@/context/AuthContext";

export default function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: Role[];
}) {
  const { user, otpVerified } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (!otpVerified) {
      localStorage.setItem("postOtpRedirect", `/${user.role}/dashboard`);
      router.push("/otp-verification");
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      router.push("/login");
    }
  }, [user, otpVerified, allowedRoles, router]);

  if (!user || !otpVerified || !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}