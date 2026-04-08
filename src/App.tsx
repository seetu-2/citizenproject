import "./index.css";
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import OTPVerificationPage from "./pages/OTPVerificationPage";
import EnterEmailPage from "./pages/EnterEmailPage";
import CitizenDashboard from "./pages/CitizenDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PoliticianDashboard from "./pages/PoliticianDashboard";
import ModeratorDashboard from "./pages/ModeratorDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/otp-verification" element={<OTPVerificationPage />} />
      <Route path="/enter-email" element={<EnterEmailPage />} />

      <Route
        path="/citizen/dashboard"
        element={
          <ProtectedRoute allowedRoles={["citizen"]}>
            <CitizenDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/politician/dashboard"
        element={
          <ProtectedRoute allowedRoles={["politician"]}>
            <PoliticianDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/moderator/dashboard"
        element={
          <ProtectedRoute allowedRoles={["moderator"]}>
            <ModeratorDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
