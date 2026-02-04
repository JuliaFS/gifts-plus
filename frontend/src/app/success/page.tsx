"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const paymentType = searchParams.get("payment"); // "online" or "delivery"
  const sessionId = searchParams.get("session_id");
  const customerEmail = searchParams.get("customer_email");

  let title = "Order Placed!";
  let message = "Thank you for your order.";

  if (paymentType === "online") {
    title = "Payment Successful!";
    message = "Thank you for your purchase. Your payment has been processed successfully.";
  } else if (paymentType === "delivery") {
    title = "Order Placed!";
    message = "Your order has been placed successfully. Please pay when your delivery arrives.";
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-md rounded-xl p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">{title}</h1>
        <p className="text-gray-700 mb-6">{message}</p>

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
          className="inline-block mt-4 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

// "use client";

// import { useSearchParams } from "next/navigation";
// import Link from "next/link";

// export default function SuccessPage() {
//   const searchParams = useSearchParams();
//   const sessionId = searchParams.get("session_id"); // Stripe usually sends this
//   const customerEmail = searchParams.get("customer_email"); // Optional

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
//       <div className="bg-white shadow-md rounded-xl p-8 max-w-md w-full text-center">
//         <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
//         <p className="text-gray-700 mb-6">
//           Thank you for your purchase. Your payment has been processed successfully.
//         </p>

//         {sessionId && (
//           <p className="text-gray-500 text-sm mb-2">
//             <span className="font-semibold">Session ID:</span> {sessionId}
//           </p>
//         )}

//         {customerEmail && (
//           <p className="text-gray-500 text-sm mb-4">
//             <span className="font-semibold">Email:</span> {customerEmail}
//           </p>
//         )}

//         <Link
//           href="/"
//           className="inline-block mt-4 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition"
//         >
//           Back to Home
//         </Link>
//       </div>
//     </div>
//   );
// }