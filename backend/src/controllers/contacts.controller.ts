import { Request, Response, NextFunction } from "express";
import { sendContactEmail } from "../services/contacts.service";

export async function handleContactForm(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required." });
    }

    await sendContactEmail({ name, email, message });

    res.status(200).json({ message: "Message sent successfully!" });
  } catch (err) {
    next(err);
  }
}