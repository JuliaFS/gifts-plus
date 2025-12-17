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

/**
 * ADMIN ONLY - create product
 */
router.post(
  "/",
  authMiddleware,
  adminOnly,
  productController.createProduct
);



export default router;


// import { Router } from "express";
// import { authMiddleware } from "../middleware/auth.middleware";
// import { adminOnly } from "../middleware/admin.middleware";
// import { supabase } from "../db/supabaseClient";

// const router = Router();

// /**
//  * PUBLIC - get products
//  */
// router.get("/", async (_req, res) => {
//   const { data, error } = await supabase
//     .from("products")
//     .select("*")
//     .order("created_at", { ascending: false });

//   if (error) {
//     return res.status(500).json({ message: error.message });
//   }

//   res.json(data);
// });

// /**
//  * ADMIN ONLY - create product
//  */
// router.post("/", authMiddleware, adminOnly, async (req, res) => {
//   const { name, price, stock, description, image_url } = req.body;

//   if (!name || price == null || stock == null) {
//     return res.status(400).json({ message: "Missing fields" });
//   }

//   if (stock < 0) {
//     return res.status(400).json({ message: "Stock cannot be negative" });
//   }

//   const { data, error } = await supabase
//     .from("products")
//     .insert({
//       name,
//       price,
//       stock,
//       description,
//       image_url,
//     })
//     .select()
//     .single();

//   if (error) {
//     return res.status(500).json({ message: error.message });
//   }

//   res.status(201).json(data);
// });

// export default router;
