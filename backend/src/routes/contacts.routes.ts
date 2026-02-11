import { Router } from "express";
import { handleContactForm } from "../controllers/contacts.controller";

const router = Router();

router.post("/", handleContactForm);

export default router;