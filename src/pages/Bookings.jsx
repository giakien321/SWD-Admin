import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null); // modal
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token not found, please login again!");

        const res = await api.get("/bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data.bookings || [];
        setBookings(data);
      } catch (err) {
        console.error("Lỗi khi tải danh sách bookings:", err);
        setError("Không thể tải danh sách bookings. Kiểm tra token hoặc quyền admin.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleStatusChange = async (id, status) => {
    const confirm = window.confirm(`Bạn có chắc muốn ${status} booking này?`);
    if (!confirm) return;

    try {
      setUpdating(true);
      const token = localStorage.getItem("token");

      const res = await api.patch(
        `/bookings/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`Booking ${status}!`);
      setBookings((prev) =>
        prev.map((b) =>
          b._id === id ? { ...b, status: res.data.booking.status } : b
        )
      );
      setSelectedBooking(null);
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái:", err);
      alert("Không thể cập nhật trạng thái. Vui lòng kiểm tra quyền admin hoặc token.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p className="p-6 text-gray-600">Đang tải dữ liệu...</p>;
  if (error)
    return (
      <div className="p-6 text-red-600 font-medium">
        {error}
      </div>
    );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-700">Bookings Management</h1>

      {bookings.length === 0 ? (
        <p className="text-gray-500">Không có dữ liệu đặt phòng.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full table-auto border-collapse text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-2 border">#</th>
                <th className="px-4 py-2 border">User</th>
                <th className="px-4 py-2 border">Lab</th>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Time</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, i) => (
                <tr
                  key={b._id || i}
                  className="hover:bg-gray-50 transition cursor-pointer text-center"
                  onClick={() => setSelectedBooking(b)}
                >
                  <td className="px-4 py-2 border">{i + 1}</td>
                  <td className="px-4 py-2 border">
                    {b.user?.name || "N/A"}
                    <div className="text-xs text-gray-500">{b.user?.email}</div>
                  </td>
                  <td className="px-4 py-2 border">{b.lab?.name || "N/A"}</td>
                  <td className="px-4 py-2 border">{b.date}</td>
                  <td className="px-4 py-2 border">
                    {b.startTime && b.endTime
                      ? `${b.startTime} - ${b.endTime}`
                      : "N/A"}
                  </td>
                  <td
                    className={`px-4 py-2 border font-semibold ${
                      b.status === "approved"
                        ? "text-green-600"
                        : b.status === "rejected"
                        ? "text-red-500"
                        : "text-yellow-500"
                    }`}
                  >
                    {b.status}
                  </td>
                  <td className="px-4 py-2 border">
                    <button className="text-blue-600 hover:underline text-sm">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[420px] relative">
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Booking Details
            </h2>

            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium text-gray-600">User:</span>{" "}
                {selectedBooking.user?.name} ({selectedBooking.user?.email})
              </p>
              <p>
                <span className="font-medium text-gray-600">Lab:</span>{" "}
                {selectedBooking.lab?.name} - {selectedBooking.lab?.location}
              </p>
              <p>
                <span className="font-medium text-gray-600">Subject Code:</span>{" "}
                {selectedBooking.subjectCode || "N/A"}
              </p>
              <p>
                <span className="font-medium text-gray-600">Date:</span>{" "}
                {selectedBooking.date}
              </p>
              <p>
                <span className="font-medium text-gray-600">Time Slot:</span>{" "}
                {selectedBooking.startTime && selectedBooking.endTime
                  ? `${selectedBooking.startTime} - ${selectedBooking.endTime}`
                  : "N/A"}
              </p>
              <p>
                <span className="font-medium text-gray-600">Status:</span>{" "}
                <span
                  className={`font-semibold ${
                    selectedBooking.status === "approved"
                      ? "text-green-600"
                      : selectedBooking.status === "rejected"
                      ? "text-red-500"
                      : "text-yellow-500"
                  }`}
                >
                  {selectedBooking.status}
                </span>
              </p>
            </div>

            {selectedBooking.status === "pending" && (
              <div className="mt-6 flex justify-between">
                <button
                  disabled={updating}
                  onClick={() =>
                    handleStatusChange(selectedBooking._id, "approved")
                  }
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                >
                  {updating ? "Đang xử lý..." : "Approve"}
                </button>
                <button
                  disabled={updating}
                  onClick={() =>
                    handleStatusChange(selectedBooking._id, "rejected")
                  }
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
