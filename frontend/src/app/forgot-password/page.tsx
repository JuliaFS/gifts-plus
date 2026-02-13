"use client";
import { useState } from "react";
import { useForgotPassword } from "./hooks/useForgotPassword";
import Link from "next/link";

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

  return (
    <div className="flex flex-col items-center justify-center p-6 mt-10">
      <form
        onSubmit={submit}
        className="w-full max-w-md bg-white rounded-3xl p-10 shadow-2xl"
      >
        <h2 className="text-3xl font-extrabold text-center mb-6">
          Forgot Password
        </h2>

        <div className="mb-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 bg-gradient-to-r from-purple-300 to-purple-600 text-white font-bold rounded-xl transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Sending..." : "Send reset link"}
        </button>

        {message && <p className="text-center text-green-600 mt-4">{message}</p>}
        {isError && error instanceof Error && (
          <p className="text-center text-red-500 mt-4">{error.message}</p>
        )}

        <p className="text-center text-gray-400 text-sm pt-8">
          Remember your password?{" "}
          <Link
            href="/login"
            className="text-purple-600 font-bold cursor-pointer hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
