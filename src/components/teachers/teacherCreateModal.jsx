/* eslint-disable react/prop-types */
import { useState } from "react";
import { useCreateFacultyMutation } from "../../redux/features/api/faculty/facultyApi";
import FormActionButtons from "../../ui/button/formActionButtons";
import useFormSubmit from "../../hooks/useFormSubmit";
import FileUpload from "../course/input/fileUpload";
import { Image } from "lucide-react";
import { useUploadImageMutation } from "../../redux/features/api/upload/uploadApi";

const TeacherCreateModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    password: "",
    profile_picture: null,
    education: {
      hscName: "",
      hscPassingYear: "",
      mbbsName: "",
      session: "",
    },
    gender: "",
    status: "Active",
  });
  const [coverPhotoFile, setCoverPhotoFile] = useState(null);

  const [addFaculty, { isLoading }] = useCreateFacultyMutation();
  const [uploadImages] = useUploadImageMutation();
  const { handleSubmitForm } = useFormSubmit();

  if (!isOpen) return null;

  const handleChange = async (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setCoverPhotoFile(files[0])
      const formData = new FormData();
       formData.append("image", files[0]);
      const uploadedUrl = await uploadImages(formData); 
      
      setFormData((prev) => ({ ...prev, profile_picture: uploadedUrl?.data?.data?.secure_url }));
      return;
    }

    if (name in formData.education) {
      setFormData((prev) => ({
        ...prev,
        education: { ...prev.education, [name]: value },
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    handleSubmitForm({
      e,
      apiCall: addFaculty,
      data: formData,
      onSuccess: () => onClose(),
    });
  };

  const inputClass =
    "w-full border px-3 py-2 rounded dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-700";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-[90%] max-w-2xl shadow-xl overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Create Teacher
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name & Phone */}
          <div className="flex flex-col sm:flex-row gap-3">
            {[
              { label: "Name", name: "name", required: true },
              { label: "Phone", name: "phone", required: true },
            ].map((field) => (
              <div key={field.name} className="flex-1 flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {field.label} {field.required && "*"}
                </label>
                <input
                  type="text"
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            ))}
          </div>

          {/* Email & Password */}
          <div className="flex flex-col sm:flex-row gap-3">
            {[
              { label: "Email", name: "email", type: "email" },
              { label: "Password", name: "password", type: "password", required: true },
            ].map((field) => (
              <div key={field.name} className="flex-1 flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {field.label} {field.required && "*"}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            ))}
          </div>

          {/* Address & Gender */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div className="flex-1 flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          {/* Profile Picture & Status */}
        
          {/* Education */}
          <div className="flex flex-col sm:flex-row gap-3">
            {[
              { label: "HSC Institute", name: "hscName" },
              { label: "HSC Passing Year", name: "hscPassingYear" },
            ].map((field) => (
              <div key={field.name} className="flex-1 flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {field.label}
                </label>
                <input
                  type="text"
                  name={field.name}
                  value={formData.education[field.name]}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {[
              { label: "MBBS Institute", name: "mbbsName" },
              { label: "Session", name: "session" },
            ].map((field) => (
              <div key={field.name} className="flex-1 flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {field.label}
                </label>
                <input
                  type="text"
                  name={field.name}
                  value={formData.education[field.name]}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            ))}
          </div>
              <div className="flex flex-col sm:flex-row gap-3">
            <FileUpload
              label="Profile Picture"
              name="profile_picture"
              accept=".jpg,.jpeg,.png,.gif"
              onChange={handleChange}
              file={coverPhotoFile}
              maxSizeInfo="JPG, PNG, GIF (Max 5MB)"
              IconComponent={Image}
            />
           
          </div>

          {/* Submit */}
          <FormActionButtons
            onCancel={onClose}
            cancelText="Cancel"
            submitText="Create"
            submitColor="bg-green-500"
            isSubmitting={isLoading}
          />
        </form>
      </div>
    </div>
  );
};

export default TeacherCreateModal;
