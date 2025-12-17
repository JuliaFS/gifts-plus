// src/controllers/product.controller.ts
import { Request, Response, NextFunction } from "express";
import * as productService from "../services/product.service";

export async function getProducts(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const products = await productService.getProducts();
    return res.status(200).json(products);
  } catch (error) {
    next(error);
  }
}

export async function createProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { name, price, stock, description, image_url } = req.body;

    if (!name || price == null || stock == null) {
      return res.status(400).json({ message: "Missing fields" });
    }

    if (stock < 0) {
      return res.status(400).json({ message: "Stock cannot be negative" });
    }

    const product = await productService.createProduct({
      name,
      price,
      stock,
      description,
      image_url,
    });

    return res.status(201).json(product);
  } catch (error) {
    next(error);
  }
}
