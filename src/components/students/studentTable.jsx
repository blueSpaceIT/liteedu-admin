/* eslint-disable react/prop-types */
import StudentRow from "./studentRow";

const StudentTable = ({ students, page, limit }) => {
    return (
        <div className="mt-6 overflow-x-auto border border-gray-300 shadow-xl dark:border-gray-700">
            <table className="min-w-full table-auto border-collapse">
                <thead className="bg-gray-200 dark:bg-gray-700 dark:text-white">
                    <tr>
                        <th className="px-2 py-3 text-center">#</th>
                        <th className="px-2 py-3 text-left">Name</th>
                        <th className="px-2 py-3 text-left">Email</th>
                        <th className="px-2 py-3 text-left">Phone</th>
                        <th className="px-2 py-3 text-left">Guardian</th>
                        <th className="px-2 py-3 text-left">Guardian Phone</th>
                        <th className="px-2 py-3 text-left">Address</th>
                        <th className="px-2 py-3 text-left">SSC GPA</th>
                        <th className="px-2 py-3 text-left">HSC GPA</th>
                        <th className="px-2 py-3 text-center">Status</th>
                        <th className="px-2 py-3 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student, index) => (
                        <StudentRow
                            key={student._id}
                            student={student}
                            index={index}
                            page={page}
                            limit={limit}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StudentTable;
