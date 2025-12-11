// app/register/page.tsx (Updated with fix)
"use client";
import { useState, useEffect } from "react";
import { useRegister } from "./hooks/useRegister";
import { HiMail, HiLockClosed, HiUser, HiPhone } from "react-icons/hi";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import FloatingInput from "@/components/FloatingInput";

// Helper function for basic email validation
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [localError, setLocalError] = useState("");
  const [hasFormChanged, setHasFormChanged] = useState(false);

  const {
    mutate: register,
    isPending,
    isError,
    isSuccess,
    error,
    reset: resetMutation,
  } = useRegister();

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(value);
    if (isError || localError) {
      setHasFormChanged(true);
    }
  };

  const passwordStrength = (pw: string) => {
    if (pw.length >= 12) return 3;
    if (pw.length >= 8) return 2;
    if (pw.length > 0) return 1;
    return 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    setHasFormChanged(false);

    if (!validateEmail(email)) {
      setLocalError("Please enter a valid email address.");
      return;
    }

    if (password !== repeatPassword) {
      setLocalError("Passwords do not match");
      return;
    }
    
    register({
      email,
      password,
      address,
      phone_number: phone,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      setEmail("");
      setPassword("");
      setRepeatPassword("");
      setAddress("");
      setPhone("");
      resetMutation();
      setHasFormChanged(false);
    }
  }, [isSuccess, resetMutation]);
  
  const disableSubmit = !!(isPending || (isError && !hasFormChanged) || (localError && !hasFormChanged));
  const displayError = localError || (isError ? (error as Error).message : ''); // This variable is now used below

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 space-y-6 shadow-2xl transition-all duration-500 hover:shadow-cyan-500/30"
      >
        <h2 className="text-4xl font-extrabold text-center text-white tracking-tight">
          Create Account
        </h2>

        {/* Changed this line to use the 'displayError' variable */}
        {displayError && <p className="text-red-400 bg-red-900/50 p-3 rounded-lg text-center">{displayError}</p>}
        
        {isSuccess && <p className="text-green-400 bg-green-900/50 p-3 rounded-lg text-center">Registration successful!</p>}

        <FloatingInput
          label="Email"
          value={email}
          setter={(val) => handleInputChange(setEmail, val)}
          type="email"
          icon={<HiMail className="text-cyan-400" />}
        />
        <FloatingInput
          label="Address (optional)"
          value={address}
          setter={(val) => handleInputChange(setAddress, val)}
          icon={<HiUser className="text-cyan-400" />}
        />
        <FloatingInput
          label="Phone Number (optional)"
          value={phone}
          setter={(val) => handleInputChange(setPhone, val)}
          icon={<HiPhone className="text-cyan-400" />}
        />
        <FloatingInput
          label="Password"
          value={password}
          setter={(val) => handleInputChange(setPassword, val)}
          type={showPassword ? "text" : "password"}
          icon={<HiLockClosed className="text-cyan-400" />}
          rightIcon={
            <span onClick={() => setShowPassword(!showPassword)} className="cursor-pointer">
              {showPassword ? (
                <AiOutlineEyeInvisible className="text-gray-400 hover:text-cyan-400 transition" />
              ) : (
                <AiOutlineEye className="text-gray-400 hover:text-cyan-400 transition" />
              )}
            </span>
          }
        />
        {password && (
          <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                passwordStrength(password) === 1
                  ? "bg-red-500 w-1/3"
                  : passwordStrength(password) === 2
                  ? "bg-yellow-500 w-2/3"
                  : "bg-green-500 w-full"
              }`}
            ></div>
          </div>
        )}
        <FloatingInput
          label="Repeat Password"
          value={repeatPassword}
          setter={(val) => handleInputChange(setRepeatPassword, val)}
          type={showRepeatPassword ? "text" : "password"}
          icon={<HiLockClosed className="text-cyan-400" />}
          rightIcon={
            <span onClick={() => setShowRepeatPassword(!showRepeatPassword)} className="cursor-pointer">
              {showRepeatPassword ? (
                <AiOutlineEyeInvisible className="text-gray-400 hover:text-cyan-400 transition" />
              ) : (
                <AiOutlineEye className="text-gray-400 hover:text-cyan-400 transition" />
              )}
            </span>
          }
        />

        <button
          type="submit"
          disabled={disableSubmit}
          className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/50 hover:shadow-xl hover:scale-[1.02] transform transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Registering..." : "Register"}
        </button>

        <p className="text-center text-gray-300 text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-cyan-400 hover:underline font-medium">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}










