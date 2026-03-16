import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

function PasswordInput({
  value = "", // ✅ ADD THIS
  onChange, // ✅ ADD THIS
  placeholder = "Password", // ✅ ADD THIS
  ...props // ✅ FORWARD OTHER PROPS
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-full">
      <input
        type={showPassword ? "text" : "password"}
        value={value} // ✅ CONTROLLED INPUT
        onChange={onChange} // ✅ SEND VALUE TO PARENT
        placeholder={placeholder}
        className="w-full p-4 pr-12 border-2 border-gray-200 rounded-2xl focus:border-emerald-300 focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all text-lg"
        {...props} // ✅ FORWARD CLASSNAME ETC
      />
      <button
        type="button"
        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
}

export default PasswordInput;
