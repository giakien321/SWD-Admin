import { GoogleLogin } from "@react-oauth/google";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLoginSuccess = async (response) => {
    try {
      setLoading(true);
      const token = response.credential;

      const res = await axios.post(
        "https://lab-booking-be-1.onrender.com/api/v1/auth/google",
        { token }
      );

      const user = res.data.user;
      const jwtToken = res.data.accessToken || res.data.token;

      if (!jwtToken) {
        throw new Error("Không nhận được JWT token từ backend!");
      }

      if (user.role !== "admin") {
        alert("Tài khoản của bạn không có quyền truy cập trang Admin.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", jwtToken);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Đăng nhập thất bại. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginError = () => {
    alert("Đăng nhập Google thất bại!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-lg rounded-2xl p-10 w-96 text-center"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-700">
          Admin Login
        </h2>

        {loading ? (
          <p className="text-gray-500">Đang đăng nhập...</p>
        ) : (
          <div className="flex justify-center mb-4">
            <GoogleLogin onSuccess={handleLoginSuccess} onError={handleLoginError} />
          </div>
        )}

        <p className="text-gray-500 text-sm">
          Only verified admin accounts can sign in.
        </p>
      </motion.div>
    </div>
  );
}
