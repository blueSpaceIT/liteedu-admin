/* eslint-disable react/prop-types */
// src/components/InputGroup.jsx


const InputGroup = ({
  id,
  label,
  icon: Icon,
  type = "text",
  value,
  name,
  onChange,
  placeholder,
  required = false,
  accept,
  children,
}) => {
  return (
    <div className="relative">
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
      </label>
      <div className="pointer-events-none absolute inset-y-0 left-0 top-6 flex items-center pl-3">
        {Icon && <Icon size={20} className="text-gray-400" />}
      </div>
      {type === "select" ? (
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="mt-1 block w-full appearance-none rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          {children}
        </select>
      ) : type === "textarea" ? (
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          rows="3"
          placeholder={placeholder}
          required={required}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      ) : type === "file" ? (
        <input
          type="file"
          id={id}
          name={name}
          accept={accept}
          onChange={onChange}
          className="sr-only"
        />
      ) : (
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      )}
    </div>
  );
};

export default InputGroup;
