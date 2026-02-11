This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:
#backend folder to start server -> npm run dev
#frontend folder -> npm run dev


Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

    Gifts Plus E-Commerce Platform

 Gifts Plus is a full-stack e-commerce application designed for selling gift products. It features a complete customer-facing storefront and a comprehensive admin panel for managing products, orders, and categories. The application is built with a modern tech stack, including a Next.js and a Node.js/Express backend, with Supabase for the database and authentication.

Key Features

        Customer Experience
    Product Browsing & Search: Customers can view products, see detailed descriptions, and view multiple images.
    Shopping Cart: A persistent shopping cart allows users to add, remove, and manage items.
    Sales & Promotions: Products can have discounted sales_price with start and end dates, which are automatically reflected in the cart and at checkout.
    Favorites: Users can mark products as favorites for easy access later.
    Secure Checkout:
    Pay on Delivery: Place an order and pay in cash upon arrival.
    Online Payments: Securely pay with a credit card via Stripe.
    Order Confirmation: Customers receive a confirmation email with a PDF invoice attached for both online and delivery orders.
    User Dashboard: A central place for users to see their favorite products and other relevant information.

        Admin Panel
    Product Management:
    Create, Read, Update, Delete (CRUD) functionality for all products.
    Image Management: Upload multiple images for each product.
    Sales Management: Set a sales_price along with a sale_start_at and sale_end_at date to schedule promotions.
    Category Management: Admins can create and assign categories to products.
    Order Management: View a list of all customer orders.
    Dashboard KPIs: A dashboard provides key metrics, including:
    Total Orders
    Number of "HOT," "NEW," and "SALE" products.
    Total number of favorited items across the platform.
        Technical Architecture
            Frontend
    Framework: Next.js
    State Management: Zustand for global state (e.g., shopping cart).
    Data Fetching: TanStack Query (useQuery, useMutation) for managing server state, caching, and asynchronous operations.
    Payments: Stripe.js and React Stripe.js for handling online credit card payments.
    Tests: Jest
    # To run all tests once
        npm test

        # To run tests in watch mode (re-runs on file changes)
        npm test -- --watch
    Styling: Tailwind CSS.

            Backend
    Framework: Node.js with Express.
    Database & Auth: Supabase is used for the PostgreSQL database, user authentication, and file storage (for PDF invoices).
    Payments: The backend integrates with the Stripe SDK to create Payment Intents and verify payment success.
    Emailing: Nodemailer is used to send transactional emails (e.g., order confirmations) to customers and admins.
    PDF Generation: pdfkit is used to dynamically generate PDF invoices for every order, with support for Cyrillic characters (Bulgarian).
    Webhooks: A dedicated endpoint listens for Stripe webhooks (e.g., payment_intent.succeeded) to finalize orders asynchronously.
