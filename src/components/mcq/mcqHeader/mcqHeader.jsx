/* eslint-disable react/prop-types */
import { SearchIcon, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const McqHeader = ({ onCreateClick, onBulkClick, searchValue, setSearchValue, loading, categories = [], selectedCategory, setSelectedCategory }) => {
    return (
        <div className="w-full rounded-md bg-gray-200 p-4 dark:bg-gray-600">
            {/* First Row: Buttons */}
            <div className="flex flex-wrap justify-between gap-3">
                <button
                    onClick={onBulkClick}
                    className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                >
                    Bulk Upload
                </button>
              <div className="flex gap-5">
                  <Link to={"/mcq-category"}
                    onClick={onCreateClick}
                    className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                >
                    MCQ Category
                </Link>
                <button
                    onClick={onCreateClick}
                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    Create MCQ
                </button>
              </div>
            </div>

            {/* Second Row: Search + Category Filter */}
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                {/* Search */}
                <div className="relative w-full sm:w-64">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-gray-500">
                        <SearchIcon size={18} />
                    </span>
                    <input
                        type="search"
                        placeholder="Search..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-10 text-gray-800 placeholder-gray-400 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500"
                    />
                    {loading && (
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-500">
                            <Loader2
                                size={18}
                                className="animate-spin"
                            />
                        </span>
                    )}
                </div>

                {/* Category Filter */}
                {categories.length > 0 && (
                    <select
                        value={selectedCategory || ""}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-blue-400"
                    >
                        <option value="">All Categories</option>
                        {categories.map((cat) => (
                            <option
                                key={cat._id}
                                value={cat._id}
                            >
                                {cat.title}
                            </option>
                        ))}
                    </select>
                )}
            </div>
        </div>
    );
};

export default McqHeader;
