import { handleFetchError } from "@/utils/handleFetchError";
import { API } from "./config";
import { CheckoutResponse } from "./types";



export async function checkout(): Promise<CheckoutResponse> {
  const res = await fetch(API.checkout.create(), {
    method: "POST",
    credentials: "include",
  });

  return handleFetchError<CheckoutResponse>(res, "Checkout failed.");
}
