import React from "react";
import { Link } from "react-router-dom";

const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  onClick,
  disabled = false,
  isLoading = false,
  to,
  className = "",
  ...rest
}) => {
  // Determine button classes based on variant, size, and disabled state
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium shadow-sm focus:outline-none transition-colors";

  let variantClasses = "";
  switch (variant) {
    case "primary":
      variantClasses =
        "bg-[#FCA311] text-white hover:bg-[#FCA311]/90 focus:ring-2 focus:ring-offset-2 focus:ring-[#FCA311]/50";
      break;
    case "secondary":
      variantClasses =
        "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-[#14213D]/50";
      break;
    case "danger":
      variantClasses =
        "bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500";
      break;
    case "success":
      variantClasses =
        "bg-[#14213D] text-white hover:bg-[#14213D]/90 focus:ring-2 focus:ring-offset-2 focus:ring-[#14213D]/50";
      break;
    default:
      variantClasses =
        "bg-[#FCA311] text-white hover:bg-[#FCA311]/90 focus:ring-2 focus:ring-offset-2 focus:ring-[#FCA311]/50";
  }

  let sizeClasses = "";
  switch (size) {
    case "sm":
      sizeClasses = "px-3 py-1.5 text-sm";
      break;
    case "md":
      sizeClasses = "px-4 py-2 text-sm";
      break;
    case "lg":
      sizeClasses = "px-6 py-3 text-base";
      break;
    default:
      sizeClasses = "px-4 py-2 text-sm";
  }

  const disabledClasses =
    disabled || isLoading ? "opacity-60 cursor-not-allowed" : "";

  const buttonClasses =
    `${baseClasses} ${variantClasses} ${sizeClasses} ${disabledClasses} ${className}`.trim();

  // If to prop is provided, render a Link component
  if (to) {
    return (
      <Link to={to} className={buttonClasses} {...rest}>
        {children}
      </Link>
    );
  }

  // Otherwise, render a button element
  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
