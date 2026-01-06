// src/routes/cart.routes.ts
import { Router } from 'express';
import { validateCart } from '../controllers/cart.controller';

const router = Router();

// POST /api/cart/validate
router.post('/validate', validateCart);

export default router;


