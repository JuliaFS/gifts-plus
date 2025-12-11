import React, { useState } from "react";

interface FloatingInputProps {
  label: string;
  value: string;
  setter: (val: string) => void;
  type?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export default function FloatingInput({
  label,
  value,
  setter,
  type = "text",
  icon,
  rightIcon,
}: FloatingInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  // Determine if label should be visible
  const showLabel = isFocused || value === "";

  return (
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          {icon}
        </div>
      )}

      <input
        type={type}
        value={value}
        onChange={(e) => setter(e.target.value)}
        placeholder=" " // keeps spacing for label
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="peer w-full pl-10 pr-10 py-3 bg-white/5 border border-white/20 text-white rounded-xl 
                   focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none placeholder-transparent transition duration-300"
      />

      {rightIcon && (
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-auto">
          {rightIcon}
        </div>
      )}

      {showLabel && (
        <label
          className="bg-red-500 absolute left-10 top-3 text-gray-400 text-sm transition-all duration-300 pointer-events-none
                     peer-focus:text-cyan-400 peer-focus:text-xs peer-focus:-top-2 peer-focus:left-3 peer-focus:bg-gray-900/50 peer-focus:px-1 rounded-sm"
        >
          {label}
        </label>
      )}
    </div>
  );
}




// // components/FloatingInput.tsx

// import React from "react";

// interface FloatingInputProps {
//   label: string;
//   value: string;
//   setter: (val: string) => void;
//   type?: string;
//   icon?: React.ReactNode;
//   rightIcon?: React.ReactNode;
// }

// export default function FloatingInput({
//   label,
//   value,
//   setter,
//   type = "text",
//   icon,
//   rightIcon,
// }: FloatingInputProps) {
//   return (
//     <div className="relative">
//       {icon && (
//         <div className="absolute inset-y-0 left-0 flex items-center pl-3">
//           {icon}
//         </div>
//       )}

//       <input
//         type={type}
//         value={value}
//         onChange={(e) => setter(e.target.value)}
//         placeholder=" "
//         className="peer w-full pl-10 pr-10 py-3 bg-white/5 border border-white/20 text-white rounded-xl 
//                    focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none placeholder-transparent transition duration-300"
//       />

//       {rightIcon && (
//         <div className="absolute inset-y-0 right-3 flex items-center pointer-events-auto">
//           {rightIcon}
//         </div>
//       )}

//       <label
//         // The peer-not-empty:opacity-0 and peer-not-empty:scale-90 animate the label away 
//         // completely when the input has text in it, preventing doubled text.
//         // It remains pointer-events-none by default to ensure clicks pass through.
//         className="absolute left-10 top-3 text-gray-400 text-sm transition-all duration-300 pointer-events-none
//                    peer-focus:text-cyan-400 peer-focus:text-xs peer-focus:-top-2 peer-focus:left-3
//                    peer-not-empty:text-xs peer-not-empty:-top-2 peer-not-empty:left-3
//                    peer-not-empty:opacity-0 peer-not-empty:scale-90
//                    bg-gray-900/0 peer-focus:bg-gray-900 peer-not-empty:bg-gray-900 px-1 rounded-sm transform origin-top-left"
//       >
//         {label}
//       </label>
//     </div>
//   );
// }
