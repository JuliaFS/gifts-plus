"use client"; 

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const paymentType = searchParams.get("payment");
  const sessionId = searchParams.get("session_id");
  const customerEmail = searchParams.get("customer_email");
  const total = searchParams.get("total");

  let title = "Order Placed!";
  let message = "Thank you for your order.";

  if (paymentType === "online") {
    title = "Payment Successful!";
    message = "Thank you for your purchase. Your payment has been processed successfully.";
  } else if (paymentType === "delivery") {
    title = "Order Placed!";
    message =
      "Your order has been placed successfully. Please pay when your delivery arrives.";
  }

  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-md rounded-xl p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">{title}</h1>
        <p className="text-gray-700 mb-6">{message}</p>

        {total && (
          <p className="text-xl font-semibold text-gray-800 mb-6">
            Total Paid: {total} €
          </p>
        )}

        {sessionId && paymentType === "online" && (
          <p className="text-gray-500 text-sm mb-2">
            <span className="font-semibold">Session ID:</span> {sessionId}
          </p>
        )}

        {customerEmail && paymentType === "online" && (
          <p className="text-gray-500 text-sm mb-4">
            <span className="font-semibold">Email:</span> {customerEmail}
          </p>
        )}

        <Link
          href="/"
          className="inline-block mt-4 px-6 py-3 bg-purple-500 text-white font-semibold rounded-lg shadow hover:bg-purple-700 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    // Wrap the component that uses useSearchParams in a Suspense boundary
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading confirmation...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
