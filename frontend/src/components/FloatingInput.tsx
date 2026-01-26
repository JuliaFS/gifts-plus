"use client";

import React, { useState } from "react";

interface FloatingInputProps {
  label: string;
  value: string;
  setter: (val: string) => void;
  type?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onBlur?: () => void;
}

export default function FloatingInput({
  label,
  value,
  setter,
  type = "text",
  icon,
  rightIcon,
  onBlur,
}: FloatingInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  // Keep label floated if focused OR input has text

  return (
    <div className="relative w-full border rounded-xl">
      {/* Left icon */}
      {icon && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          {icon}
        </div>
      )}

      {/* Input */}
      <input
        type={type}
        value={value}
        onChange={(e) => setter(e.target.value)}
        onBlur={() => {
          setIsFocused(false);
          if (onBlur) onBlur(); // <-- forward blur event
        }}
        placeholder=" "
        onFocus={() => setIsFocused(true)}
        className="peer w-full pl-10 pr-10 py-3 border rounded-xl focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 outline-none placeholder-transparent transition duration-300"
      />

      {/* Right icon */}
      {rightIcon && (
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          {rightIcon}
        </div>
      )}

      {/* Label */}
      <label
        style={{
          top: value || isFocused ? "-0.6rem" : "1rem",
          background: "white",
          padding: "0 0.5rem",
        }} // -top-2 = -0.5rem, top-5 = 1.25rem
        className="absolute left-10 text-gray-400 text-sm pointer-events-none transition-all duration-300"
      >
        {label}
      </label>
    </div>
  );
}
