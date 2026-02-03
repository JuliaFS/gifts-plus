import { Request, Response } from "express";
import { createStripePaymentIntent } from "../services/stripe/strype-payment.service";

export async function createPaymentIntentController(
  req: Request,
  res: Response
) {
  try {
    const { amount, userId, orderId } = req.body;

    const paymentIntent = await createStripePaymentIntent({
      amount,
      userId,
      orderId,
    });

    res.json(paymentIntent);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}