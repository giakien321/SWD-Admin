import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [stats, setStats] = useState({ users: 0, labs: 0, bookings: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Không tìm thấy token. Vui lòng đăng nhập lại.");
          return;
        }

        const [usersRes, labsRes, bookingsRes] = await Promise.all([
          axios.get("https://lab-booking-be-1.onrender.com/api/v1/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://lab-booking-be-1.onrender.com/api/v1/labs", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://lab-booking-be-1.onrender.com/api/v1/bookings", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const usersCount =
          Array.isArray(usersRes.data) ? usersRes.data.length :
          usersRes.data.users?.length || usersRes.data.total || 0;

        const labsCount =
          Array.isArray(labsRes.data) ? labsRes.data.length :
          labsRes.data.labs?.length || labsRes.data.total || 0;

        const bookingsCount =
          Array.isArray(bookingsRes.data) ? bookingsRes.data.length :
          bookingsRes.data.bookings?.length || bookingsRes.data.total || 0;

        setStats({
          users: usersCount,
          labs: labsCount,
          bookings: bookingsCount,
        });
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setError("Không thể tải dữ liệu dashboard. Kiểm tra lại quyền truy cập hoặc token.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-gray-500 text-lg animate-pulse">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-700 mb-4">Admin Dashboard</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-700">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
          <h3 className="text-sm text-gray-500">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats.users}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
          <h3 className="text-sm text-gray-500">Total Labs</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.labs}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
          <h3 className="text-sm text-gray-500">Total Bookings</h3>
          <p className="text-3xl font-bold text-orange-600 mt-2">{stats.bookings}</p>
        </div>
      </div>
    </div>
  );
}
