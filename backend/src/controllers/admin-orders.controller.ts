import { Request, Response } from "express";
import { supabase } from "../db/supabaseClient";

export async function getAdminOrders(req: Request, res: Response) {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      created_at,
      total_amount,
      status,
      users (email),
      order_items (
        quantity,
        products (name)
      )
    `)
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json(error);
  res.json(data);
}
