import { supabase } from "../db/supabaseClient";
import { CheckoutItem, Order, OrderItem } from "./types";



/**
 * Sends order confirmation email to customer.
 * Automatically handles invoice generation, buffer, and Supabase Storage.
 */


export async function createOrder(
  userId: string,
  cartItems: CheckoutItem[],
  options?: { status?: string; paymentMethod?: string },
): Promise<Order> {
  // 1️⃣ Filter invalid products
  const validItems = cartItems.filter((i) => i.products !== null);

  if (!validItems.length) {
    throw new Error("No valid products in cart");
  }

  // 2️⃣ Calculate total
  const total = validItems.reduce((sum, i) => {
    const price =
      i.products.sales_price && i.products.sales_price < i.products.price
        ? i.products.sales_price
        : i.products.price;
    return sum + i.quantity * price;
  }, 0);

  // 3️⃣ Prepare items for DB
  const itemsPayload = validItems.map((i) => {
    const price =
      i.products.sales_price && i.products.sales_price < i.products.price
        ? i.products.sales_price
        : i.products.price;
    return {
      product_id: i.product_id,
      quantity: i.quantity,
      price_at_purchase: price,
      products: {
        // keep full info for email/invoice
        name: i.products.name,
        price: i.products.price,
        stock: i.products.stock,
        sales_price: i.products.sales_price ?? null,
      },
    };
  });

  // 4️⃣ Create order + items ATOMICALLY
  const { data: orderId, error } = await supabase.rpc(
    "create_order_with_items",
    {
      p_user_id: userId,
      p_total: total,
      p_items: itemsPayload.map((i) => ({
        product_id: i.product_id,
        quantity: i.quantity,
        price_at_purchase: i.price_at_purchase,
      })), // send only DB needed fields
    },
  );

  if (error) throw error;
  if (!orderId) throw new Error("Order ID is undefined");

  // 4.5 Update options (status, payment_method) if provided
  const updates: any = {};
  if (options?.status) updates.status = options.status;
  if (options?.paymentMethod) updates.payment_method = options.paymentMethod;

  if (Object.keys(updates).length > 0) {
    await supabase.from("orders").update(updates).eq("id", orderId);
  }

  // 5️⃣ Return full order with proper types
  // return {
  //   id: String(orderId),
  //   total_amount: total,
  //   status: options?.status || "PENDING",
  //   items: itemsPayload,
  //   payment_method: options?.paymentMethod,
  // };
  return {
  id: String(orderId),
  total_amount: total,
  status: options?.status || "PENDING",
  items: itemsPayload,
  ...(options?.paymentMethod && {
    payment_method: options.paymentMethod,
  }),
};

}

export async function getOrderById(orderId: string): Promise<Order | null> {
  // Fetch order details
  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .select("id, total_amount, status, user_id")
    .eq("id", orderId)
    .single();

  if (orderError) {
    console.error(orderError);
    throw new Error("Failed to fetch order");
  }

  if (!orderData) return null;

  // Fetch order items with product info
  const { data: itemsData, error: itemsError } = await supabase
    .from("order_items")
    .select(
      `
      product_id,
      quantity,
      price_at_purchase,
      products:products(name, price, stock, sales_price)
    `,
    )
    .eq("order_id", orderId);

  if (itemsError) {
    console.error(itemsError);
    throw new Error("Failed to fetch order items");
  }

  // ⚡ Map itemsData to match OrderItem type
  const items: OrderItem[] = (itemsData ?? []).map((i: any) => ({
    product_id: i.product_id,
    quantity: i.quantity,
    price_at_purchase: i.price_at_purchase,
    products: Array.isArray(i.products) ? i.products[0] : i.products,
  }));

  return {
    id: orderData.id,
    total_amount: orderData.total_amount,
    status: orderData.status,
    user_id: orderData.user_id,
    items,
  };
}
