import { Product } from "@/services/types";

type BadgeType = "NEW" | "SALE" | "HOT";

/**
 * Computes badges for a product based on its properties.
 * @param product The product to compute badges for.
 * @returns An array of badge strings.
 */
export function getBadges(product: Product): BadgeType[] {
  const badges: BadgeType[] = [];
  const TWENTY_DAYS_MS = 20 * 24 * 60 * 60 * 1000;
  const referenceTime = new Date().getTime();

  // Check for NEW badge
  if (new Date(product.created_at).getTime() >= referenceTime - TWENTY_DAYS_MS) {
    badges.push("NEW");
  }

  // Check for SALE badge
  if (product.sales_price != null && product.sales_price > 0) {
    badges.push("SALE");
  }

  // Check for HOT badge
  if (product.sales_count != null && product.sales_count >= 50) {
    badges.push("HOT");
  }

  return badges;
}