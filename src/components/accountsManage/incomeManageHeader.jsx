/* eslint-disable react/prop-types */
const IncomeManageHeader = ({
    selectedTab,
    setSelectedTab,
    tabs,
    createExpen,
    setCreateExpen,
    setFromDate,
    fromDate,
    setToDate,
    toDate,
    clearFilters,
}) => {
    return (
        <section className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="flex flex-wrap justify-start items-center gap-10">
                    <div>
                        <h1 className="text-4xl font-bold capitalize"> {selectedTab} Management</h1>
                        <p>Manage offline students, payments and financial summary</p>
                    </div>

                    <section className="flex items-center justify-between gap-2">
                        <div className="flex gap-2">
                            {tabs?.map((tab) => (
                                <button
                                    key={tab.value}
                                    onClick={() => setSelectedTab(tab.value)}
                                    className={`rounded px-4 py-2 text-white ${selectedTab === tab.value ? "bg-blue-700" : "bg-blue-400 hover:bg-blue-700"}`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                            <button
                                onClick={() => setCreateExpen(!createExpen)}
                                className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                            >
                                + Add Expens
                            </button>
                        </div>
                    </section>
                </div>
                <div className="flex flex-wrap items-end gap-4">
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">From Date</label>
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-all focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:border-blue-400"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">To Date</label>
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-all focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:border-blue-400"
                        />
                    </div>

                    <button
                        onClick={clearFilters}
                        className="mt-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-red-600 active:scale-95 dark:bg-red-600 dark:hover:bg-red-500"
                    >
                        Clear
                    </button>
                </div>
            </div>
        </section>
    );
};
export default IncomeManageHeader;
