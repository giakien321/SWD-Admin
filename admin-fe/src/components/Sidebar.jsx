import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, FlaskConical, CalendarDays, LogOut } from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-md transition ${
      isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col justify-between">
      <div>
        <h1 className="text-2xl font-bold p-5 text-blue-600">FPT Lab Admin</h1>
        <nav className="flex flex-col px-3 space-y-1">
          <NavLink to="/dashboard" className={linkClasses}>
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
          <NavLink to="/users" className={linkClasses}>
            <Users size={18} /> Users
          </NavLink>
          <NavLink to="/labs" className={linkClasses}>
            <FlaskConical size={18} /> Labs
          </NavLink>
          <NavLink to="/bookings" className={linkClasses}>
            <CalendarDays size={18} /> Bookings
          </NavLink>
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-100 border-t border-gray-200"
      >
        <LogOut size={18} /> Logout
      </button>
    </div>
  );
}
