import { supabase } from "../db/supabaseClient";
import { transporter } from "../utils/mailer";
import { generateInvoice } from "../utils/pdf/invoice.generator";

export interface CheckoutItem {
  product_id: string;
  quantity: number;
  products: {
    name: string;
    price: number;
    stock: number;
  };
}

export interface OrderItem {
  product_id: string;
  quantity: number;
  price_at_purchase: number;
  products: {
    name: string;
    price: number;
    stock: number;
  };
}

export interface Order {
  id: string;
  total_amount: number;
  status: string;
  user_id?: string;
  items: OrderItem[];
}

export async function sendOrderEmail({
  orderId,
  items,
  total,
  invoicePath,
  customerEmail,
}: {
  orderId: string;
  items: OrderItem[];
  total: number;
  invoicePath?: string;
  customerEmail: string;
}) {
  if (!orderId || !items || !total) {
    throw new Error("Missing order info for email");
  }

  // Generate invoice buffer if no file path
  const invoiceBuffer = invoicePath
    ? undefined
    : await generateInvoice(orderId, items);

  // Human-readable email body (never PDF content)
  const body = `
Invoice
Order ID: ${orderId}

${items
  .map(
    (i) =>
      `${i.products.name} × ${i.quantity} = ${i.products.price.toFixed(2)} € (Stock: ${i.products.stock})`
  )
  .join("\n")}

Total: ${total.toFixed(2)} €
`;

  await transporter.sendMail({
    from: `"Shop" <${process.env.EMAIL_USER}>`,
    to: customerEmail,
    subject: `Order Confirmation #${orderId}`,
    text: body,
    attachments: [
      invoicePath
        ? { path: invoicePath, filename: `invoice-${orderId}.pdf` }
        : { content: invoiceBuffer, filename: `invoice-${orderId}.pdf` },
    ],
  });

  console.log(`Order email sent to ${customerEmail} for order ${orderId}`);
}

export async function createOrder(userId: string, cartItems: CheckoutItem[]): Promise<Order> {
  // 1️⃣ Filter invalid products
  const validItems = cartItems.filter((i) => i.products !== null);

  if (!validItems.length) {
    throw new Error("No valid products in cart");
  }

  // 2️⃣ Calculate total
  const total = validItems.reduce(
    (sum, i) => sum + i.quantity * i.products.price,
    0
  );

  // 3️⃣ Prepare items for DB
  const itemsPayload = validItems.map((i) => ({
    product_id: i.product_id,
    quantity: i.quantity,
    price_at_purchase: i.products.price,
    products: { // keep full info for email/invoice
      name: i.products.name,
      price: i.products.price,
      stock: i.products.stock,
    },
  }));

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
    }
  );

  if (error) throw error;
  if (!orderId) throw new Error("Order ID is undefined");

  // 5️⃣ Return full order with proper types
  return {
    id: String(orderId),
    total_amount: total,
    status: "PENDING",
    items: itemsPayload,
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
    .select(`
      product_id,
      quantity,
      price_at_purchase,
      products:products(name, price, stock)
    `)
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
