import { handleFetchError } from "@/utils/handleFetchError";
import { API } from "./config";
import {
  ForgotPasswordResponse,
  LoginData,
  RegisterData,
  ResetPasswordResponse,
  User,
} from "./types";

export async function loginUser(data: LoginData): Promise<User> {
  const res = await fetch(API.auth.login(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  return handleFetchError<User>(res, "Login failed.");
}

export async function registerUser(data: RegisterData): Promise<User> {
  const res = await fetch(API.auth.register(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  return handleFetchError<User>(res, "Registration failed.");
}

export async function checkEmailExists(email: string): Promise<boolean> {
  const res = await fetch(API.auth.checkEmail(email), {
    credentials: "include",
  });

  return handleFetchError<{ exists: boolean }>(
    res,
    "Failed to check email."
  ).then((data) => data.exists);
}

export async function fetchCurrentUser(): Promise<User | null> {
  const res = await fetch(API.auth.me(), { credentials: "include" });

  // For fetchCurrentUser, return null if not authenticated
  if (!res.ok) return null;

  return handleFetchError<User>(res, "Failed to fetch current user.");
}

export async function logout(): Promise<boolean> {
  const res = await fetch(API.auth.logout(), {
    method: "POST",
    credentials: "include",
  });

  await handleFetchError(res, "Logout failed.");
  return true; // If no error thrown, logout succeeded
}

export async function forgotPassword(
  email: string
): Promise<ForgotPasswordResponse> {
  const res = await fetch(API.auth.forgotPassword(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  return handleFetchError<ForgotPasswordResponse>(
    res,
    "Failed to send reset link."
  );
}

export async function resetPassword(token: string, password: string) {
  const res = await fetch(API.auth.resetPassword(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ token, password }),
  });

  return handleFetchError<ResetPasswordResponse>(
    res,
    "Failed to reset password."
  );
}
