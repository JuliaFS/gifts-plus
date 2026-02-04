import { stripe } from "./stripe.client";

interface CreatePaymentIntentParams {
  amount: number; // cents
  currency?: string;
  userId: string;
  orderId: string;
  customerEmail: string;
}

export async function createStripePaymentIntent({
  amount,
  currency = "eur",
  userId,
  orderId,
  customerEmail,
}: CreatePaymentIntentParams) {
  if (!amount || amount <= 0) {
    throw new Error("Invalid payment amount");
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
    automatic_payment_methods: { enabled: true },
    metadata: {
      userId,
      orderId,
      customerEmail,
    },
  });

  return {
    id: paymentIntent.id,
    clientSecret: paymentIntent.client_secret,
  };
}