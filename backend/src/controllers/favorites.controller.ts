import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import * as favoritesService from "../services/favorites.service";

export async function addFavoriteHandler(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user!.id;
    const productId = req.params.productId;

    const favorite = await favoritesService.addFavorite(userId, productId!);

    res.json({ message: "Added to favorites", favorite });
  } catch (err) {
    next(err);
  }
}

export async function removeFavoriteHandler(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user!.id;
    const productId = req.params.productId;

    await favoritesService.removeFavorite(userId, productId!);

    res.json({ message: "Removed from favorites" });
  } catch (err) {
    next(err);
  }
}

export async function getFavoritesHandler(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user!.id;

    const favorites = await favoritesService.getFavorites(userId);

    res.json(favorites);
  } catch (err) {
    next(err);
  }
}
