import { stripe } from "./stripe.client";

async function testStripe() {
  const pi = await stripe.paymentIntents.create({
    amount: 1000,
    currency: "usd",
  });

  console.log("Stripe OK:", pi.id);
}

testStripe();

