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
  const { data: user } = await supabase
    .from("users")
    .select("id, email")
    .eq("email", email)
    .maybeSingle();

  // ⚠️ Do not reveal if user exists
  if (!user) return { message: "If this email exists, a reset link was sent" };

  const resetToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log("hashed token:", hashedToken);

  const expires = new Date(Date.now() + 15 * 60 * 1000);

  console.log("expires at:", expires);

  await supabase
    .from("users")
    .update({
      reset_password_token: hashedToken,
      reset_password_expires: expires,
    })
    .eq("id", user.id);

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  await sendEmail({
    to: user.email,
    subject: "Reset your password",
    html: `
      <p>You requested a password reset.</p>
      <p>Click the link below to reset your password:</p>
      <p><a href="${resetUrl}" target="_blank">Reset password</a></p>
      <p>This link expires in 15 minutes.</p>
    `,
  });

  return { message: "If this email exists, a reset link was sent" };
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
