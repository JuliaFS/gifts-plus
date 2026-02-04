import { Request, Response, NextFunction } from "express";
import { checkout } from "../services/checkout.service";
import { AuthRequest } from "../middleware/auth.middleware";
import { prepareCheckout } from "../services/prepare-checkout.service";

export async function checkoutHandler(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const userId = req.user!.id;
    const customerEmail = req.user!.email;
    const orderId = await checkout(userId, customerEmail);
    res.json({ message: "Order completed", orderId });
  } catch (err) {
    next(err);
  }
}

export async function prepareCheckoutController(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const userId = req.user.id; // from auth middleware

    const result = await prepareCheckout(userId);

    res.json(result);
  } catch (err) {
    next(err);
  }
}
