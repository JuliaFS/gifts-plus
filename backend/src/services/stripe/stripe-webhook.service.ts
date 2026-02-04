import { stripe } from "./stripe.client";
import { finalizeCheckout } from "../finalize-checkout.service";
import { Request, Response } from "express";

export async function stripeWebhookHandler(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"] as string;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("⚠️ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object as any;

      const orderId = paymentIntent.metadata?.orderId;
      const customerEmail = paymentIntent.metadata?.customerEmail;
      if (orderId) {
        try {
          await finalizeCheckout(orderId, customerEmail);
          console.log("✅ Order finalized:", orderId);
        } catch (err) {
          console.error("❌ finalizeCheckout error:", err);
        }
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
}