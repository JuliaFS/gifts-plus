import { FetchError } from "./handleFetchError";

export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong"
): string {
  if (typeof error === "object" && error !== null && "message" in error) {
    return String((error as FetchError).message);
  }

  return fallback;
}
