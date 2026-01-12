// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// export async function sendOrderStatusEmail(
//   orderId: string,
//   status: string
// ) {
//   await transporter.sendMail({
//     from: `"Shop" <${process.env.EMAIL_USER}>`,
//     to: process.env.ADMIN_EMAIL!,
//     subject: `Order ${orderId} is now ${status}`,
//     html: `
//       <h2>Order Update</h2>
//       <p>Your order <strong>${orderId}</strong> status changed to:</p>
//       <p><strong>${status}</strong></p>
//     `,
//   });
// }

//detailed version---------------------
// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// type OrderedItem = {
//   name: string;
//   quantity: number;
//   price: number;
// };

// export async function sendOrderStatusEmail(
//   orderId: string,
//   status: string,
//   items: OrderedItem[],
//   totalPrice: number
// ) {
//   const itemsHtml = items
//     .map(
//       (item) => `
//         <tr className="border-b">
//           <td style="padding:8px;border:1px solid #ddd;">${item.name}</td>
//           <td style="padding:8px;border:1px solid #ddd;text-align:center;">
//             ${item.quantity}
//           </td>
//           <td style="padding:8px;border:1px solid #ddd;text-align:right;">
//             $${item.price.toFixed(2)}
//           </td>
//         </tr>
//       `
//     )
//     .join("");

//   await transporter.sendMail({
//     from: `"Shop" <${process.env.EMAIL_USER}>`,
//     to: process.env.ADMIN_EMAIL!,
//     subject: `Order ${orderId} is now ${status}`,
//     html: `
//       <h2>Order Update</h2>

//       <p>
//         Order <strong>${orderId}</strong> status changed to:
//         <strong>${status}</strong>
//       </p>

//       <h3>Ordered Items</h3>

//       <table style="border-collapse:collapse;width:100%;">
//         <thead>
//           <tr className="bg-gray-200 border-b">
//             <th style="padding:8px;border:1px solid #ddd;text-align:left;">Product</th>
//             <th style="padding:8px;border:1px solid #ddd;">Qty</th>
//             <th style="padding:8px;border:1px solid #ddd;text-align:right;">Price</th>
//           </tr>
//         </thead>
//         <tbody>
//           ${itemsHtml}
//         </tbody>
//       </table>

//       <p style="margin-top:16px;">
//         <strong>Total:</strong> $${totalPrice.toFixed(2)}
//       </p>
//     `,
//   });
// }
//end detailed version

import nodemailer from "nodemailer";
import { OrderStatus } from "./orderStatus";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

type OrderStatusEmailPayload = {
  orderId: string;
  status: OrderStatus
  items: {
    quantity: number;
    products: {
      name: string;
      price: number;
    };
  }[];
  total: number;
};

export async function sendOrderStatusEmail(payload: OrderStatusEmailPayload) {
  console.log("Payload items: ", payload.items);
  const html = `
    <h2>📦 Order Status Update</h2>

    <p>
      Order <strong>${payload.orderId}</strong> is now:
      <strong>${payload.status}</strong>
    </p>

    <h3>Ordered items:</h3>
    <ul>
      ${payload.items
        .map((item) => {
        const product = item.products;

          if (!product) return "";

          return `
            <li>
              ${product.name} × ${item.quantity}
              — ${(product.price * item.quantity).toFixed(2)} €
            </li>
          `;
        })
        .join("")}
    </ul>

    <p><strong>Total:</strong> ${payload.total.toFixed(2)} €</p>
  `;

  await transporter.sendMail({
    from: `"Shop" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL!,
    subject: `Order ${payload.orderId} – ${payload.status}`,
    html,
  });
}


