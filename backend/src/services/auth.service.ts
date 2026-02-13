import bcrypt from "bcrypt";
import crypto from "crypto";
import { supabase } from "../db/supabaseClient";
import { UserDTO } from "./types";
import { sendEmail } from "../services/email.service";

interface RegisterInput {
  email: string;
  password: string;
  address?: string;
  phone?: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export async function registerUser(input: RegisterInput) {
  const { email, password, address, phone } = input;

  // Check if user exists
  const { data: existingUser, error: selectError } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (selectError) throw selectError;
  if (existingUser) {
    const err: any = new Error("User with this email already exists");
    err.status = 409;
    throw err;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert new user
  const { data: newUser, error: insertError } = await supabase
    .from("users")
    .insert({
      email,
      password: hashedPassword,
      address: address || null,
      phone_number: phone || null,
      role: "customer",
    })
    .select("id, email, role, address, phone_number, created_at")
    .single();

  if (insertError || !newUser) throw insertError || new Error("Insert failed");

  return newUser as UserDTO; // ✅ only return the user
}

export async function loginUser({ email, password }: LoginInput) {
  const { data: user, error } = await supabase
    .from("users")
    .select("id, email, role, password, address, phone_number, created_at")
    .eq("email", email)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      const err: any = new Error("Invalid credentials.");
      err.status = 404;
      throw err;
    }
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const err: any = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  // Remove password before returning
  const { password: _, ...userData } = user;

  return userData as UserDTO;
}

export async function getUserById(userId: string) {
  const { data: user, error } = await supabase
    .from("users")
    .select("id, email, role, address, phone_number, created_at")
    .eq("id", userId)
    .single();

  if (error || !user) {
    const err: any = new Error("Not authorized");
    err.status = 401;
    throw err;
  }

  return user as UserDTO;
}

export async function emailExists(email: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (error) throw error;

  return Boolean(data);
}

export async function forgotPassword(email: string) {
  const cleanEmail = email.trim();
  const { data: user } = await supabase
    .from("users")
    .select("id, email")
    .eq("email", cleanEmail)
    .maybeSingle();

  // ⚠️ Do not reveal if user exists
  if (!user) return { message: `Password reset link has been sent to ${cleanEmail}` };

  const resetToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log("hashed token:", hashedToken);

  const expires = new Date(Date.now() + 15 * 60 * 1000);

  console.log("expires at:", expires);

  const { error } = await supabase
    .from("users")
    .update({
      reset_password_token: hashedToken,
      reset_password_expires: expires.toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    console.error("Failed to save reset token:", error);
    throw new Error("Internal error processing request");
  }

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  console.log("Sending reset email to:", user.email);


  await sendEmail({
    to: user.email,
    subject: "Reset your password for Gifts Plus",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2 style="color: #8a2be2;">Gifts Plus Password Reset</h2>
        <p>Hello,</p>
        <p>We received a request to reset the password for your account associated with this email address. If you made this request, please click the button below to set a new password.</p>
        <p style="text-align: center; margin: 25px 0;">
          <a href="${resetUrl}" target="_blank" style="background-color: #8a2be2; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Your Password</a>
        </p>
        <p>This password reset link is valid for the next 15 minutes.</p>
        <p>If you did not request a password reset, please ignore this email or contact our support if you have concerns.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 0.9em; color: #777;">Thank you,<br/>The Gifts Plus Team</p>
      </div>
    `,
  });

  return { message: `Password reset link has been sent to ${user.email}` };
}

export async function resetPassword(
  rawToken: string,
  newPassword: string
): Promise<UserDTO> {
  // 1. Hash the incoming raw token to compare with the DB
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  // 2. Find the user with a valid, non-expired token
  // We check the expiration directly in the query for better performance
  const { data: user, error: findError } = await supabase
    .from("users")
    .select("id")
    .eq("reset_password_token", hashedToken)
    .gt("reset_password_expires", new Date().toISOString())
    .maybeSingle();

  if (findError) throw findError;

  if (!user) {
    const err: any = new Error("Invalid or expired reset link");
    err.status = 400;
    throw err;
  }

  // 3. Hash the new password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

  // 4. Update the user: Set new password and NULL out the reset fields
  // We use .select() here to return the user data needed for the JWT cookie
  const { data: updatedUser, error: updateError } = await supabase
    .from("users")
    .update({
      password: hashedPassword,
      reset_password_token: null,
      reset_password_expires: null,
    })
    .eq("id", user.id)
    .select("id, email, role, address, phone_number, created_at")
    .single();

  if (updateError || !updatedUser) {
    throw updateError || new Error("Failed to update password");
  }

  return updatedUser as UserDTO;
}
