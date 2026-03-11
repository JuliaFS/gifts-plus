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
import { motion } from "framer-motion";

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

  const { data: emailExists, refetch: checkEmail, isFetching: checkingEmail } =
    useCheckEmail(email);

  const { mutate, isPending, isSuccess } = useRegister();

  const handleEmailBlur = async () => {
    if (!email) {
      setEmailError("Email is required.");
      return;
    }
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email.");
      return;
    }
    setEmailError("");
    try {
      const res = await checkEmail();
      if (res.data) setEmailError("This email is already registered.");
    } catch {
      setEmailError("Unable to check email.");
    }
  };

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
  const passwordStrength = (pw: string) => {
    if (pw.length >= 12) return 3;
    if (pw.length >= 8) return 2;
    if (pw.length > 0) return 1;
    return 0;
  };

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
        onSuccess: (data) => {
          queryClient.setQueryData(["currentUser"], data);
          if (data.role === "admin") {
            router.push("/admin/products");
          } else {
            router.push("/dashboard");
          }
        },
        onError: (err: any) => {
          setLocalError(err.message || "Registration failed.");
        },
      }
    );
  };

  const disableSubmit =
    isPending || checkingEmail || emailExists || !!emailError;

  // Framer Motion variants for staggered inputs
  const inputVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 },
    }),
  };

  return (
    <div className="flex items-center justify-center py-6 px-6 mt-10">
      <motion.form
        onSubmit={handleRegister}
        className="w-full max-w-md bg-white rounded-3xl p-10 space-y-6 shadow-2xl"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl md:text-4xl font-extrabold text-center">
          Create Account
        </h2>

        {localError && (
          <motion.p
            className="text-red-400 bg-red-100 p-3 rounded-lg text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {localError}
          </motion.p>
        )}

        {isSuccess && (
          <motion.p
            className="text-green-400 bg-green-200 p-3 rounded-lg text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Registration successful!
          </motion.p>
        )}

        {/* Email */}
        <motion.div custom={0} variants={inputVariant} initial="hidden" animate="visible">
          <FloatingInput
            label="Email"
            value={email}
            setter={handleEmailChange}
            type="email"
            icon={<HiMail className="text-purple-500 text-xl" />}
            onBlur={handleEmailBlur}
          />
          {emailError && <p className="text-red-400 text-sm mt-1">{emailError}</p>}
        </motion.div>

        {/* Address */}
        <motion.div custom={1} variants={inputVariant} initial="hidden" animate="visible">
          <FloatingInput
            label="Address (optional)"
            value={address}
            setter={setAddress}
            icon={<HiUser className="text-purple-500 text-2xl" />}
          />
        </motion.div>

        {/* Phone */}
        <motion.div custom={2} variants={inputVariant} initial="hidden" animate="visible">
          <FloatingInput
            label="Phone Number (optional)"
            value={phone}
            setter={setPhone}
            icon={<HiPhone className="text-purple-500 text-xl" />}
          />
        </motion.div>

        {/* Password */}
        <motion.div custom={3} variants={inputVariant} initial="hidden" animate="visible">
          <FloatingInput
            label="Password"
            value={password}
            setter={handlePasswordChange}
            type={showPassword ? "text" : "password"}
            icon={<HiLockClosed className="text-purple-500 text-xl" />}
            rightIcon={
              <span onClick={() => setShowPassword(!showPassword)} className="cursor-pointer">
                {showPassword ? (
                  <AiOutlineEyeInvisible className="text-gray-400" />
                ) : (
                  <AiOutlineEye className="text-gray-400" />
                )}
              </span>
            }
          />
          {passwordError && <p className="text-red-400 text-sm mt-1">{passwordError}</p>}
          {password && (
            <div className="h-2 w-full bg-gray-700 rounded-full mt-1">
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
        </motion.div>

        {/* Repeat password */}
        <motion.div custom={4} variants={inputVariant} initial="hidden" animate="visible">
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
        </motion.div>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={disableSubmit}
          className="w-full py-3 bg-gradient-to-r from-purple-300 to-purple-600 text-white font-bold rounded-xl transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isPending ? "Registering..." : checkingEmail ? "Checking..." : "Register"}
        </motion.button>

        <motion.p
          className="text-center text-gray-400 text-sm"
          custom={5}
          variants={inputVariant}
          initial="hidden"
          animate="visible"
        >
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-purple-500 font-bold cursor-pointer hover:underline"
          >
            Login
          </Link>
        </motion.p>
      </motion.form>
    </div>
  );
}