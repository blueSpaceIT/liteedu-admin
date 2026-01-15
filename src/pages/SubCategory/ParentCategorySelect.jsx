/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

export default function ParentCategorySelect({ value, onChange, placeholder, disabled }) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch("https://api.liteedu.com/api/v1/coursecategory");
        const json = await res.json();
        if (!mounted) return;
        setOptions(json?.data || []);
      } catch {
        setOptions([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled || loading}
      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700"
    >
      <option value="">{placeholder || "All parents"}</option>
      {options.map((opt) => (
        <option key={opt._id} value={opt._id}>
          {opt.title} {opt.year ? `(${opt.year})` : ""}
        </option>
      ))}
    </select>
  );
}
