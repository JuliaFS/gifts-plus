

export const ORDER_STATUS = {
  PENDING: "PENDING",
  SHIPPED: "SHIPPED",
  CANCELLED: "CANCELLED",
} as const;

export type OrderStatus =
  typeof ORDER_STATUS[keyof typeof ORDER_STATUS];

export const ORDER_STATUS_TRANSITIONS: Record<
  OrderStatus,
  OrderStatus[]
> = {
  PENDING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["CANCELLED", "PENDING"],      // allow cancelling shipped orders
  CANCELLED: ["SHIPPED", "PENDING"],
};
