import { handleFetchError } from "@/utils/handleFetchError";
import { API } from "./config";
import { LoginData, RegisterData, User } from "./types";

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

  return handleFetchError<{ exists: boolean }>(res, "Failed to check email.").then(data => data.exists);
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

export async function forgotPassword(email: string) {
  const res = await fetch(API.auth.forgotPassword(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  return handleFetchError(res, "Failed to send reset link.");
}

export async function resetPassword(token: string, password: string) {
  const res = await fetch(API.auth.resetPassword(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ token, password }),
  });

  return handleFetchError(res, "Failed to reset password.");
}



// import { LoginData, RegisterData, User } from "./types";

// const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth`;

// export async function loginUser(data: LoginData): Promise<User> {
//   const res = await fetch(`${API_URL}/login`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     credentials: "include",
//     body: JSON.stringify(data),
//   });
//   const json = await res.json();

//   // 🔥 THIS IS CRITICAL
//   if (!res.ok) {
//     throw new Error(json.message || "Login failed");
//   }

//   return json;
// }

// export async function registerUser(data: RegisterData): Promise<User> {
//   const res = await fetch(`${API_URL}/register`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     credentials: "include",
//     body: JSON.stringify(data),
//   });

//   if (!res.ok) {
//     const errorData = await res.json();
//     // Throwing an error here lets react-query's onError handle it
//     throw new Error(errorData.message || "Registration failed");
//   }

//   return res.json();
// }

// export async function checkEmailExists(email: string): Promise<boolean> {
//   // const res = await fetch(`${API_URL}/check-email?email=${email}`, {credentials: "include"});
//   const res = await fetch(`${API_URL}/check-email?email=${email}`, {
//     credentials: "include",
//   });
//   const data = await res.json();
//   return data.exists;
// }

// export async function fetchCurrentUser(): Promise<User | null> {
//   const res = await fetch(`${API_URL}/me`, { credentials: "include" }); // include cookies
//   if (!res.ok) {
//     return null;
//   }

//   const user: User = await res.json();
//   return user;
// }

// export async function logout() {
//   const response = await fetch(`${API_URL}/logout`, {
//     method: "POST",
//     credentials: "include",
//   });

//   if (!response.ok) {
//     throw new Error("Logout failed");
//   }

//   return true;
// }

// export async function forgotPassword(email: string) {
//   const response = await fetch(`${API_URL}/forgot-password`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ email }),
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || "Failed to send reset link");
//   }

//   return data;
// }
// export async function resetPassword(token: string, password: string) {
//   const response = await fetch(`${API_URL}/reset-password`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ token, password }),
//     credentials: "include", // send HttpOnly cookie automatically
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || "Failed to reset password");
//   }

//   return data;
// }
