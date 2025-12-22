"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useResetPassword } from "./hooks/useResetPassword";
import { useQueryClient } from "@tanstack/react-query";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
const router = useRouter(); // Initialize router
const queryClient = useQueryClient();


  const { mutate: resetPasswordMutate, isPending: resetting } = useResetPassword();

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    resetPasswordMutate({token, password}, {
      onSuccess: (data) => {
        queryClient.setQueryData(["currentUser"], data);
        setMessage(data.message || "Password reset successful! Redirecting...")
        setTimeout(() => {
          router.push("/products");
        }, 2000);
      },
      onError: (err: unknown) => {
        let msg = "Failed to reset password";
        if (err instanceof Error) msg = err.message;
        setMessage(msg);
      },
    });
  };

  if (!token) return <p>Invalid link</p>;

  return (
    <form onSubmit={submit} className="flex flex-col gap-4 max-w-md mx-auto mt-10">
      <input
        type="password"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" disabled={resetting}>
        {resetting ? "Resetting..." : "Reset password"}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}

