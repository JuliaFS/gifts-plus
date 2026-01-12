import { Router } from "express";
import {
  addFavoriteHandler,
  removeFavoriteHandler,
  getFavoritesHandler,
} from "../controllers/favorites.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Get all favorites for the logged-in user
router.get("/", authMiddleware, getFavoritesHandler);

// Add a favorite product
router.post("/:productId", authMiddleware, addFavoriteHandler);

// Remove a favorite product
router.delete("/:productId", authMiddleware, removeFavoriteHandler);

export default router;

