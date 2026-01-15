/* eslint-disable react/prop-types */
const Button = ({
  onClick,
  children = "Button",     
  className = "",
  color = "blue",             
  size = "md",                
  disabled = false,
  type = "button",
}) => {
  // Size styles
  const sizeClass = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg",
  }[size];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        rounded-md font-semibold text-white transition-colors duration-200 
        focus:outline-none focus:ring-2 focus:ring-${color}-500 focus:ring-offset-2
        bg-${color}-600 hover:bg-${color}-700
        ${sizeClass} ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
