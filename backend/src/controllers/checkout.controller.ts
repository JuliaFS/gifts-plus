import { Request, Response, NextFunction } from "express";
import { checkout } from "../services/checkout.service";
import { AuthRequest } from "../middleware/auth.middleware";

export async function checkoutHandler(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.id;
    const orderId = await checkout(userId);
    res.json({ message: "Order completed", orderId });
  } catch (err) {
    next(err);
  }
}

export async function prepareCheckoutController(
  req: Request,
  res: Response
) {
  try {
    const userId = req.user.id; // from auth middleware

    const result = await prepareCheckout(userId);

    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

