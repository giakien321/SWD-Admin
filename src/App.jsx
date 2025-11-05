import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Labs from "./pages/Labs";
import Bookings from "./pages/Bookings";
import ProtectedRoute from "./components/ProtectedRoute";
import SidebarLayout from "./components/SidebarLayout";

export default function App() {
  return (
    <Routes>
      {/* Trang login riêng biệt */}
      <Route path="/login" element={<Login />} />

      {/* Các trang cần đăng nhập */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <SidebarLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="labs" element={<Labs />} />
        <Route path="bookings" element={<Bookings />} />
      </Route>

      {/* Redirect mặc định */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
