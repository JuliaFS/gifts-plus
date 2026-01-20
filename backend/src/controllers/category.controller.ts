import { Request, Response, NextFunction } from "express";
import * as categoryService from "../services/category.service";

export async function getCategories(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const categories = await categoryService.getCategories();
    res.json(categories);
  } catch (error) {
    next(error);
  }
}

export async function createCategory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { name, slug } = req.body;

    if (!name || !slug)
      return res.status(400).json({ message: "Name and slug are required" });

    const category = await categoryService.createCategory(name, slug);

    res.status(201).json(category);
  } catch (error: any) {
    if (error?.code === "23505") {
      // duplicate key error in Postgres
      return res
        .status(400)
        .json({ message: "Category name or slug already exists." });
    }
    next(error);
  }
}

export async function getProductsByCategory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({ message: "Category slug is required" });
    }

    const products = await categoryService.getProductsByCategory(slug);
    res.json(products);
  } catch (error) {
    next(error);
  }
}
