import { Response, NextFunction } from "express";
import { checkout } from "../services/checkout.service";
import { AuthRequest } from "../middleware/auth.middleware";

export async function checkoutHandler(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user?.id; // from auth middleware
    await checkout(userId!);
    res.json({ message: "Order completed" });
  } catch (err) {
    next(err);
  }
}
