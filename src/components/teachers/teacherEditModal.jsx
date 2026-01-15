/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Image, X } from "lucide-react";
import FileUpload from "../course/input/fileUpload";
import { useUploadImageMutation } from "../../redux/features/api/upload/uploadApi";
import { useUpdateFacultyMutation } from "../../redux/features/api/faculty/facultyApi";
import FormActionButtons from "../../ui/button/formActionButtons";
import useFormSubmit from "../../hooks/useFormSubmit";

const EditTeacherModal = ({ isOpen, onClose, teacher }) => {
  const [coverPhotoFile, setCoverPhotoFile] = useState(null);
  const [uploadImages] = useUploadImageMutation();
  const [updateFaculty, { isLoading }] = useUpdateFacultyMutation();
  const { handleSubmitForm } = useFormSubmit();
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    profile_picture: "",
    gender: "",
    department: "",
    status: "Active",
    education: {
      hscName: "",
      hscPassingYear: "",
      mbbsName: "",
      session: "",
    },
    exprienced: 0,
  });

  useEffect(() => {
    if (teacher) {
      setCoverPhotoFile(teacher?.profile_picture)
      setFormData({
        ...teacher,
        profile_picture: teacher?.profile_picture,
        education: {
          hscName: teacher.education?.hscName || "",
          hscPassingYear: teacher.education?.hscPassingYear || "",
          mbbsName: teacher.education?.mbbsName || "",
          session: teacher.education?.session || "",
        },
      });
    }
  }, [teacher]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("education.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        education: { ...prev.education, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange =async (e) => {
    const file = e.target.files[0];
    if (file) {
        setCoverPhotoFile(file)
      const formData = new FormData();
       formData.append("image", file);
      const uploadedUrl = await uploadImages(formData); 
      
      setFormData((prev) => ({ ...prev, profile_picture: uploadedUrl?.data?.data?.secure_url }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
 /*    onUpdate(formData);
    onClose(); */
     handleSubmitForm({
      e,
      apiCall: updateFaculty,
      data: formData,
      params:{_id:teacher?._id},
      onSuccess: () => onClose(),
    });





  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-[90%] max-w-2xl shadow-xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Teacher</h2>
          <button onClick={onClose}>
            <X className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-300" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Name */}
          <label className="flex flex-col">
            <span className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Name *</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="px-3 py-2 border border-gray-300 rounded dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />
          </label>

          {/* Phone */}
          <label className="flex flex-col">
            <span className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Phone *</span>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="px-3 py-2 border border-gray-300 rounded dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />
          </label>

          {/* Email */}
          <label className="flex flex-col">
            <span className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Email</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="px-3 py-2 border border-gray-300 rounded dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />
          </label>

          {/* Password */}
          

          {/* Address */}
          <label className="flex flex-col">
            <span className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Address</span>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="px-3 py-2 border border-gray-300 rounded dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />
          </label>

         

          {/* Gender */}
          <label className="flex flex-col">
            <span className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Gender</span>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="px-3 py-2 border border-gray-300 rounded dark:bg-gray-800 dark:text-white dark:border-gray-700"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </label>

          {/* Department */}
          <label className="flex flex-col">
            <span className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Department</span>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="px-3 py-2 border border-gray-300 rounded dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />
          </label>

          {/* Status */}
          <label className="flex flex-col">
            <span className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Status</span>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="px-3 py-2 border border-gray-300 rounded dark:bg-gray-800 dark:text-white dark:border-gray-700"
            >
              <option value="Active">Active</option>
              <option value="Block">Block</option>
            </select>
          </label>

          {/* HSC Name */}
          <label className="flex flex-col">
            <span className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">HSC Institution Name</span>
            <input
              type="text"
              name="education.hscName"
              value={formData.education.hscName}
              onChange={handleChange}
              className="px-3 py-2 border border-gray-300 rounded dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />
          </label>

          {/* HSC Passing Year */}
          <label className="flex flex-col">
            <span className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">HSC Passing Year</span>
            <input
              type="text"
              name="education.hscPassingYear"
              value={formData.education.hscPassingYear}
              onChange={handleChange}
              className="px-3 py-2 border border-gray-300 rounded dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />
          </label>

          {/* MBBS Name */}
          <label className="flex flex-col">
            <span className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">MBBS Institution Name</span>
            <input
              type="text"
              name="education.mbbsName"
              value={formData.education.mbbsName}
              onChange={handleChange}
              className="px-3 py-2 border border-gray-300 rounded dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />
          </label>

          {/* Session */}
          <label className="flex flex-col">
            <span className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Session</span>
            <input
              type="text"
              name="education.session"
              value={formData.education.session}
              onChange={handleChange}
              className="px-3 py-2 border border-gray-300 rounded dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />
          </label>

          {/* Experience */}
          <label className="flex flex-col">
            <span className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Experience (Years)</span>
            <input
              type="number"
              name="exprienced"
              value={formData.exprienced}
              onChange={handleChange}
              className="px-3 py-2 border border-gray-300 rounded dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />
          </label>
           {/* Profile Picture Upload */}
            <FileUpload
              label="Profile Picture"
              name="profile_picture"
              accept=".jpg,.jpeg,.png,.gif"
              onChange={handleFileChange}
              file={coverPhotoFile}
              maxSizeInfo="JPG, PNG, GIF (Max 5MB)"
              IconComponent={Image}
            />
          {/* Submit Buttons */}
          <div className="flex justify-end col-span-2 gap-3 mt-4">
             <FormActionButtons
                     onCancel={onClose}
                     cancelText="Cancel"
                     submitText="Create"
                     submitColor="bg-green-500"
                     isSubmitting={isLoading}
                   />
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTeacherModal;
