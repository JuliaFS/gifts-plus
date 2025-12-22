"use client";
import { useState } from "react";
import { useForgotPassword } from "./hooks/useForgotPassword";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { mutate, isPending, isError, error } = useForgotPassword();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    mutate(email, {
      onSuccess: (data) => {
        setMessage(data.message);
      },
      onError: (err: unknown) => {
        let msg = "Failed to send reset link";
        if (err instanceof Error) msg = err.message;
        setMessage(msg);
      },
    });
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4 max-w-md mx-auto mt-10">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <button
        type="submit"
        disabled={isPending}
        className="py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
      >
        {isPending ? "Sending..." : "Send reset link"}
      </button>

      {message && <p className="text-center text-red-500">{message}</p>}
      {isError && error instanceof Error && (
        <p className="text-center text-red-500">{error.message}</p>
      )}
    </form>
  );
}
