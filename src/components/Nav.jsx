import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { decodeJwt, logout } from "../lib/auth";
import { LayoutDashboard, Users, Building2, Book, LogOut } from "lucide-react";

export default function Nav() {
  const token = localStorage.getItem("accessToken");
  const user = decodeJwt(token);
  const navigate = useNavigate();

  const nav = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Users", path: "/users", icon: Users },
    { name: "Labs", path: "/labs", icon: Building2 },
    { name: "Bookings", path: "/bookings", icon: Book },
  ];

  return (
    <aside className="w-64 bg-white shadow h-screen fixed">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-blue-600">FPT Lab Admin</h2>
      </div>

      <nav className="p-4 space-y-2">
        {nav.map((n) => (
          <NavLink
            key={n.name}
            to={n.path}
            className={({isActive}) =>
              `flex items-center gap-3 px-4 py-2 rounded-md ${isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"}`
            }
          >
            <n.icon size={18} />
            <span>{n.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-0 w-full p-4 border-t">
        {user ? (
          <div className="flex items-center gap-3">
            <img src={user.picture} alt="avatar" className="w-10 h-10 rounded-full" />
            <div className="flex-1">
              <div className="font-semibold text-sm">{user.name}</div>
              <div className="text-xs text-gray-500">{user.email}</div>
            </div>
            <button className="text-red-600" onClick={() => { logout(); navigate("/login"); }}>
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <button onClick={() => navigate("/login")} className="w-full py-2 bg-blue-500 text-white rounded">Sign in</button>
        )}
      </div>
    </aside>
  );
}
