"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "./hooks/useLogin";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoginError, setIsLoginError] = useState(false);
  const router = useRouter();

  const { mutate, isPending } = useLogin();
  const queryClient = useQueryClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    mutate(
      { email, password },
      {
        onSuccess: async (data) => {
          if (!data) return;
          queryClient.setQueryData(["currentUser"], data);

          if (data.role === "admin") {
            router.push("/admin/products");
          } else {
            router.push("/dashboard");
          }
        },
        onError: (err: unknown) => {
          // Narrow the error type
          let message = "Login failed";
          if (err instanceof Error) {
            message = err.message;
          } else if (err && typeof err === "object" && "message" in err) {
            // @ts-expect-error
            message = err.message;
          }
          setError(message);
          setIsLoginError(true);
        },
      }
    );
  };

  return (
    <div className="flex flex-col items-center justify-center py-6 px-12 mt-10">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white rounded-3xl p-10 shadow-2xl"
      >
        <h2 className="text-2xl md:text-4xl font-extrabold text-center mb-6">Login</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="mb-4">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(""); // reset error on change
              setIsLoginError(false);
            }}
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-1">
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(""); // reset error on change
              setIsLoginError(false);
            }}
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="text-right italic font-bold text-sm pb-8"><Link href="/forgot-password">Forgot password?</Link></div>

        <button
          type="submit"
          disabled={isPending || isLoginError}
          className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Logging in..." : "Login"}
        </button>
        <p className="text-center text-gray-400 text-sm pt-8">
          Don't have an account?{" "}
          <Link href="/register" className="text-cyan-400 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
