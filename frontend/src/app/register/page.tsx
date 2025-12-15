"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useRegister } from "./hooks/useRegister";
import { useCheckEmail } from "./hooks/useCheckEmail";
import { HiMail, HiLockClosed, HiUser, HiPhone } from "react-icons/hi";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import FloatingInput from "@/components/FloatingInput";
import { useQueryClient } from "@tanstack/react-query";

// Basic email validation
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [localError, setLocalError] = useState("");
  const queryClient = useQueryClient();

  // 🔍 Email exists checking hook
  const {
    data: emailExists,
    refetch: checkEmail,
    isFetching: checkingEmail,
  } = useCheckEmail(email);

  // 🟦 Register user mutation hook
  const { mutate, isPending, isSuccess } = useRegister();

  // 🔍 Check email on blur
  const handleEmailBlur = async () => {
    if (!email) {
      setEmailError("Email is required.");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email.");
      return;
    }

    setEmailError(""); // valid format, reset error

    try {
      const res = await checkEmail();
      if (res.data) {
        setEmailError("This email is already registered.");
      }
    } catch {
      setEmailError("Unable to check email.");
    }
  };

  // 🔄 Reset email message when user types
  const handleEmailChange = (value: string) => {
    setEmail(value);
    setEmailError("");
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setPasswordError("");
  };

  const handleRepeatPasswordChange = (value: string) => {
    setRepeatPassword(value);
    setPasswordError("");
  };

  // Password strength
  const passwordStrength = (pw: string) => {
    if (pw.length >= 12) return 3;
    if (pw.length >= 8) return 2;
    if (pw.length > 0) return 1;
    return 0;
  };

  // ⏳ Submit handler
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    setEmailError("");
    setPasswordError("");

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email.");
      return;
    }

    if (emailError || emailExists) {
      setEmailError("Please use a different email.");
      return;
    }

    if (password !== repeatPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    mutate(
      { email, password },
      {
        onSuccess: async (data) => {
          // Update currentUser cache
          // await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
          queryClient.setQueryData(["currentUser"], data);
          console.log("data: ", data);
          router.push("/dashboard");
        },
        onError: (err) => {
          setLocalError(err.message || "Registration failed.");
        },
      }
    );
  };

  // 🔒 Disable register button logic
  const disableSubmit =
    isPending || checkingEmail || emailExists || !!emailError;

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md bg-white rounded-3xl p-10 space-y-6 shadow-2xl"
      >
        <h2 className="text-4xl font-extrabold text-center">Create Account</h2>

        {/* ❌ Local errors */}
        {localError && (
          <p className="text-red-400 bg-red-100 p-3 rounded-lg text-center">
            {localError}
          </p>
        )}

        {/* ✅ Success */}
        {isSuccess && (
          <p className="text-green-400 bg-green-200 p-3 rounded-lg text-center">
            Registration successful!
          </p>
        )}

        {/* Email */}
        <div className="">
          <FloatingInput
            label="Email"
            value={email}
            setter={handleEmailChange}
            type="email"
            icon={<HiMail className="text-cyan-400" />}
            onBlur={handleEmailBlur}
          />
          <div className="mt-1">
            {emailError && <p className="text-red-400 text-sm">{emailError}</p>}
          </div>
        </div>
        {/* ❌ Email / email exist errors */}

        {/* Address */}
        <FloatingInput
          label="Address (optional)"
          value={address}
          setter={setAddress}
          icon={<HiUser className="text-cyan-400" />}
        />

        {/* Phone */}
        <FloatingInput
          label="Phone Number (optional)"
          value={phone}
          setter={setPhone}
          icon={<HiPhone className="text-cyan-400" />}
        />

        {/* Password */}
        <div>
          <FloatingInput
            label="Password"
            value={password}
            setter={handlePasswordChange}
            type={showPassword ? "text" : "password"}
            icon={<HiLockClosed className="text-cyan-400" />}
            rightIcon={
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="cursor-pointer"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible className="text-gray-400" />
                ) : (
                  <AiOutlineEye className="text-gray-400" />
                )}
              </span>
            }
          />
          <div className="mt-1">
            {passwordError && (
              <p className="text-red-400 text-sm">{passwordError}</p>
            )}
          </div>
        </div>

        {/* Password strength bar */}
        {password && (
          <div className="h-2 w-full bg-gray-700 rounded-full">
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

        {/* Repeat password */}
        <FloatingInput
          label="Repeat Password"
          value={repeatPassword}
          setter={handleRepeatPasswordChange}
          type={showRepeatPassword ? "text" : "password"}
          icon={<HiLockClosed className="text-cyan-400" />}
          rightIcon={
            <span
              onClick={() => setShowRepeatPassword(!showRepeatPassword)}
              className="cursor-pointer"
            >
              {showRepeatPassword ? (
                <AiOutlineEyeInvisible className="text-gray-400" />
              ) : (
                <AiOutlineEye className="text-gray-400" />
              )}
            </span>
          }
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={disableSubmit}
          className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending
            ? "Registering..."
            : checkingEmail
            ? "Checking..."
            : "Register"}
        </button>

        <p className="text-center text-gray-400 text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-cyan-400 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}

// "use client";

// import { useState } from "react";
// import { useRegister } from "./hooks/useRegister";
// import { HiMail, HiLockClosed, HiUser, HiPhone } from "react-icons/hi";
// import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
// import FloatingInput from "@/components/FloatingInput";
// import { useCheckEmail } from "./hooks/useCheckEmail";

// // Helper function for basic email validation
// const validateEmail = (email: string): boolean => {
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return emailRegex.test(email);
// };

// export default function RegisterPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [repeatPassword, setRepeatPassword] = useState("");
//   const [address, setAddress] = useState("");
//   const [phone, setPhone] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showRepeatPassword, setShowRepeatPassword] = useState(false);
//   const [localError, setLocalError] = useState("");
//   const [hasFormChanged, setHasFormChanged] = useState(false);

//   // Optional: Email suggestions array
//   const [emailSuggestions, setEmailSuggestions] = useState<string[]>([]);
//   const {
//   data: emailExists,
//   refetch: checkEmail,
//   isFetching: checkingEmail
// } = useCheckEmail(email);

//   const {
//     mutate: register,
//     isPending,
//     isError,
//     isSuccess,
//     error,
//     reset: resetMutation,
//   } = useRegister({
//     onSuccess: () => {
//       // Reset all form fields after successful registration
//       setEmail("");
//       setPassword("");
//       setRepeatPassword("");
//       setAddress("");
//       setPhone("");
//       setHasFormChanged(false);
//       resetMutation();
//     },
//   });

// const handleEmailBlur = async () => {
//   if (!email) return;
//   if (!validateEmail(email)) return;

//   const result = await checkEmail();
//   if (result.data) {
//     setLocalError("Email already exists.");
//   }
// };

//   const handleInputChange = (
//     setter: React.Dispatch<React.SetStateAction<string>>,
//     value: string,
//   ) => {
//     setter(value);
//     if (isError || localError) {
//       setHasFormChanged(true);
//     }
//   };

//   const passwordStrength = (pw: string) => {
//     if (pw.length >= 12) return 3;
//     if (pw.length >= 8) return 2;
//     if (pw.length > 0) return 1;
//     return 0;
//   };

//   const handleRegister = (e: React.FormEvent) => {
//     e.preventDefault();
//     setLocalError("");
//     setHasFormChanged(false);

//     if (!validateEmail(email)) {
//       setLocalError("Please enter a valid email address.");
//       return;
//     }

//     if (password !== repeatPassword) {
//       setLocalError("Passwords do not match");
//       return;
//     }

//     register({
//       email,
//       password,
//       address,
//       phone_number: phone,
//     });
//   };

//   const disableSubmit =
//     !!(isPending || (isError && !hasFormChanged) || (localError && !hasFormChanged));

//   const displayError = localError || (isError ? (error as Error).message : "");

//   return (
//     <div className="min-h-screen flex items-center justify-center p-6">
//       <form
//         onSubmit={handleRegister}
//         className="w-full max-w-md bg-white rounded-3xl p-10 space-y-6 shadow-2xl transition-all duration-500 hover:shadow-cyan-500/30"
//       >
//         <h2 className="text-4xl font-extrabold text-center tracking-tight">
//           Create Account
//         </h2>

//         {displayError && (
//           <p className="text-red-400 bg-red-900/50 p-3 rounded-lg text-center">{displayError}</p>
//         )}

//         {isSuccess && (
//           <p className="text-green-400 bg-green-900/50 p-3 rounded-lg text-center">
//             Registration successful!
//           </p>
//         )}

//         {/* Email input with optional suggestions */}
//         <FloatingInput
//           label="Email"
//           value={email}
//           setter={(val) => handleInputChange(setEmail, val, "email")}
//           type="email"
//           icon={<HiMail className="text-cyan-400" />}
//           onBlur={handleEmailBlur}
//         />

//         <FloatingInput
//           label="Address (optional)"
//           value={address}
//           setter={(val) => handleInputChange(setAddress, val)}
//           icon={<HiUser className="text-cyan-400" />}
//         />

//         <FloatingInput
//           label="Phone Number (optional)"
//           value={phone}
//           setter={(val) => handleInputChange(setPhone, val)}
//           icon={<HiPhone className="text-cyan-400" />}
//         />

//         <FloatingInput
//           label="Password"
//           value={password}
//           setter={(val) => handleInputChange(setPassword, val)}
//           type={showPassword ? "text" : "password"}
//           icon={<HiLockClosed className="text-cyan-400" />}
//           rightIcon={
//             <span onClick={() => setShowPassword(!showPassword)} className="cursor-pointer">
//               {showPassword ? (
//                 <AiOutlineEyeInvisible className="text-gray-400 hover:text-cyan-400 transition" />
//               ) : (
//                 <AiOutlineEye className="text-gray-400 hover:text-cyan-400 transition" />
//               )}
//             </span>
//           }
//         />

//         {/* Password strength bar */}
//         {password && (
//           <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
//             <div
//               className={`h-full rounded-full transition-all duration-500 ${
//                 passwordStrength(password) === 1
//                   ? "bg-red-500 w-1/3"
//                   : passwordStrength(password) === 2
//                   ? "bg-yellow-500 w-2/3"
//                   : "bg-green-500 w-full"
//               }`}
//             ></div>
//           </div>
//         )}

//         <FloatingInput
//           label="Repeat Password"
//           value={repeatPassword}
//           setter={(val) => handleInputChange(setRepeatPassword, val)}
//           type={showRepeatPassword ? "text" : "password"}
//           icon={<HiLockClosed className="text-cyan-400" />}
//           rightIcon={
//             <span onClick={() => setShowRepeatPassword(!showRepeatPassword)} className="cursor-pointer">
//               {showRepeatPassword ? (
//                 <AiOutlineEyeInvisible className="text-gray-400 hover:text-cyan-400 transition" />
//               ) : (
//                 <AiOutlineEye className="text-gray-400 hover:text-cyan-400 transition" />
//               )}
//             </span>
//           }
//         />

//         <button
//           type="submit"
//           disabled={disableSubmit}
//           className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/50 hover:shadow-xl hover:scale-[1.02] transform transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           {isPending ? "Registering..." : "Register"}
//         </button>

//         <p className="text-center text-gray-300 text-sm">
//           Already have an account?{" "}
//           <a href="/login" className="text-cyan-400 hover:underline font-medium">
//             Login
//           </a>
//         </p>
//       </form>
//     </div>
//   );
// }

// // app/register/page.tsx (Updated with fix)
// "use client";
// import { useState, useEffect } from "react";
// import { useRegister } from "./hooks/useRegister";
// import { HiMail, HiLockClosed, HiUser, HiPhone } from "react-icons/hi";
// import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
// import FloatingInput from "@/components/FloatingInput";

// // Helper function for basic email validation
// const validateEmail = (email: string): boolean => {
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return emailRegex.test(email);
// };

// export default function RegisterPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [repeatPassword, setRepeatPassword] = useState("");
//   const [address, setAddress] = useState("");
//   const [phone, setPhone] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showRepeatPassword, setShowRepeatPassword] = useState(false);
//   const [localError, setLocalError] = useState("");
//   const [hasFormChanged, setHasFormChanged] = useState(false);

//   const {
//     mutate: register,
//     isPending,
//     isError,
//     isSuccess,
//     error,
//     reset: resetMutation,
//   } = useRegister();

//   const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
//     setter(value);
//     if (isError || localError) {
//       setHasFormChanged(true);
//     }
//   };

//   const passwordStrength = (pw: string) => {
//     if (pw.length >= 12) return 3;
//     if (pw.length >= 8) return 2;
//     if (pw.length > 0) return 1;
//     return 0;
//   };

//   const handleRegister = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLocalError("");
//     setHasFormChanged(false);

//     if (!validateEmail(email)) {
//       setLocalError("Please enter a valid email address.");
//       return;
//     }

//     if (password !== repeatPassword) {
//       setLocalError("Passwords do not match");
//       return;
//     }

//     register({
//       email,
//       password,
//       address,
//       phone_number: phone,
//     });
//   };

//   useEffect(() => {
//     if (isSuccess) {
//       setEmail("");
//       setPassword("");
//       setRepeatPassword("");
//       setAddress("");
//       setPhone("");
//       resetMutation();
//       setHasFormChanged(false);
//     }
//   }, [isSuccess, resetMutation]);

//   const disableSubmit = !!(isPending || (isError && !hasFormChanged) || (localError && !hasFormChanged));
//   const displayError = localError || (isError ? (error as Error).message : ''); // This variable is now used below

//   return (
//     <div className="min-h-screen flex items-center justify-center p-6">
//       <form
//         onSubmit={handleRegister}
//         className="w-full max-w-md bg-white rounded-3xl p-10 space-y-6 shadow-2xl transition-all duration-500 hover:shadow-cyan-500/30"
//       >
//         <h2 className="text-4xl font-extrabold text-center tracking-tight">
//           Create Account
//         </h2>

//         {/* Changed this line to use the 'displayError' variable */}
//         {displayError && <p className="text-red-400 bg-red-900/50 p-3 rounded-lg text-center">{displayError}</p>}

//         {isSuccess && <p className="text-green-400 bg-green-900/50 p-3 rounded-lg text-center">Registration successful!</p>}

//         <FloatingInput
//           label="Email"
//           value={email}
//           setter={(val) => handleInputChange(setEmail, val)}
//           type="email"
//           icon={<HiMail className="text-cyan-400" />}
//         />
//         <FloatingInput
//           label="Address (optional)"
//           value={address}
//           setter={(val) => handleInputChange(setAddress, val)}
//           icon={<HiUser className="text-cyan-400" />}
//         />
//         <FloatingInput
//           label="Phone Number (optional)"
//           value={phone}
//           setter={(val) => handleInputChange(setPhone, val)}
//           icon={<HiPhone className="text-cyan-400" />}
//         />
//         <FloatingInput
//           label="Password"
//           value={password}
//           setter={(val) => handleInputChange(setPassword, val)}
//           type={showPassword ? "text" : "password"}
//           icon={<HiLockClosed className="text-cyan-400" />}
//           rightIcon={
//             <span onClick={() => setShowPassword(!showPassword)} className="cursor-pointer">
//               {showPassword ? (
//                 <AiOutlineEyeInvisible className="text-gray-400 hover:text-cyan-400 transition" />
//               ) : (
//                 <AiOutlineEye className="text-gray-400 hover:text-cyan-400 transition" />
//               )}
//             </span>
//           }
//         />
//         {password && (
//           <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
//             <div
//               className={`h-full rounded-full transition-all duration-500 ${
//                 passwordStrength(password) === 1
//                   ? "bg-red-500 w-1/3"
//                   : passwordStrength(password) === 2
//                   ? "bg-yellow-500 w-2/3"
//                   : "bg-green-500 w-full"
//               }`}
//             ></div>
//           </div>
//         )}
//         <FloatingInput
//           label="Repeat Password"
//           value={repeatPassword}
//           setter={(val) => handleInputChange(setRepeatPassword, val)}
//           type={showRepeatPassword ? "text" : "password"}
//           icon={<HiLockClosed className="text-cyan-400" />}
//           rightIcon={
//             <span onClick={() => setShowRepeatPassword(!showRepeatPassword)} className="cursor-pointer">
//               {showRepeatPassword ? (
//                 <AiOutlineEyeInvisible className="text-gray-400 hover:text-cyan-400 transition" />
//               ) : (
//                 <AiOutlineEye className="text-gray-400 hover:text-cyan-400 transition" />
//               )}
//             </span>
//           }
//         />

//         <button
//           type="submit"
//           disabled={disableSubmit}
//           className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/50 hover:shadow-xl hover:scale-[1.02] transform transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           {isPending ? "Registering..." : "Register"}
//         </button>

//         <p className="text-center text-gray-300 text-sm">
//           Already have an account?{" "}
//           <a href="/login" className="text-cyan-400 hover:underline font-medium">
//             Login
//           </a>
//         </p>
//       </form>
//     </div>
//   );
// }
