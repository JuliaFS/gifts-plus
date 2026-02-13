"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useRegister } from "./hooks/useRegister";
import { useCheckEmail } from "./hooks/useCheckEmail";
import { HiMail, HiLockClosed, HiUser, HiPhone } from "react-icons/hi";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import FloatingInput from "@/components/FloatingInput";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

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
  const handleRegister = (e: React.SyntheticEvent<HTMLFormElement>) => {
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
          if (data.role === "admin") {
            router.push("/admin/products");
          } else {
            router.push("/dashboard");
          }
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
    <div className="flex items-center justify-center py-6 px-6 mt-10">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md bg-white rounded-3xl p-10 space-y-6 shadow-2xl"
      >
        <h2 className="text-2xl md:text-4xl font-extrabold text-center">Create Account</h2>

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
        <div>
          <FloatingInput
            label="Email"
            value={email}
            setter={handleEmailChange}
            type="email"
            icon={<HiMail className="text-purple-500 text-xl" />}
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
          icon={<HiUser className="text-purple-500 text-2xl" />}
        />

        {/* Phone */}
        <FloatingInput
          label="Phone Number (optional)"
          value={phone}
          setter={setPhone}
          icon={<HiPhone className="text-purple-500 text-xl" />}
        />

        {/* Password */}
        <div>
          <FloatingInput
            label="Password"
            value={password}
            setter={handlePasswordChange}
            type={showPassword ? "text" : "password"}
            icon={<HiLockClosed className="text-purple-500 text-xl" />}
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
          icon={<HiLockClosed className="text-purple-500 text-xl" />}
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
          className="w-full py-3 bg-gradient-to-r from-purple-300 to-purple-600 text-white font-bold rounded-xl transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending
            ? "Registering..."
            : checkingEmail
            ? "Checking..."
            : "Register"}
        </button>

        <p className="text-center text-gray-400 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-purple-500 font-bold cursor-pointer hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
