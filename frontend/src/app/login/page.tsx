"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { useLogin } from "./hooks/useLogin";

function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoginError, setIsLoginError] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect");

  const { mutate, isPending } = useLogin();
  const queryClient = useQueryClient();

  const handleLogin = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError("");

    mutate(
      { email, password },
      {
        onSuccess: async (data) => {
          if (!data) return;
          queryClient.setQueryData(["currentUser"], data);

          // ✅ Redirect logic
          if (redirectPath) {
            router.push(redirectPath);
          } else if (data.role === "admin") {
            router.push("/admin/products");
          } else {
            router.push("/dashboard");
          }
        },
        onError: (err: any) => {
          let message = "Login failed";
          if (err instanceof Error) {
            message = err.message;
          } else if (err && typeof err === "object" && "message" in err) {
            message = (err as any).message;
          }
          setError(message);
          setIsLoginError(true);
        },
      }
    );
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 mt-10">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white rounded-3xl p-10 shadow-2xl"
      >
        <h2 className="text-4xl font-extrabold text-center mb-6">Login</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="mb-4">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
              setIsLoginError(false);
            }}
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-2">
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
              setIsLoginError(false);
            }}
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-8 text-right">
          <Link href="/forgot-password" className="text-sm text-purple-800 font-italic hover:underline">Forgot password?</Link>
        </div>

        <button
          type="submit"
          disabled={isPending || isLoginError}
          className="w-full py-3 bg-gradient-to-r from-purple-300 to-purple-600 text-white font-bold rounded-xl transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-gray-400 text-sm pt-8">
          Don't have an account?{" "}
          {/* Pass the redirect param to register page so flow isn't lost */}
          <Link
            href={`/register${redirectPath ? `?redirect=${encodeURIComponent(redirectPath)}` : ""}`}
            className="text-purple-600 font-bold cursor-pointer hover:underline"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}