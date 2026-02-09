import { useState, useRef, useEffect } from "react";

const StatusSelect = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const options = [
    { value: "pending", label: "Pending" },
    { value: "verified", label: "Verified" },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Custom select trigger */}
      <button
        type="button"
        className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-emerald-300 focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all text-lg text-left flex items-center justify-between group hover:border-emerald-200"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="truncate">
          {options.find((opt) => opt.value === value)?.label || "Pending"}
        </span>

        {/* Custom down chevron SVG - rotates on open */}
        <svg
          className={`w-5 h-5 ml-2 transition-all duration-200 ${
            isOpen
              ? "text-emerald-600 rotate-180"
              : "text-gray-500 group-hover:text-emerald-600"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown options */}
      <div
        className={`absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-2xl shadow-xl ${
          isOpen
            ? "opacity-100 scale-100 visible"
            : "opacity-0 scale-95 invisible"
        } transition-all duration-200 origin-top`}
      >
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className="w-full text-left px-4 py-3 text-lg hover:bg-emerald-50 hover:text-emerald-700 transition-all first:rounded-t-2xl last:rounded-b-2xl"
            onClick={() => {
              onChange(option.value);
              setIsOpen(false);
            }}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StatusSelect;
