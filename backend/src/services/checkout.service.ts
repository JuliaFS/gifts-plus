// import { supabase } from "../db/supabaseClient";
// import { createOrder } from "./order.service";
// import { sendCustomerConfirmation } from "../utils/customerConfirmation";
// import { generateInvoice } from "../utils/pdf/invoice.generator";

// export async function checkout(userId: string) {
//   // 1. Load cart
//   const { data: cartItems, error } = await supabase
//     .from("shopping_cart")
//     .select(`
//       product_id,
//       quantity,
//       products (name, price)
//     `)
//     .eq("user_id", userId);

//   if (error || !cartItems?.length) {
//     throw new Error("Cart is empty");
//   }

//   // 2. Create order
//   const order = await createOrder(userId, cartItems);

//   // 3. Decrease stock
//   for (const item of cartItems) {
//   const { error } = await supabase.rpc("decrease_stock", {
//     product_id: item.product_id,
//     qty: item.quantity,
//   });
//   if (error) throw new Error("Insufficient stock");
// }


//   // 4. Generate invoice
//   const invoicePath = generateInvoice(order, cartItems);

//   // 5. Send confirmation email
//   await sendCustomerConfirmation({
//     userId,
//     order,
//     items: cartItems,
//     invoicePath,
//   });

//   // 6. Clear cart
//   await supabase
//     .from("shopping_cart")
//     .delete()
//     .eq("user_id", userId);

//   return order.id;
// }
import { supabase } from "../db/supabaseClient";
import { createOrder } from "./order.service";
import { sendCustomerConfirmation } from "../utils/customerConfirmation";
import { generateInvoice } from "../utils/pdf/invoice.generator";
import { validateCartService } from "./cart-validation.service";
import { sendOrderEmail } from "../utils/sendOrderEmail";

interface CheckoutItem {
  product_id: string;
  quantity: number;
  products: {
    name: string;
    price: number;
    stock: number;
  };
}

export async function checkout(userId: string) {
  // 1. Validate cart (DB = source of truth)
  const validation = await validateCartService(userId);

  if (!validation.valid || !validation.items) {
    throw new Error(
      validation.reason || validation.issues?.join(", ") || "Cart invalid"
    );
  }

  const cartItems = validation.items as CheckoutItem[];

  // 2. Create order
  const order = await createOrder(userId, cartItems);

  // 3. Decrease stock (atomic)
  for (const item of cartItems) {
    const { error } = await supabase.rpc("decrease_stock", {
      product_id: item.product_id,
      qty: item.quantity,
    });

    if (error) {
      throw new Error("Insufficient stock");
    }
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

  await sendOrderEmail({
  orderId: order.id,

  items: cartItems.map((item) => ({
    quantity: item.quantity,
    products: {
      name: item.products.name,
      price: item.products.price,
    },
  })),

  total: order.total_amount,
  invoicePath,
});



  // 6. Clear cart
  await supabase
    .from("shopping_cart")
    .delete()
    .eq("user_id", userId);

  return order.id;
}
