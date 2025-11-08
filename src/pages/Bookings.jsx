import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("all"); // 🟢 bộ lọc trạng thái

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get("/bookings");
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

  const updateBookingStatus = async (id, status) => {
    try {
      await api.patch(`/bookings/${id}`, { status });
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status } : b))
      );
      setSelectedBooking((prev) =>
        prev && prev._id === id ? { ...prev, status } : prev
      );
      alert(`Booking đã được ${status === "approved" ? "duyệt" : "từ chối"}`);
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật trạng thái:", err);
      alert("Không thể cập nhật trạng thái booking");
    }
  };

  const openModal = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedBooking(null);
    setShowModal(false);
  };

  const filteredBookings =
    filter === "all"
      ? bookings
      : bookings.filter((b) => (b.status || "pending") === filter);

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Bookings</h2>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-md px-3 py-2 text-gray-700 shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">User</th>
              <th className="px-4 py-2 border">Lab</th>
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Time Slot</th>
              <th className="px-4 py-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length > 0 ? (
              filteredBookings.map((b, i) => (
                <tr
                  key={b._id || i}
                  className="hover:bg-gray-100 cursor-pointer"
                  onClick={() => openModal(b)}
                >
                  <td className="px-4 py-2 border">{i + 1}</td>
                  <td className="px-4 py-2 border">{b.user?.name || b.userName}</td>
                  <td className="px-4 py-2 border">{b.lab?.name || b.labName}</td>
                  <td className="px-4 py-2 border">{b.date}</td>
                  <td className="px-4 py-2 border">{b.timeSlot}</td>
                  <td
                    className={`px-4 py-2 border font-semibold ${
                      b.status === "approved"
                        ? "text-green-600"
                        : b.status === "rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {b.status || "pending"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  Không có booking nào phù hợp
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[420px] relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              ✕
            </button>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Booking Details
            </h3>
            <div className="space-y-2 text-gray-700">
              <p><strong>User:</strong> {selectedBooking.user?.name || "N/A"}</p>
              <p><strong>Email:</strong> {selectedBooking.user?.email || "N/A"}</p>
              <p><strong>Lab:</strong> {selectedBooking.lab?.name || "N/A"}</p>
              <p><strong>Date:</strong> {selectedBooking.date}</p>
              <p><strong>Time Slot:</strong> {selectedBooking.timeSlot}</p>
              <p><strong>Note:</strong> {selectedBooking.note || "Không có ghi chú"}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`font-bold ${
                    selectedBooking.status === "approved"
                      ? "text-green-600"
                      : selectedBooking.status === "rejected"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {selectedBooking.status || "pending"}
                </span>
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() =>
                  updateBookingStatus(selectedBooking._id, "approved")
                }
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
                disabled={selectedBooking.status === "approved"}
              >
                Approve
              </button>
              <button
                onClick={() =>
                  updateBookingStatus(selectedBooking._id, "rejected")
                }
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
                disabled={selectedBooking.status === "rejected"}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
