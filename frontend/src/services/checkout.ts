import { handleFetchError } from "@/utils/handleFetchError";
import { API } from "./config";
import { CheckoutResponse, PrepareCheckoutResponse, VerifyPaymentPayload, VerifyPaymentResponse } from "./types";

// Service function
export async function prepareCheckout(): Promise<PrepareCheckoutResponse> {
  const res = await fetch(API.checkout.prepare(), {
    method: "POST",
    credentials: "include", // send cookies if needed
  });

  return handleFetchError<PrepareCheckoutResponse>(res, "Prepare checkout failed.");
}

export async function verifyPayment(
  payload: VerifyPaymentPayload
): Promise<VerifyPaymentResponse> {
  const response = await fetch(API.checkout.verifyPayment(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Backend verification failed.");
  }

  return response.json();
}


export async function checkout(): Promise<CheckoutResponse> {
  const res = await fetch(API.checkout.create(), {
    method: "POST",
    credentials: "include",
  });

  return handleFetchError<CheckoutResponse>(res, "Checkout failed.");
}
