import express, { Router } from "express";
import { createPaymentIntentController } from "../controllers/stripe.controller";
import { stripeWebhookHandler } from "../services/stripe/stripe-webhook.service";

const router = Router();

router.post("/payment-intent", createPaymentIntentController);

// Stripe webhook endpoint
router.post(
  "/webhook",
  express.raw({ type: "application/json" }), // required by Stripe
  stripeWebhookHandler
);

export default router;