// import { Request, Response } from "express";
// import * as cartService from "../services/cart.service";
// import { CartValidationItem } from "../services/types";

// type InvalidReason = "DELETED" | "OUT_OF_STOCK" | "UNAVAILABLE";

// type InvalidCartItem = {
//   productId: string;
//   reason: InvalidReason;
// };

// export async function validateCart(req: Request, res: Response) {
//   try {
//     const { items } = req.body as { items?: CartValidationItem[] };

//     // 1️⃣ Payload validation
//     if (!Array.isArray(items) || items.length === 0) {
//       return res.status(400).json({
//         message: "Invalid cart items",
//       });
//     }

//     // 2️⃣ Get products from DB (single query)
//     const products = await cartService.getProductsForValidation(items);

//     // 3️⃣ Build lookup map (O(1))
//     const productMap = new Map(
//       products.map((p) => [p.id, p])
//     );

//     const invalid: InvalidCartItem[] = [];

//     // 4️⃣ Validation logic
//     for (const item of items) {
//       const product = productMap.get(item.productId);

//       // ❌ Product deleted or missing
//       if (!product) {
//         invalid.push({
//           productId: item.productId,
//           reason: "DELETED",
//         });
//         continue;
//       }


//       // ❌ Not enough stock
//       if (product.stock < item.quantity) {
//         invalid.push({
//           productId: item.productId,
//           reason: "OUT_OF_STOCK",
//         });
//         continue;
//       }
//     }

//     // 5️⃣ Return expected frontend shape
//     return res.json({ invalid });
//   } catch (error) {
//     console.error("VALIDATE CART ERROR:", error);
//     return res.status(500).json({
//       message: "Failed to validate cart",
//     });
//   }
// }

import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import * as cartService from "../services/cart.service";
import { syncCart } from "../services/cart.service";

export async function getCart(
  req: AuthRequest,
  res: Response,
  next: NextFunction
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
  next: NextFunction
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
  next: NextFunction
) {
  try {
    const { quantity } = req.body;
    await cartService.updateCartItem(
      req.user!.id,
      req.params.productId as string,
      quantity
    );
    res.json({ message: "Updated" });
  } catch (err) {
    next(err);
  }
}

export async function removeFromCart(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    await cartService.removeFromCart(
      req.user!.id,
      req.params.productId as string
    );
    res.json({ message: "Removed" });
  } catch (err) {
    next(err);
  }
}





export async function syncCartHandler(
  req: AuthRequest,
  res: Response,
  next: NextFunction
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