// src/controllers/product.controller.ts
import { Request, Response, NextFunction } from "express";
import * as productService from "../services/product.service";

export async function getProducts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    
    const result = await productService.getProducts(page, limit);
    return res.status(200).json(result);
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
    const { name, price, stock, description, image_urls } = req.body;

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
      image_urls,
    });

    return res.status(201).json(product);
  } catch (error) {
    next(error);
  }
}

export async function getProductById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Product id is required" });
    }

    const product = await productService.getProductById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json(product);
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!id) {
      return res.status(400).json({ message: "Product id is required" });
    }

    // Optional: validate fields (e.g., stock >= 0)
    if (updates.stock != null && updates.stock < 0) {
      return res.status(400).json({ message: "Stock cannot be negative" });
    }

    const updated = await productService.updateProduct(id, updates);

    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json(updated);
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Product id is required" });
    }

    const deleted = await productService.deleteProduct(id);

    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}

// Delete product images
export async function deleteProductImages(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const { imageUrls } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Product id is required" });
    }

    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      return res.status(400).json({ message: "Image URLs are required" });
    }

    await productService.deleteProductImages(id, imageUrls);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}

// Optional: add or update badge/promotion
export async function addBadgeToProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const { badge, promotion } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Product id is required" });
    }

    const updated = await productService.updateProduct(id, { badge, promotion });

    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json(updated);
  } catch (error) {
    next(error);
  }
}


