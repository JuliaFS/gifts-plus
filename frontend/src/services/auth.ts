import { RegisterData, User } from "./types";

const API_URL = "http://localhost:8080/api/auth";

export async function loginUser(data: { email: string; password: string }) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function registerUser(data: RegisterData): Promise<User>  {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    // Throwing an error here lets react-query's onError handle it
    throw new Error(errorData.message || "Registration failed"); 
  }
  
  return res.json();
}

export async function checkEmailExists(email: string): Promise<boolean> {
  const res = await fetch(`${API_URL}/check-email?email=${email}`, {credentials: "include"});
  const data = await res.json();
  return data.exists;
}

export async function fetchCurrentUser(): Promise<User | null> {
  const res = await fetch(`${API_URL}/me`, { credentials: "include" }); // include cookies
  if (!res.ok) {
    return null;
  }

  const user: User = await res.json();
  return user;
}

export async function logout() {
  const response = await fetch(`${API_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Logout failed");
  }

  return true;
}



