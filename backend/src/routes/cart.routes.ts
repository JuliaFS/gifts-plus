// // src/routes/cart.routes.ts
// import { Router } from 'express';
// import { validateCart } from '../controllers/cart.controller';

// const router = Router();

// // POST /api/cart/validate
// router.post('/validate', validateCart);

// export default router;
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  syncCartHandler,
} from "../controllers/cart.controller";

const router = Router();

router.get("/", authMiddleware, getCart);
router.post("/add", authMiddleware, addToCart);
router.patch("/:productId", authMiddleware, updateCartItem);
router.delete("/:productId", authMiddleware, removeFromCart);
router.post("/sync", authMiddleware, syncCartHandler);

export default router;


