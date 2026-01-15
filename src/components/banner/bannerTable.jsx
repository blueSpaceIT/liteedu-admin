/* eslint-disable react/prop-types */
import BannerRow from "./bannerRow";

const BannerTable = ({ banners, onEdit, onDelete }) => {
    return (
        <div className="overflow-x-auto rounded-lg border border-gray-300 shadow dark:border-gray-700">
            <table className="min-w-full table-auto border-collapse">
                <thead className="bg-gray-200 dark:bg-gray-700 dark:text-white">
                    <tr>
                        <th className="px-2 py-3 text-center">Position</th>
                        <th className="px-2 py-3 text-left">Image</th>
                        <th className="px-2 py-3 text-center">Status</th>
                        <th className="px-2 py-3 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {banners?.map((banner) => (
                        <BannerRow
                            key={banner._id}
                            banner={banner}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BannerTable;
