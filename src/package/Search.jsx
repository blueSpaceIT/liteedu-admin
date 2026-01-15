/* eslint-disable react/prop-types */
"use client";

import { Loader2, SearchIcon } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

const Search = ({ setValue, loading }) => {
  const [inputValue, setInputValue] = useState("");

  const debounce = useCallback((callback, delay) => {
    const handler = setTimeout(callback, delay);
    return () => clearTimeout(handler);
  }, []);

  useEffect(() => {
    if (inputValue.trim() === "") {
      return;
    }
    return debounce(() => {
      setValue(inputValue);
    }, 1000);
  }, [inputValue, setValue, debounce]);

  return (
    <div className="relative w-full max-w-sm">
      {/* Search Icon */}
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-gray-500">
        <SearchIcon size={18} />
      </span>

      <input
        type="search"
        placeholder="Search..."
        aria-label="Search"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full py-2 pl-10 pr-10 text-gray-800 placeholder-gray-400 transition-all duration-200 bg-white border border-gray-300 rounded-lg shadow-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      {loading && (
        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-500">
          <Loader2 size={18} className="animate-spin" />
        </span>
      )}
    </div>
  );
};

export default Search;
