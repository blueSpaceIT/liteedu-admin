/* eslint-disable react/prop-types */
import { MdOutlineSegment } from "react-icons/md";
import { useGetAllSegmentQuery } from "../../../redux/features/api/segment/segmentApi";
import SegmentCardSmall from "./segmentCard";
import { Plus } from "lucide-react";
import { useGetAllModuleQuery } from "../../../redux/features/api/module/module";
import { useState } from "react";
import SegmentForm from "./segmentFrom";

const Segment = ({ courseId }) => {
  const { data, isLoading: segmentLoading, error } = useGetAllSegmentQuery({ courseId });
  const { data: moduleData, isLoading } = useGetAllModuleQuery({ courseId: courseId });

  // Modal open/close state
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading || segmentLoading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>Failed to load segments</h1>;
  }


  return (
    <div className="border p-5 my-5 rounded-md border-gray-300">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center text-gray-800 dark:text-gray-100">
          <MdOutlineSegment className="h-5 w-5 mr-2 text-primary" />
          Segment List
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-[rgb(95_113_250)] text-white hover:bg-[rgb(95_113_250)]/90 h-9 rounded-md px-3 flex items-center"
        >
          <Plus className="h-4 w-4 mr-1" />
          Create Segment
        </button>
      </div>

      {/* Segment List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5">
        {data?.data?.length > 0 ? (
          data.data.map((seg) => <SegmentCardSmall courseId={courseId} moduleData={moduleData?.data}   key={seg._id} segment={seg} />)
        ) : (
          <p>No segments found</p>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Create Segment</h3>

            {/* Form */}
        <SegmentForm courseId={courseId} moduleData={moduleData?.data}  onClose={() => setIsModalOpen(false)}  />
          </div>
        </div>
      )}
    </div>
  );
};

export default Segment;
