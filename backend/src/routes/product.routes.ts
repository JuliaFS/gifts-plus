// src/routes/product.routes.ts
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminOnly } from "../middleware/admin.middleware";
import * as productController from "../controllers/product.controller";

const router = Router();

/**
 * PUBLIC - get products
 */
router.get("/", productController.getProducts);
// GET /api/products/:id
router.get("/:id", productController.getProductById);


/**
 * ADMIN ONLY - create product
 */
router.post(
  "/",
  authMiddleware,
  adminOnly,
  productController.createProduct
);

// PUT /api/products/:id
router.put(
  "/:id",
  authMiddleware,
  adminOnly,
  productController.updateProduct
);

/**
 * ADMIN ONLY - delete product
 */
// DELETE /api/products/:id
router.delete(
  "/:id",
  authMiddleware,
  adminOnly,
  productController.deleteProduct
);

/**
 * ADMIN ONLY - delete product images
 */
// DELETE /api/products/:id/images
router.delete(
  "/:id/images",
  authMiddleware,
  adminOnly,
  productController.deleteProductImages
);

/**
 * ADMIN ONLY - add/update badge or promotion
 */
// PATCH /api/products/:id/badge
router.patch(
  "/:id/badge",
  authMiddleware,
  adminOnly,
  productController.addBadgeToProduct
);





export default router;
