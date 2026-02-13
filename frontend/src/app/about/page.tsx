export default function About() {
  return (
    <div className="container mx-auto px-6 py-12 max-w-5xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
          About <span className="text-4xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">Gifts Plus</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Gifts Plus is a full-stack e-commerce application designed for selling
          gift products. It features a complete customer-facing storefront and a
          comprehensive admin panel for managing products, orders, and
          categories.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Customer Experience */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            🛍️ Customer Experience
          </h2>
          <ul className="space-y-3 text-gray-600">
            <li>
              <strong className="text-gray-900">Product Browsing:</strong>{" "}
              Detailed descriptions, multiple images, and search functionality.
            </li>
            <li>
              <strong className="text-gray-900">Shopping Cart:</strong>{" "}
              Persistent cart to manage items easily.
            </li>
            <li>
              <strong className="text-gray-900">Sales & Promotions:</strong>{" "}
              Automatic discounts with scheduled start and end dates.
            </li>
            <li>
              <strong className="text-gray-900">Favorites:</strong> Save
              products for later access.
            </li>
            <li>
              <strong className="text-gray-900">Secure Checkout:</strong>{" "}
              Options for Pay on Delivery or Online Payments via Stripe.
            </li>
            <li>
              <strong className="text-gray-900">Order Confirmation:</strong>{" "}
              Generates PDF invoices and sends them via email to both the customer and the admin.
            </li>
          </ul>
        </div>

        {/* Admin Panel */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            ⚙️ Admin Panel
          </h2>
          <ul className="space-y-3 text-gray-600">
            <li>
              <strong className="text-gray-900">Product Management:</strong>{" "}
              Full CRUD functionality for products.
            </li>
            <li>
              <strong className="text-gray-900">Image Management:</strong>{" "}
              Upload multiple images for each product.
            </li>
            <li>
              <strong className="text-gray-900">Sales Management:</strong>{" "}
              Schedule promotions with specific dates.
            </li>
            <li>
              <strong className="text-gray-900">Dashboard KPIs:</strong>{" "}
              Real-time metrics on orders, products, and favorites.
            </li>
            <li>
              <strong className="text-gray-900">Invoice Management:</strong>{" "}
              Automatic generation and email delivery of PDF invoices to admins and customers.
            </li>
          </ul>
        </div>
      </div>

      {/* Technical Architecture */}
      <div className="bg-gray-50 rounded-3xl p-8 md:p-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Technical Architecture
        </h2>
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-xl font-bold text-purple-600 mb-4 border-b border-purple-200 pb-2">
              Frontend
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>Next.js Framework</li>
              <li>Zustand for State Management</li>
              <li>TanStack Query for Data Fetching</li>
              <li>Stripe.js for Payments</li>
              <li>Tailwind CSS for Styling</li>
              <li>Jest for Testing</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold text-purple-600 mb-4 border-b border-purple-200 pb-2">
              Backend
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>Node.js with Express</li>
              <li>Supabase (PostgreSQL & Auth)</li>
              <li>Stripe SDK & Webhooks</li>
              <li>Nodemailer for Transactional Emails</li>
              <li>PDFKit for Dynamic Invoices</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}