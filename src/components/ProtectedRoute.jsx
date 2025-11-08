import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("Không có token → chuyển hướng /login");
    return <Navigate to="/login" replace />;
  }
  return children;
}
