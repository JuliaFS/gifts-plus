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
  const { data, error } = await supabase
    .from("products_by_category")
    .select("*")
    .eq("category_slug", slug);

  if (error) throw error;
  if (!data || data.length === 0) {
    return {
      name: slug.replace(/-/g, " "),
      products: [],
    };
  }

  // ✅ Extract category name ONCE
  const categoryName = data[0].category_name;

  // ✅ Group products (your existing logic, slightly cleaned)
  const productsMap: Record<string, any> = {};

  data.forEach((row) => {
    const productId = row.product_id;

    if (!productsMap[productId]) {
      productsMap[productId] = {
        id: row.product_id,
        name: row.product_name,
        price: row.price,
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
