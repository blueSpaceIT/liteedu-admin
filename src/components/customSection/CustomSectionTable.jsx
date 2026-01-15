/* eslint-disable react/prop-types */

import CustomSectionRow from "./CustomSectionRow";

const CustomSectionTable = ({ sections, refetch }) => {
    if (!sections || sections.length === 0) return <p className="py-[20%] text-center text-xl text-gray-500">No Custom Sections found.</p>;

    return (
        <div className="mt-6 overflow-x-auto border border-gray-300 shadow-xl dark:border-gray-700">
            <table className="min-w-full table-auto border-collapse">
                <thead className="bg-gray-200 dark:bg-gray-700 dark:text-white">
                    <tr>
                        <th className="px-2 py-3 text-center">#</th>
                        <th className="px-2 py-3 text-left">Title</th>
                        <th className="px-2 py-3 text-left">Description</th>
                        <th className="px-2 py-3 text-left">CTA</th>
                        <th className="px-2 py-3 text-left">Status</th>
                        <th className="px-2 py-3 text-left">Created At</th>
                        <th className="px-2 py-3 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sections.map((section, index) => (
                        <CustomSectionRow
                            key={section._id}
                            section={section}
                            index={index}
                            refetch={refetch} 
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CustomSectionTable;
