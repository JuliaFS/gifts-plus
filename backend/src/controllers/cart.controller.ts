import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import * as cartService from "../services/cart.service";
import { syncCart } from "../services/cart.service";

export async function getCart(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const items = await cartService.getCart(req.user!.id);
    res.json(items);
  } catch (err) {
    next(err);
  }
}

export async function addToCart(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { productId, quantity } = req.body;
    await cartService.addToCart(req.user!.id, productId, quantity);
    res.json({ message: "Added to cart" });
  } catch (err) {
    next(err);
  }
}

export async function updateCartItem(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { quantity } = req.body;
    await cartService.updateCartItem(
      req.user!.id,
      req.params.productId as string,
      quantity,
    );
    res.json({ message: "Updated" });
  } catch (err) {
    next(err);
  }
}

export async function removeFromCart(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    await cartService.removeFromCart(
      req.user!.id,
      req.params.productId as string,
    );
    res.json({ message: "Removed" });
  } catch (err) {
    next(err);
  }
}

export async function syncCartHandler(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user!.id;
    const { items } = req.body;

    if (!Array.isArray(items)) {
      res.status(400).json({ message: "Invalid cart items" });
      return;
    }

    await syncCart(userId, items);

    res.json({ message: "Cart synced" });
  } catch (err) {
    next(err);
  }
}
