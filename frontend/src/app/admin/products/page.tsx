"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { uploadProductImage } from "@/services/storage";
import { useCreateProduct } from "../hooks/useCreateProduct";
import { useDeleteProduct } from "../hooks/useDeleteProduct";
import { useGetProducts } from "@/app/products/hooks/useGetProducts";
import { Product } from "@/services/types";

import ImagePreview from "./ImagePreview";
import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";
import EditProductModal from "./EditProductModal";
import Link from "next/link";

type FormErrors = {
  name?: string;
  description?: string;
  price?: string;
  stock?: string;
};

export default function AdminProductPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  /* ---------- CREATE FORM ---------- */
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});

  /* ---------- TABLE / MODAL ---------- */
  const [page, setPage] = useState(1);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { data, isLoading } = useGetProducts(page);
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
    return Object.keys(e).length === 0;
  };

  /* ---------- CREATE ---------- */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    setFiles((p) => [...p, ...selected]);
    setPreviews((p) => [...p, ...selected.map(URL.createObjectURL)]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (!validateForm(formData)) return;

    const image_urls = await Promise.all(
      files.map((file) => uploadProductImage(file))
    );

    createMutation.mutate(
      {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        price: Number(formData.get("price")),
        stock: Number(formData.get("stock")),
        image_urls,
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
      {/* ================= CREATE ================= */}
      <div className="flex gap-4 mb-6">
        <Link
          href="/admin/orders"
          className="text-blue-600 hover:underline font-medium"
        >
          View Orders
        </Link>

        <Link
          href="/products"
          className="text-blue-600 hover:underline font-medium"
        >
          Products
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold mb-4 text-green-500">
          Create Product
        </h1>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="name"
            placeholder="Name"
            className="w-full p-2 border rounded mb-2"
            onChange={() => clearError("name")}
          />
          {errors.name && <p className="text-red-500">{errors.name}</p>}

          <textarea
            name="description"
            placeholder="Description"
            className="w-full p-2 border rounded mb-2"
            onChange={() => clearError("description")}
          />
          {errors.description && (
            <p className="text-red-500">{errors.description}</p>
          )}

          <input
            name="price"
            type="number"
            step="0.01"
            className="w-full p-2 border rounded mb-2"
            placeholder="Enter price..."
            onChange={() => clearError("price")}
          />
          {errors.price && <p className="text-red-500">{errors.price}</p>}

          <input
            name="stock"
            type="number"
            className="w-full p-2 border rounded mb-4"
            placeholder="Enter stock..."
            onChange={() => clearError("stock")}
          />
          {errors.stock && <p className="text-red-500">{errors.stock}</p>}

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
            className="flex-1 bg-blue-600 text-white py-2 rounded"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "Creating..." : "Create Product"}
          </button>
        </form>
      </div>

      {/* ================= TABLE ================= */}
      <div>
        <h2 className="text-xl font-bold mb-3">Available Products</h2>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            <table className="w-full border">
              <thead>
                <tr>
                  <th className="border">Name</th>
                  <th className="border">Image</th>
                  <th className="border">Price</th>
                  <th className="border">Stock</th>
                  <th className="border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.data.map((p: Product) => (
                  <tr key={p.id}>
                    <td className="border">{p.name}</td>
                    <td className="border">
                      {p.product_images?.[0] && (
                        <Image
                          src={p.product_images[0].image_url}
                          alt={p.name}
                          width={64}
                          height={64}
                        />
                      )}
                    </td>
                    <td className="border">${Number(p.price).toFixed(2)}</td>
                    <td className="border">{p.stock}</td>
                    <td className="border">
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
                Page {page} of {data?.totalPages}
              </span>
              <button
                disabled={page === data?.totalPages}
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
