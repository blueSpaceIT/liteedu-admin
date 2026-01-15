/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import ParentCategorySelect from "./ParentCategorySelect";

export default function SubcategoryForm({ initialData, onClose, onSaved }) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [parentId, setParentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setSlug(initialData.slug || "");
      setDescription(initialData.description || "");
      setParentId(initialData.parentId?._id || initialData.parentId || "");
    } else {
      setName("");
      setSlug("");
      setDescription("");
      setParentId("");
      setError(null);
    }
  }, [initialData]);

  function toSlug(value) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  function handleName(e) {
    const v = e.target.value;
    setName(v);
    setSlug(toSlug(v));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    if (!description.trim()) {
      setError("Description is required");
      return;
    }
    if (!parentId) {
      setError("Parent is required");
      return;
    }
    const payload = { slug, name, description, parentId };
    setLoading(true);
    try {
      let res;
      if (initialData && initialData._id) {
        res = await fetch(`https://api.liteedu.com/api/v1/sub-category/${initialData._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ body: payload }),
        });
      } else {
        res = await fetch("https://api.liteedu.com/api/v1/sub-category/create-subcategory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload ),
        });
      }
      const data = await res.json();
      if (!res.ok) {
        setError(data?.message || "Save failed");
      } else {
        onSaved && onSaved(data);
        onClose && onClose();
      }
    } catch (err) {
      setError(err?.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="relative z-50 w-full max-w-xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">{initialData ? "Edit Subcategory" : "Add Subcategory"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Name</label>
            <input
              value={name}
              onChange={handleName}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Slug</label>
            <input
              value={slug}
              onChange={(e) => setSlug(toSlug(e.target.value))}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Parent Category</label>
            <ParentCategorySelect value={parentId} onChange={setParentId} placeholder="Select parent category" />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200">
              Cancel
            </button>
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
        </form>
      </div>
    </div>
  );
}
