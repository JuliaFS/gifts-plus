import { getBadges } from "./productUtils";
import { Product } from "@/services/types";

// Mock Date.now() to get consistent results for the "NEW" badge test
const MOCK_DATE = new Date("2024-01-21T00:00:00.000Z");
jest.spyOn(global, "Date").mockImplementation(() => MOCK_DATE as any);

// Helper to create a mock product, making tests cleaner
const createMockProduct = (overrides: Partial<Product>): Product => {
  return {
    id: "1",
    name: "Test Product",
    description: "A test product",
    price: 100,
    stock: 10,
    created_at: new Date().toISOString(),
    product_images: [],
    product_categories: [],
    ...overrides,
  };
};

describe("getBadges", () => {
  it('should return ["NEW"] for a product created within the last 20 days', () => {
    const product = createMockProduct({
      created_at: new Date("2024-01-20T00:00:00.000Z").toISOString(),
    });
    expect(getBadges(product)).toContain("NEW");
  });

  it('should not return ["NEW"] for a product older than 20 days', () => {
    const product = createMockProduct({
      created_at: new Date("2023-12-01T00:00:00.000Z").toISOString(),
    });
    expect(getBadges(product)).not.toContain("NEW");
  });

  it('should return ["SALE"] for a product with a sales_price', () => {
    const product = createMockProduct({ sales_price: 50 });
    expect(getBadges(product)).toContain("SALE");
  });

  it('should return ["HOT"] for a product with 50 or more sales', () => {
    const product = createMockProduct({ sales_count: 50 });
    expect(getBadges(product)).toContain("HOT");
  });

  it('should not return ["HOT"] for a product with less than 50 sales', () => {
    const product = createMockProduct({ sales_count: 49 });
    expect(getBadges(product)).not.toContain("HOT");
  });

  it("should return multiple badges correctly", () => {
    const product = createMockProduct({
      created_at: new Date("2024-01-20T00:00:00.000Z").toISOString(),
      sales_price: 50,
      sales_count: 100,
    });
    // Use `toEqual` to check for exact array match and order
    expect(getBadges(product)).toEqual(["NEW", "SALE", "HOT"]);
  });

  it("should return an empty array if no conditions are met", () => {
    const product = createMockProduct({
      created_at: new Date("2023-01-01T00:00:00.000Z").toISOString(),
      sales_price: null,
      sales_count: 10,
    });
    expect(getBadges(product)).toEqual([]);
  });
});