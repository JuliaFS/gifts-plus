import { Request, Response } from "express";
import * as cartService from "../services/cart.service";
import { CartValidationItem } from "../services/types";

type InvalidReason = "DELETED" | "OUT_OF_STOCK" | "UNAVAILABLE";

type InvalidCartItem = {
  productId: string;
  reason: InvalidReason;
};

export async function validateCart(req: Request, res: Response) {
  try {
    const { items } = req.body as { items?: CartValidationItem[] };

    // 1️⃣ Payload validation
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Invalid cart items",
      });
    }

    // 2️⃣ Get products from DB (single query)
    const products = await cartService.getProductsForValidation(items);

    // 3️⃣ Build lookup map (O(1))
    const productMap = new Map(
      products.map((p) => [p.id, p])
    );

    const invalid: InvalidCartItem[] = [];

    // 4️⃣ Validation logic
    for (const item of items) {
      const product = productMap.get(item.productId);

      // ❌ Product deleted or missing
      if (!product) {
        invalid.push({
          productId: item.productId,
          reason: "DELETED",
        });
        continue;
      }


      // ❌ Not enough stock
      if (product.stock < item.quantity) {
        invalid.push({
          productId: item.productId,
          reason: "OUT_OF_STOCK",
        });
        continue;
      }
    }

    // 5️⃣ Return expected frontend shape
    return res.json({ invalid });
  } catch (error) {
    console.error("VALIDATE CART ERROR:", error);
    return res.status(500).json({
      message: "Failed to validate cart",
    });
  }
}
