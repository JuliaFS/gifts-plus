"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

import { uploadProductImage } from "@/services/storage";
import { useCreateProduct } from "../hooks/useCreateProduct";
import { useDeleteProduct } from "../hooks/useDeleteProduct";
import { useGetProducts } from "@/app/products/hooks/useGetProducts";
import { useCategories } from "@/services/hooks/useCategories";
import { Product, Category } from "@/services/types";

import ImagePreview from "./ImagePreview";
import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";
import EditProductModal from "./EditProductModal";

type FormErrors = {
  name?: string;
  description?: string;
  price?: string;
  stock?: string;
  sales_price?: string;
  sale_start_at?: string;
  sale_end_at?: string;
};

export default function AdminProductPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  /* ---------- CREATE FORM ---------- */
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  /* ---------- TABLE / MODAL ---------- */
  const [page, setPage] = useState(1);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { data: productsData, isLoading: productsLoading } =
    useGetProducts(page);
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories();
  const createMutation = useCreateProduct();
  const deleteMutation = useDeleteProduct();

  /* ---------- CLEANUP ---------- */
  useEffect(() => {
    return () => {
      previews.forEach(URL.revokeObjectURL);
    };
  }, [previews]);

  /* ---------- HELPERS ---------- */
  const clearError = (field: keyof FormErrors) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateForm = (formData: FormData) => {
    const e: FormErrors = {};
    if (!formData.get("name")) e.name = "Name is required";
    if (!formData.get("description")) e.description = "Description is required";
    if (!formData.get("price")) e.price = "Price is required";
    if (!formData.get("stock")) e.stock = "Stock is required";
    setErrors(e);

    const salesPrice = Number(formData.get("sales_price"));
    const startDate = formData.get("sale_start_at") as string;
    const endDate = formData.get("sale_end_at") as string;

    if (salesPrice > 0) {
      if (!startDate) e.sale_start_at = "Start date is required with a sales price.";
      if (!endDate) e.sale_end_at = "End date is required with a sales price.";
    }

    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      e.sale_end_at = "End date must be after the start date.";
    }
    return Object.keys(e).length === 0;
  };

  /* ---------- CREATE ---------- */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    setFiles((p) => [...p, ...selected]);
    setPreviews((p) => [...p, ...selected.map(URL.createObjectURL)]);
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (!validateForm(formData)) return;

    const image_urls = await Promise.all(
      files.map((file) => uploadProductImage(file))
    );

    const sales_price = formData.get("sales_price") ? Number(formData.get("sales_price")) : null;
    const sale_start_at = (formData.get("sale_start_at") as string) || null;
    const sale_end_at = (formData.get("sale_end_at") as string) || null;

    createMutation.mutate(
      {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        price: Number(formData.get("price")),
        stock: Number(formData.get("stock")),
        image_urls,
        category_ids: selectedCategories, // pass selected categories
        sales_price,
        sale_start_at,
        sale_end_at,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["products"] });
          router.push("/products");
        },
      }
    );
  };

  /* ---------- DELETE ---------- */
  const handleDelete = (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteMutation.mutate(productId);
    }
  };

  /* ---------------- RENDER ---------------- */

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-10">
      {/* ================= LINKS ================= */}
      <div className="flex gap-4 mb-6">
        <Link
          href="/admin/orders"
          className="text-purple-500 hover:underline font-bold"
        >
          View Orders
        </Link>
        <Link
          href="/products"
          className="text-purple-500 hover:underline font-bold"
        >
          Products
        </Link>
      </div>

      {/* ================= CREATE FORM ================= */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">Create Product</h1>
          <Link
            href="/admin/categories"
            className="text-purple-600 font-bold hover:underline"
          >
            Create Category
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Name */}
          <input
            name="name"
            placeholder="Name"
            className="w-full p-2 border rounded mb-2"
            onChange={() => clearError("name")}
          />
          {errors.name && <p className="text-red-500">{errors.name}</p>}

          {/* Description */}
          <textarea
            name="description"
            placeholder="Description"
            className="w-full p-2 border rounded mb-2"
            onChange={() => clearError("description")}
          />
          {errors.description && (
            <p className="text-red-500">{errors.description}</p>
          )}

          {/* Price */}
          <input
            name="price"
            type="number"
            step="0.01"
            className="w-full p-2 border rounded mb-2"
            placeholder="Enter price..."
            onChange={() => clearError("price")}
          />
          {errors.price && <p className="text-red-500">{errors.price}</p>}

          {/* Stock */}
          <input
            name="stock"
            type="number"
            className="w-full p-2 border rounded mb-2"
            placeholder="Enter stock..."
            onChange={() => clearError("stock")}
          />
          {errors.stock && <p className="text-red-500">{errors.stock}</p>}

          {/* Sales Price */}
          <input
            name="sales_price"
            type="number"
            step="0.01"
            className="w-full p-2 border rounded mb-2"
            placeholder="Sales Price (optional)"
            onChange={() => clearError("sales_price")}
          />
          {errors.sales_price && <p className="text-red-500">{errors.sales_price}</p>}

          {/* Sale Start Date */}
          <label className="block mb-1 font-medium">Sale Start Date</label>
          <input
            name="sale_start_at"
            type="date"
            className="w-full p-2 border rounded mb-2"
            onChange={() => clearError("sale_start_at")}
          />
          {errors.sale_start_at && (
            <p className="text-red-500">{errors.sale_start_at}</p>
          )}

          {/* Sale End Date */}
          <label className="block mb-1 font-medium">Sale End Date</label>
          <input
            name="sale_end_at"
            type="date"
            className="w-full p-2 border rounded mb-2"
            onChange={() => clearError("sale_end_at")}
          />
          {errors.sale_end_at && <p className="text-red-500">{errors.sale_end_at}</p>}

          {/* Categories */}
          <label className="block mb-1 font-medium">Categories</label>
          <div className="flex items-center justify-between mb-2">
            <label className="font-medium">Categories</label>
            <Link
              href="/admin/categories"
              className="text-purple-500 font-bold hover:underline text-sm"
            >
              + Add Category
            </Link>
          </div>

          {categoriesLoading ? (
            <p>Loading categories...</p>
          ) : (
            <select
              multiple
              className="w-full p-2 border rounded mb-2"
              value={selectedCategories}
              onChange={(e) =>
                setSelectedCategories(
                  Array.from(e.target.selectedOptions, (opt) => opt.value)
                )
              }
            >
              {categories.map((cat: Category) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          )}

          {/* Images */}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />

          <div className="grid grid-cols-3 gap-2">
            {previews.map((src, i) => (
              <ImagePreview key={i} src={src} />
            ))}
          </div>

          <button
            type="submit"
            className="flex-1 bg-purple-600 cursor-pointer hover:bg-purple-600 text-white font-bold px-3 py-2 rounded"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "Creating..." : "Create Product"}
          </button>
        </form>
      </div>

      {/* ================= PRODUCTS TABLE ================= */}
      <div>
        <h2 className="text-xl font-bold mb-3">Available Products</h2>

        {productsLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            <table className="w-full border">
              <thead>
                <tr>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Image</th>
                  <th className="border p-2">Price</th>
                  <th className="border p-2">Stock</th>
                  <th className="border p-2">Categories</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {productsData?.data.map((p: Product) => (
                  <tr key={p.id}>
                    <td className="border p-2">{p.name}</td>
                    <td className="border p-2">
                      {p.product_images?.[0] && (
                        <Image
                          src={p.product_images[0].image_url}
                          alt={p.name}
                          width={64}
                          height={64}
                        />
                      )}
                    </td>
                    <td className="border p-2">${Number(p.price).toFixed(2)}</td>
                    <td className="border p-2">{p.stock}</td>
                    <td className="border p-2">
                      {p.product_categories
                        ?.map((c) => c.categories.name)
                        .join(", ")}
                    </td>
                    <td className="border p-2">
                      <div className="flex gap-2 justify-center">
                        <EditButton product={p} onEdit={setEditingProduct} />
                        <DeleteButton
                          productId={p.id}
                          onDelete={handleDelete}
                          isDeleting={deleteMutation.isPending}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex gap-3 mt-4 justify-center">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Prev
              </button>
              <span>
                Page {page} of {productsData?.totalPages}
              </span>
              <button
                disabled={page === productsData?.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {/* ================= EDIT MODAL ================= */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
        />
      )}
    </div>
  );
}
