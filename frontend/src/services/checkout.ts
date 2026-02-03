import { handleFetchError } from "@/utils/handleFetchError";
import { API } from "./config";
import { CheckoutResponse, PrepareCheckoutResponse } from "./types";

// Service function
export async function prepareCheckout(): Promise<PrepareCheckoutResponse> {
  const res = await fetch(API.checkout.prepare(), {
    method: "POST",
    credentials: "include", // send cookies if needed
  });

  return handleFetchError<PrepareCheckoutResponse>(res, "Prepare checkout failed.");
}

export async function checkout(): Promise<CheckoutResponse> {
  const res = await fetch(API.checkout.create(), {
    method: "POST",
    credentials: "include",
  });

  return handleFetchError<CheckoutResponse>(res, "Checkout failed.");
}
