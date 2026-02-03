import { validateCartService } from "./cart-validation.service";
import { createOrder } from "./order.service";
import { createStripePaymentIntent } from "./stripe/strype-payment.service";

interface CheckoutItem {
  product_id: string;
  quantity: number;
  products: {
    name: string;
    price: number;
    stock: number;
  };
}

export async function prepareCheckout(userId: string) {
  // 1️⃣ Validate cart (DB = source of truth)
  const validation = await validateCartService(userId);

  if (!validation.valid || !validation.items) {
    throw new Error(
      validation.reason || validation.issues?.join(", ") || "Cart invalid"
    );
  }

  const cartItems = validation.items as CheckoutItem[];

  // 2️⃣ Calculate final amount (backend truth)
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.products.price,
    0
  );

  const amountInCents = Math.round(totalAmount * 100);

  // 3️⃣ Create order (PENDING_PAYMENT)
  const order = await createOrder(userId, cartItems, {
    status: "PENDING_PAYMENT",
    totalAmount,
  });

  // 4️⃣ Create Stripe PaymentIntent
  const paymentIntent = await createStripePaymentIntent({
    amount: amountInCents,
    userId,
    orderId: order.id,
  });

  return {
    orderId: order.id,
    clientSecret: paymentIntent.clientSecret,
  };
}