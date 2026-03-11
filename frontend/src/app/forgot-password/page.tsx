"use client";

import { useState } from "react";
import { useForgotPassword } from "./hooks/useForgotPassword";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { mutate, isPending, isError, error } = useForgotPassword();

  const submit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setMessage("");

    mutate(email, {
      onSuccess: (data) => {
        setMessage(data.message);
        setEmail("");
      },
      onError: (err: unknown) => {
        let msg = "Failed to send reset link";
        if (err instanceof Error) msg = err.message;
        setMessage(msg);
      },
    });
  };

  const inputVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 },
    }),
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 mt-10">
      <motion.form
        onSubmit={submit}
        className="w-full max-w-md bg-white rounded-3xl p-10 shadow-2xl"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h2
          className="text-3xl font-extrabold text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Forgot Password
        </motion.h2>

        <motion.div
          className="mb-6"
          custom={0}
          variants={inputVariant}
          initial="hidden"
          animate="visible"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </motion.div>

        <motion.button
          type="submit"
          disabled={isPending}
          className="w-full py-3 bg-gradient-to-r from-purple-300 to-purple-600 text-white font-bold rounded-xl transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isPending ? "Sending..." : "Send reset link"}
        </motion.button>

        {message && (
          <motion.p
            className="text-center text-green-600 mt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {message}
          </motion.p>
        )}

        {isError && error instanceof Error && (
          <motion.p
            className="text-center text-red-500 mt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {error.message}
          </motion.p>
        )}

        <motion.p
          className="text-center text-gray-400 text-sm pt-8"
          custom={1}
          variants={inputVariant}
          initial="hidden"
          animate="visible"
        >
          Remember your password?{" "}
          <Link
            href="/login"
            className="text-purple-600 font-bold cursor-pointer hover:underline"
          >
            Login
          </Link>
        </motion.p>
      </motion.form>
    </div>
  );
}