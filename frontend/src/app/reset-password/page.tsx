"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useResetPassword } from "./hooks/useResetPassword";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const { mutate, isPending } = useResetPassword();

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!token) {
      setError("Invalid or missing token.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
       setError("Password must be at least 6 characters.");
       return;
    }

    mutate(
      { token, password },
      {
    onSuccess: () => {
      setMessage("Password has been reset successfully.");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    },
    onError: (err: any) => {
      setError(err.message);
    },
      }
    );
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 mt-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-3xl p-10 shadow-2xl"
      >
        <h2 className="text-3xl font-extrabold text-center mb-6">
          Reset Password
        </h2>

        <div className="mb-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New Password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 bg-gradient-to-r from-purple-300 to-purple-600 text-white font-bold rounded-xl transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Resetting..." : "Reset Password"}
        </button>

        {message && <p className="text-center text-green-600 mt-4">{message}</p>}
        {error && <p className="text-center text-red-500 mt-4">{error}</p>}
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex justify-center mt-10">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}