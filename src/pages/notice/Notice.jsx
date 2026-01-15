/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const API_BASE = "https://api.liteedu.com/api/v1/notification";

export default function NoticePage() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newNotice, setNewNotice] = useState({
    title: "",
    message: "",
    link: "",
    status: "Published",
    expiresAt: "",
    isExpire: false,
  });

  const [editingNotice, setEditingNotice] = useState(null);

  // Fetch notices
  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_BASE);
      const data = await res.json();
      setNotices(data.data || []);
    } catch (err) {
      setError("Failed to fetch notifications");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  // Add new notice
  const handleAddNotice = async (e) => {
    e.preventDefault();

    if (!newNotice.link.trim()) {
      toast.error("Link is required!");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/create-notification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNotice),
      });

      if (!res.ok) {
        toast.error("Failed to create notice");
        return;
      }

      toast.success("Notice created successfully");

      setNewNotice({
        title: "",
        message: "",
        link: "",
        status: "Published",
        expiresAt: "",
        isExpire: false,
      });

      fetchNotices();
    } catch (err) {
      toast.error("Error creating notice");
    }
  };

  // Update notice
  const handleUpdateNotice = async () => {
    if (!editingNotice) return;

    if (!editingNotice.link || editingNotice.link.trim() === "") {
      toast.error("Link is required!");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/${editingNotice.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingNotice),
      });

      if (!res.ok) {
        toast.error("Update failed");
        return;
      }

      toast.success("Notice updated successfully");
      setEditingNotice(null);
      fetchNotices();
    } catch (err) {
      toast.error("Failed to update notice");
    }
  };

  // Delete notice
  const handleDeleteNotice = async (slug) => {
    if (!window.confirm("Are you sure to delete this notice?")) return;

    try {
      await fetch(`${API_BASE}/${slug}`, { method: "DELETE" });

      toast.success("Notice deleted");
      fetchNotices();
    } catch (err) {
      toast.error("Failed to delete notice");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 dark:text-gray-100">Notice Board</h1>

      {/* Add Notice Form */}
      <div className="mb-6 p-4 border rounded bg-white dark:bg-gray-800 dark:border-gray-700">
        <h2 className="font-semibold mb-2 dark:text-gray-200">Add New Notice</h2>

        <form onSubmit={handleAddNotice} className="space-y-2">
          <input
            type="text"
            placeholder="Title"
            value={newNotice.title}
            onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
            className="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-700 dark:text-white"
            required
          />

          <textarea
            placeholder="Message"
            value={newNotice.message}
            onChange={(e) =>
              setNewNotice({ ...newNotice, message: e.target.value })
            }
            className="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-700 dark:text-white"
            required
          />

          <input
            type="text"
            placeholder="Link (required)"
            value={newNotice.link}
            onChange={(e) =>
              setNewNotice({ ...newNotice, link: e.target.value })
            }
            className={`w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-700 dark:text-white ${
              !newNotice.link ? "border-red-500" : ""
            }`}
            required
          />

          <select
            value={newNotice.status}
            onChange={(e) =>
              setNewNotice({ ...newNotice, status: e.target.value })
            }
            className="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-700 dark:text-white"
          >
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>

          <input
            type="date"
            value={newNotice.expiresAt}
            onChange={(e) =>
              setNewNotice({ ...newNotice, expiresAt: e.target.value })
            }
            className="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-700 dark:text-white"
          />

          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:brightness-95"
          >
            Add Notice
          </button>
        </form>
      </div>

      {/* Notices Table */}
      {loading ? (
        <div className="text-gray-200">Loading...</div>
      ) : error ? (
        <div className="text-red-400">{error}</div>
      ) : notices.length === 0 ? (
        <div className="dark:text-gray-300">No notices found.</div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 border dark:border-gray-700 rounded shadow">
          <table className="min-w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/70 dark:text-gray-200">
                <th className="p-3">#</th>
                <th className="p-3">Title</th>
                <th className="p-3">Message</th>
                <th className="p-3">Status</th>
                <th className="p-3">Expiry</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {notices.map((n, i) => (
                <tr
                  key={n._id}
                  className={`border-t dark:border-gray-700 ${
                    i % 2 === 0
                      ? "bg-white dark:bg-gray-800"
                      : "bg-gray-50 dark:bg-gray-900/80"
                  }`}
                >
                  <td className="p-3">{i + 1}</td>
                  <td className="p-3 dark:text-gray-200">{n.title}</td>
                  <td className="p-3 dark:text-gray-300">{n.message}</td>
                  <td className="p-3 dark:text-gray-300">{n.status}</td>
                  <td className="p-3 dark:text-gray-300">
                    {n.expiresAt
                      ? new Date(n.expiresAt).toLocaleDateString()
                      : "-"}
                  </td>

                  <td className="p-3 flex gap-2">
                    <button
                      className="px-2 py-1 bg-yellow-400 rounded hover:brightness-95"
                      onClick={() => setEditingNotice({ ...n })}
                    >
                      Edit
                    </button>

                    <button
                      className="px-2 py-1 bg-red-500 text-white rounded hover:brightness-95"
                      onClick={() => handleDeleteNotice(n.slug)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editingNotice && (
        <div className="fixed inset-0 bg-black/40 flex items-start justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded shadow-lg mt-8 p-4">
            <h2 className="text-lg font-semibold mb-2 dark:text-gray-200">
              Edit Notice
            </h2>

            <input
              type="text"
              value={editingNotice.title}
              onChange={(e) =>
                setEditingNotice({ ...editingNotice, title: e.target.value })
              }
              className="w-full p-2 border rounded mb-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
            />

            <textarea
              value={editingNotice.message}
              onChange={(e) =>
                setEditingNotice({ ...editingNotice, message: e.target.value })
              }
              className="w-full p-2 border rounded mb-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
            />

            <input
              type="text"
              value={editingNotice.link}
              onChange={(e) =>
                setEditingNotice({ ...editingNotice, link: e.target.value })
              }
              className={`w-full p-2 border rounded mb-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white ${
                !editingNotice.link ? "border-red-500" : ""
              }`}
              required
            />

            <select
              value={editingNotice.status}
              onChange={(e) =>
                setEditingNotice({
                  ...editingNotice,
                  status: e.target.value,
                })
              }
              className="w-full p-2 border rounded mb-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
            >
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>

            <input
              type="date"
              value={
                editingNotice.expiresAt
                  ? new Date(editingNotice.expiresAt)
                      .toISOString()
                      .split("T")[0]
                  : ""
              }
              onChange={(e) =>
                setEditingNotice({
                  ...editingNotice,
                  expiresAt: e.target.value,
                })
              }
              className="w-full p-2 border rounded mb-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingNotice(null)}
                className="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdateNotice}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:brightness-95"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
