/* eslint-disable react/prop-types */
import TeacherRow from "./teacherRow";

const TeacherTable = ({ teachers, onEdit, onDelete }) => {
    return (
        <div className="overflow-x-auto rounded-lg border border-gray-300 shadow dark:border-gray-700">
            <table className="min-w-full table-auto border-collapse">
                <thead className="bg-gray-200 dark:bg-gray-700 dark:text-white">
                    <tr>
                        <th className="px-2 py-3 text-center">#</th>
                        <th className="px-2 py-3 text-left">Name</th>
                        <th className="px-2 py-3 text-left">Phone</th>
                        <th className="px-2 py-3 text-left">Email</th>
                        <th className="px-2 py-3 text-left">Gender</th>
                        <th className="px-2 py-3 text-left">Education (HSC)</th>
                        <th className="px-2 py-3 text-left">Education (MBBS)</th>
                        <th className="px-2 py-3 text-left">Session</th>
                        <th className="px-2 py-3 text-center">Status</th>
                        <th className="px-2 py-3 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {teachers.map((teacher, index) => (
                        <TeacherRow
                            key={teacher._id}
                            teacher={teacher}
                            index={index}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TeacherTable;
