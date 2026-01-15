/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Upload } from "lucide-react";

const FileUpload = ({ label, name, file, onChange, accept, IconComponent, maxSizeInfo }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  // console.log("file",file)
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    if (typeof file === "string") {
      // URL হিসেবে ধরো
      setPreviewUrl(file);
    } else if (file instanceof File && file.type.startsWith("image/")) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreviewUrl(null);
    }
  }, [file]);

  const isImage = file && ((file instanceof File && file.type.startsWith("image/")) || typeof file === "string");

  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="flex w-full items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-4 dark:border-gray-600">
        <label htmlFor={name} className="flex cursor-pointer flex-col items-center justify-center text-center">
          {file ? (
            <>
              {isImage && previewUrl ? (
                <img
                  src={previewUrl}
                  alt="preview"
                  className="mb-2 max-h-40 w-auto rounded-md object-contain"
                />
              ) : (
                <IconComponent size={48} className="text-green-500" />
              )}
              <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                File selected: {typeof file === "string" ? previewUrl?.split("/").pop() : file.name}
              </p>
            </>
          ) : (
            <>
              <Upload size={32} className="text-gray-400 dark:text-gray-500" />
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold text-blue-600 dark:text-blue-400">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">{maxSizeInfo}</p>
            </>
          )}
          <input
            type="file"
            id={name}
            name={name}
            accept={accept}
            onChange={onChange}
            className="sr-only"
          />
        </label>
      </div>
    </div>
  );
};

export default FileUpload;
