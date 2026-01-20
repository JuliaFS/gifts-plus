export interface FetchError {
  message: string;
  status?: number;
}

interface ErrorResponse {
  message?: string;
}

export async function handleFetchError<T>(
  res: Response,
  fallbackMessage?: string
): Promise<T> {
  if (res.ok) return res.json() as Promise<T>;

  // Try to parse JSON body
  let data: ErrorResponse = {};
  try {
    data = (await res.json()) as ErrorResponse;
  } catch {
    // ignore parse errors
  }

  const message = data.message || fallbackMessage || "Request failed";

  const error: FetchError = new Error(message);
  error.status = res.status;

  throw error;
}