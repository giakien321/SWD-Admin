import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get("/bookings");
        console.log("📦 API /bookings trả về:", res.data);

        const data = Array.isArray(res.data)
          ? res.data
          : res.data.bookings || [];

        setBookings(data);
      } catch (err) {
        console.error("❌ Lỗi khi fetch bookings:", err);
        setError("Không thể tải danh sách đặt phòng");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Bookings</h2>
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">User</th>
              <th className="px-4 py-2 border">Lab</th>
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Time Slot</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b, i) => (
              <tr key={b._id || i} className="hover:bg-gray-100">
                <td className="px-4 py-2 border">{i + 1}</td>
                <td className="px-4 py-2 border">{b.user?.name || b.userName}</td>
                <td className="px-4 py-2 border">{b.lab?.name || b.labName}</td>
                <td className="px-4 py-2 border">{b.date}</td>
                <td className="px-4 py-2 border">{b.timeSlot}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
