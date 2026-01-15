/* eslint-disable react/prop-types */
import { Clock, DollarSign, Percent,  CircleCheckBig, Calendar } from "lucide-react";

export default function CourseInfoCard({ course }) {
  return (
    <div className="card p-6 sticky top-6">
      <h2 className="text-xl font-semibold mb-4">Course Information</h2>

      <div className="space-y-4">
        {/* Duration */}
        <div className="flex items-start">
          <div className="bg-primary-50 p-2 rounded-full mr-3">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Duration</p>
            <p className="font-medium">{course?.duration}</p>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-start">
          <div className="bg-primary-50 p-2 rounded-full mr-3">
            <DollarSign className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Price</p>
            <p className="font-medium">৳{course?.price}</p>
          </div>
        </div>

        {/* Offer Price */}
        <div className="flex items-start">
          <div className="bg-primary-50 p-2 rounded-full mr-3">
            <Percent className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Offer Price</p>
            <p className="font-medium">৳{course?.offerPrice || 0}</p>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-start">
          <div className="bg-primary-50 p-2 rounded-full mr-3">
            <CircleCheckBig className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className="font-medium capitalize">{course?.status}</p>
          </div>
        </div>

        {/* Pre-order */}
        <div className="flex items-start">
          <div className="bg-primary-50 p-2 rounded-full mr-3">
            <Calendar className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Created At</p>
            <p className="font-medium capitalize">{course?.createdAt}</p>
          </div>
        </div>
      </div>

      {/* Details Button */}
      <br />
      <a href={`/admin/course/course-details/${course?.slug}`}>
        <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[rgb(95_113_250)] text-white px-4 py-2">
          Go To Details
        </button>
      </a>
    </div>
  );
}
