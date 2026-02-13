import { supabase } from "../db/supabaseClient";

export async function getCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) throw error;
  return data;
}

export async function createCategory(name: string, slug: string) {
  const { data, error } = await supabase
    .from("categories")
    .insert({ name, slug })
    .select("name, slug")
    .single();

  if (error) {
    // Forward Supabase error message cleanly
    throw new Error(error.message);
  }

  return {
    message: `Category \"${data.name}\" with \"${data.slug}\" is created.`,
    category: data,
  };
}

export async function getProductsByCategory(slug: string) {
  // Join products table to get price and stock
  const { data, error } = await supabase
    .from("products_by_category")
    .select(
      `
    product_id,
    product_name,
    product_price,
    product_stock,
    category_id,
    category_name,
    category_slug,
    image_id,
    image_url,
    image_product_id
  `,
    )
    .eq("category_slug", slug);

  if (error) throw error;
  if (!data || data.length === 0) {
    const { data: category } = await supabase
      .from("categories")
      .select("name")
      .eq("slug", slug)
      .single();

    return {
      name: category?.name ?? slug.replace(/-/g, " "),
      products: [],
    };
  }

  const categoryName = data[0]?.category_name ?? slug.replace(/-/g, " ");

  const productsMap: Record<string, any> = {};

  data.forEach((row) => {
    const productId = row.product_id;
    console.log("Processing row:", row);

    if (!productsMap[productId]) {
      productsMap[productId] = {
        id: row.product_id,
        name: row.product_name,
        price: row.product_price ?? 0, // get price from joined products table
        stock: row.product_stock ?? 0, // get stock from joined products table
        product_images: [],
      };
    }

    if (row.image_id) {
      productsMap[productId].product_images.push({
        id: row.image_id,
        image_url: row.image_url,
        product_id: row.image_product_id,
      });
    }
  });

  return {
    name: categoryName,
    products: Object.values(productsMap),
  };
}
