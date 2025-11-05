import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";

export default function Labs() {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLabs = async () => {
      try {
        setLoading(true);
        const res = await api.get("/labs");
        setLabs(res.data || []);
      } catch (err) {
        console.error("❌ Lỗi khi tải danh sách phòng lab:", err);
        setError("Không thể tải danh sách phòng lab. Vui lòng thử lại hoặc kiểm tra token.");
      } finally {
        setLoading(false);
      }
    };

    fetchLabs();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-700">Lab Management</h1>

      {loading ? (
        <p className="text-gray-500">Đang tải dữ liệu...</p>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      ) : labs.length === 0 ? (
        <p className="text-gray-500">Chưa có phòng lab nào được tạo.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full border-collapse text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-2 border">#</th>
                <th className="px-4 py-2 border">Lab Name</th>
                <th className="px-4 py-2 border">Location</th>
                <th className="px-4 py-2 border">Capacity</th>
              </tr>
            </thead>
            <tbody>
              {labs.map((lab, i) => (
                <tr key={lab._id || i} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2 border text-center">{i + 1}</td>
                  <td className="px-4 py-2 border font-medium">{lab.name}</td>
                  <td className="px-4 py-2 border">{lab.location}</td>
                  <td className="px-4 py-2 border text-center">{lab.capacity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
