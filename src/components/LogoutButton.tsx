import { useAuth } from "../context/AuthContext";

export default function LogoutButton() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <button
      onClick={logout}
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition font-semibold"
    >
      Logout
    </button>
  );
}