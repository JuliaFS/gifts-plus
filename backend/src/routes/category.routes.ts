import { Router } from "express";
import {
  getCategories,
  createCategory,
  getProductsByCategory,
} from "../controllers/category.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminOnly as adminMiddleware} from "../middleware/admin.middleware";

const router = Router();

// ✅ Public — used for filters, menus, sidebar
router.get("/", getCategories);

// ✅ Public — category page
router.get("/:slug/products", getProductsByCategory);

// 🔒 Admin only — create category
router.post("/", authMiddleware, adminMiddleware, createCategory);

export default router;
