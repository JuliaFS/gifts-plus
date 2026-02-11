import { handleFetchError } from "@/utils/handleFetchError";

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export async function sendContactMessage(data: ContactFormData): Promise<{ message: string }> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/contacts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleFetchError<{ message: string }>(res, "Failed to send message.");
}