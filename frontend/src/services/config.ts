const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined in .env.local");
}

export const API = {
  BASE: BASE_URL,

  // static endpoints
  auth: {
    base: `${BASE_URL}/auth`,
    login: () => `${BASE_URL}/auth/login`,
    register: () => `${BASE_URL}/auth/register`,
    checkEmail: (email: string) =>
      `${BASE_URL}/auth/check-email?email=${encodeURIComponent(email)}`,
    me: () => `${BASE_URL}/auth/me`,
    logout: () => `${BASE_URL}/auth/logout`,
    forgotPassword: () => `${BASE_URL}/auth/forgot-password`,
    resetPassword: () => `${BASE_URL}/auth/reset-password`,
  },
  admin: {
    base: `${BASE_URL}/admin`,
    orders: {
      list: () => `${BASE_URL}/admin/orders`, // GET all orders
      byId: (orderId: string) => `${BASE_URL}/admin/orders/${orderId}`, // optional
      status: (orderId: string) => `${BASE_URL}/admin/orders/${orderId}/status`, // PATCH
    },
  },
  cart: {
    base: `${BASE_URL}/cart`,
    sync: () => `${BASE_URL}/cart/sync`,
  },
  checkout: {
    base: `${BASE_URL}/checkout`,
    create: () => `${BASE_URL}/checkout`, // POST endpoint
    //easy to extend API.checkout.applyDiscount() or API.checkout.byId(id)  TO DO
    prepare: () => `${BASE_URL}/checkout/prepare`,
    verifyPayment: () => `${BASE_URL}/checkout/verify-payment`,
  },
  favorites: {
    base: `${BASE_URL}/favorites`,
    fetch: () => `${BASE_URL}/favorites`,
    add: (productId: string) => `${BASE_URL}/favorites/${productId}`,
    remove: (productId: string) => `${BASE_URL}/favorites/${productId}`,
  },
  products: {
    base: `${BASE_URL}/products`,
    list: (page: number, limit = 12) =>
      `${BASE_URL}/products?page=${page}&limit=${limit}`,
    create: () => `${BASE_URL}/products`,
    byId: (productId: string) => `${BASE_URL}/products/${productId}`,
    update: (productId: string) => `${BASE_URL}/products/${productId}`,
    delete: (productId: string) => `${BASE_URL}/products/${productId}`,
    deleteImages: (productId: string) =>
      `${BASE_URL}/products/${productId}/images`,
    addBadge: (productId: string) => `${BASE_URL}/products/${productId}/badge`,
    search: (query: string) =>
      `${BASE_URL}/products/search?q=${encodeURIComponent(query)}`,
  },
    categories: {
    fetch: () => `${BASE_URL}/categories`,
    create: () => `${BASE_URL}/categories`,
    products: (slug: string) => `${BASE_URL}/categories/${slug}/products`,
  },
};
