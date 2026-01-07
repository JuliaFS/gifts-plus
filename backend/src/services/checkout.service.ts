import { supabase } from "../db/supabaseClient";
import { createOrder } from "./order.service";
import { sendCustomerConfirmation } from "../utils/customerConfirmation";
import { generateInvoice } from "../utils/pdf/invoice.generator";

export async function checkout(userId: string) {
  // 1. Load cart
  const { data: cartItems, error } = await supabase
    .from("shopping_cart")
    .select(`
      product_id,
      quantity,
      products (name, price)
    `)
    .eq("user_id", userId);

  if (error || !cartItems?.length) {
    throw new Error("Cart is empty");
  }

  // 2. Create order
  const order = await createOrder(userId, cartItems);

  // 3. Decrease stock
  for (const item of cartItems) {
  const { error } = await supabase.rpc("decrease_stock", {
    product_id: item.product_id,
    qty: item.quantity,
  });
  if (error) throw new Error("Insufficient stock");
}


  // 4. Generate invoice
  const invoicePath = generateInvoice(order, cartItems);

  // 5. Send confirmation email
  await sendCustomerConfirmation({
    userId,
    order,
    items: cartItems,
    invoicePath,
  });

  // 6. Clear cart
  await supabase
    .from("shopping_cart")
    .delete()
    .eq("user_id", userId);

  return order.id;
}

