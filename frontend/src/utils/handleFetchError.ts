export interface FetchError {
  message: string;
  status?: number;
}

/**
 * Handle fetch errors with optional custom fallback message
 */
export async function handleFetchError<T>(
  res: Response,
  fallbackMessage?: string
): Promise<T> {
  if (res.ok) return res.json() as Promise<T>;

  // Try to parse JSON body
  const data = await res.json().catch(() => null);

  const error: FetchError = {
    message: data?.message || fallbackMessage || "Request failed",
    status: res.status,
  };

  throw error;
}

