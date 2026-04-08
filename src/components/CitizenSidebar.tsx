import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function CitizenSidebar() {
  const location = useLocation();
  const pathname = location.pathname;
  const [isOpen, setIsOpen] = useState(true);

  const navItems = [
    { name: "Dashboard", href: "/citizen/dashboard" },
    { name: "Raise Issue", href: "/citizen/raise-issue" },
    { name: "My Issues", href: "/citizen/my-issues" },
    { name: "Trending", href: "/citizen/trending" },
    { name: "Settings", href: "/citizen/settings" },
  ];

  return (
    <div className="h-screen w-64 bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white p-6 flex flex-col">
      <h1 className="text-xl font-bold mb-8">Citizen Panel</h1>

      <nav className="flex flex-col gap-3">
        {navItems.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.name}
              to={item.href}
              className={`px-4 py-2 rounded-lg transition ${
                active
                  ? "bg-purple-600"
                  : "hover:bg-white/10 text-gray-300"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto text-sm text-gray-400 pt-10">
        CitizenConnect © 2026
      </div>
    </div>
  );
}