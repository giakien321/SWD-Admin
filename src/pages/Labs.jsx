import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";

export default function Labs() {
  const [labs, setLabs] = useState([]);
  const [filteredLabs, setFilteredLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newLab, setNewLab] = useState({ name: "", location: "", capacity: "" });
  const [creating, setCreating] = useState(false);
  const [editingLab, setEditingLab] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchLabs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/labs");
      setLabs(res.data || []);
      setFilteredLabs(res.data || []);
    } catch (err) {
      console.error("Lỗi khi tải danh sách phòng lab:", err);
      setError("Không thể tải danh sách phòng lab. Vui lòng thử lại hoặc kiểm tra token.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabs();
  }, []);

  useEffect(() => {
    const filtered = labs.filter(
      (lab) =>
        lab.name.toLowerCase().includes(search.toLowerCase()) ||
        lab.location.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredLabs(filtered);
    setCurrentPage(1);
  }, [search, labs]);

  const handleCreateLab = async (e) => {
    e.preventDefault();
    if (!newLab.name || !newLab.location || !newLab.capacity) {
      alert("Vui lòng nhập đầy đủ thông tin phòng lab!");
      return;
    }

    try {
      setCreating(true);
      const res = await api.post("/labs", {
        name: newLab.name,
        location: newLab.location,
        capacity: parseInt(newLab.capacity),
      });

      setLabs((prev) => [...prev, res.data]);
      setNewLab({ name: "", location: "", capacity: "" });
      alert("Tạo phòng lab thành công!");
    } catch (err) {
      console.error("Lỗi khi tạo lab:", err);
      alert("Không thể tạo phòng lab. Vui lòng thử lại.");
    } finally {
      setCreating(false);
    }
  };

  const handleEditLab = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/labs/${editingLab._id}`, editingLab);
      setLabs((prev) =>
        prev.map((lab) => (lab._id === editingLab._id ? res.data : lab))
      );
      setEditingLab(null);
      alert("Cập nhật thông tin lab thành công!");
    } catch (err) {
      console.error("Lỗi khi cập nhật lab:", err);
      alert("Không thể cập nhật lab. Vui lòng thử lại.");
    }
  };

  const handleDeleteLab = async (labId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá phòng lab này không?")) return;
    try {
      setDeletingId(labId);
      await api.delete(`/labs/${labId}`);
      setLabs((prev) => prev.filter((lab) => lab._id !== labId));
      alert("🗑️ Xoá phòng lab thành công!");
    } catch (err) {
      console.error("Lỗi khi xoá lab:", err);
      alert("Không thể xoá phòng lab. Vui lòng thử lại.");
    } finally {
      setDeletingId(null);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredLabs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentLabs = filteredLabs.slice(startIndex, startIndex + itemsPerPage);

  const nextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const prevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-700">Lab Management</h1>

      <div className="flex items-center justify-between">
        <input
          type="text"
          placeholder="🔎 Tìm theo tên hoặc địa điểm..."
          className="border border-gray-300 rounded-md px-4 py-2 w-80 focus:ring focus:ring-blue-200"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <form
        onSubmit={handleCreateLab}
        className="bg-white shadow-md rounded-lg p-4 flex flex-wrap gap-4 items-end"
      >
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600">Lab Name</label>
          <input
            type="text"
            value={newLab.name}
            onChange={(e) => setNewLab({ ...newLab, name: e.target.value })}
            className="border border-gray-300 rounded-md px-3 py-2 w-48 focus:ring focus:ring-blue-200"
            placeholder="VD: AI Lab"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600">Location</label>
          <input
            type="text"
            value={newLab.location}
            onChange={(e) => setNewLab({ ...newLab, location: e.target.value })}
            className="border border-gray-300 rounded-md px-3 py-2 w-48 focus:ring focus:ring-blue-200"
            placeholder="VD: A-202"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600">Capacity</label>
          <input
            type="number"
            min="1"
            value={newLab.capacity}
            onChange={(e) => setNewLab({ ...newLab, capacity: e.target.value })}
            className="border border-gray-300 rounded-md px-3 py-2 w-28 focus:ring focus:ring-blue-200"
            placeholder="VD: 30"
          />
        </div>

        <button
          type="submit"
          disabled={creating}
          className="bg-blue-600 text-white font-medium px-5 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {creating ? "Đang tạo..." : "➕ Add Lab"}
        </button>
      </form>

      {loading ? (
        <p className="text-gray-500">Đang tải dữ liệu...</p>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      ) : filteredLabs.length === 0 ? (
        <p className="text-gray-500">Không tìm thấy phòng lab nào phù hợp.</p>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full border-collapse text-sm text-gray-700">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-2 border">#</th>
                  <th className="px-4 py-2 border">Lab Name</th>
                  <th className="px-4 py-2 border">Location</th>
                  <th className="px-4 py-2 border">Capacity</th>
                  <th className="px-4 py-2 border text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentLabs.map((lab, i) => (
                  <tr key={lab._id || i} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-2 border text-center">
                      {startIndex + i + 1}
                    </td>
                    <td className="px-4 py-2 border font-medium">{lab.name}</td>
                    <td className="px-4 py-2 border">{lab.location}</td>
                    <td className="px-4 py-2 border text-center">{lab.capacity}</td>
                    <td className="px-4 py-2 border text-center space-x-2">
                      <button
                        onClick={() => setEditingLab(lab)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition"
                      >
                        ✏ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteLab(lab._id)}
                        disabled={deletingId === lab._id}
                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 disabled:opacity-50 transition"
                      >
                        {deletingId === lab._id ? "..." : "🗑 Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-4">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50"
            >
              ← Previous
            </button>
            <span className="text-gray-600">
              Trang {currentPage} / {totalPages}
            </span>
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50"
            >
              Next →
            </button>
          </div>
        </>
      )}

      {editingLab && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              ✏ Chỉnh sửa phòng lab
            </h2>
            <form onSubmit={handleEditLab} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Lab Name</label>
                <input
                  type="text"
                  value={editingLab.name}
                  onChange={(e) => setEditingLab({ ...editingLab, name: e.target.value })}
                  className="border border-gray-300 rounded-md w-full px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Location</label>
                <input
                  type="text"
                  value={editingLab.location}
                  onChange={(e) => setEditingLab({ ...editingLab, location: e.target.value })}
                  className="border border-gray-300 rounded-md w-full px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Capacity</label>
                <input
                  type="number"
                  value={editingLab.capacity}
                  onChange={(e) => setEditingLab({ ...editingLab, capacity: e.target.value })}
                  className="border border-gray-300 rounded-md w-full px-3 py-2"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingLab(null)}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
