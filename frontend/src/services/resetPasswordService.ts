import { RESET_PASSWORD_URL } from "../config";

export const resetPassword = async ({ token, password }: {token: string, password: string}) => {
  const response = await fetch(RESET_PASSWORD_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // Backend expects 'password', not 'newPassword'
    body: JSON.stringify({ token, password }),
  });
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Failed to reset password");
  }
  
  return response.json();
};