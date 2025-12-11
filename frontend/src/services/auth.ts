const API_URL = "http://localhost:8080/api/auth";

export async function loginUser(data: { email: string; password: string }) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function registerUser(data: { 
  email: string; 
  password: string, 
  address?: string, 
  phone_number?: string 
}) {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    // Throwing an error here lets react-query's onError handle it
    throw new Error(errorData.message || "Registration failed"); 
  }
  
  return res.json();
}
