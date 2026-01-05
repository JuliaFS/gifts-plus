"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { uploadProductImage } from "@/services/storage";
import { deleteProductImages } from "@/services/products";
import { useCreateProduct } from "../hooks/useCreateProduct";
import { useDeleteProduct } from "../hooks/useDeleteProduct";
import { useUpdateProduct } from "../hooks/useUpdateProduct";
import { useQueryClient } from "@tanstack/react-query";
import ImagePreview from "./ImagePreview";
import { Product } from "@/services/types";
import { useGetProducts } from "@/app/products/hooks/useGetProducts";

type FormErrors = {
  name?: string;
  description?: string;
  price?: string;
  stock?: string;
};

type EditingProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
};

type EditingImages = {
  existing: string[];
  new: File[];
};

export default function AdminProductPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  /* ---------- FORM STATE ---------- */

  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});

  /* ---------- PRODUCTS TABLE ---------- */

  const [page, setPage] = useState(1);
  const [editingProduct, setEditingProduct] = useState<EditingProduct | null>(
    null
  );
  const [editErrors, setEditErrors] = useState<FormErrors>({});
  const [editImages, setEditImages] = useState<EditingImages>({
    existing: [],
    new: [],
  });
  const [editImagePreviews, setEditImagePreviews] = useState<string[]>([]);
  const [originalImages, setOriginalImages] = useState<string[]>([]);

  const { data, isLoading } = useGetProducts(page);

  const createMutation = useCreateProduct();
  const deleteMutation = useDeleteProduct();
  const updateMutation = useUpdateProduct();

  /* ---------- CLEANUP ---------- */

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  /* ---------- HELPERS ---------- */

  const clearError = (field: keyof FormErrors) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateForm = (formData: FormData) => {
    const newErrors: FormErrors = {};

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const stock = formData.get("stock") as string;

    if (!name?.trim()) newErrors.name = "Name is required";
    if (!description?.trim()) newErrors.description = "Description is required";
    if (!price) newErrors.price = "Price is required";
    if (!stock) newErrors.stock = "Stock is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateEditForm = () => {
    const newErrors: FormErrors = {};

    if (!editingProduct?.name?.trim()) newErrors.name = "Name is required";
    if (!editingProduct?.description?.trim())
      newErrors.description = "Description is required";
    if (!editingProduct?.price) newErrors.price = "Price is required";
    if (editingProduct?.stock === undefined)
      newErrors.stock = "Stock is required";

    setEditErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = (product: Product) => {
    setEditingProduct({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
    });
    setEditErrors({});

    // Initialize existing images
    const existingImageUrls =
      product.product_images?.map((img) => img.image_url) || [];
    setEditImages({ existing: existingImageUrls, new: [] });
    setEditImagePreviews([]);
    setOriginalImages(existingImageUrls);
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    setEditImages((prev) => ({
      ...prev,
      new: [...prev.new, ...selectedFiles],
    }));

    setEditImagePreviews((prev) => [
      ...prev,
      ...selectedFiles.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const handleRemoveExistingImage = (index: number) => {
    setEditImages((prev) => ({
      ...prev,
      existing: prev.existing.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveNewImage = (index: number) => {
    setEditImagePreviews((prev) => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index]);
      return newPreviews.filter((_, i) => i !== index);
    });

    setEditImages((prev) => ({
      ...prev,
      new: prev.new.filter((_, i) => i !== index),
    }));
  };

  const handleSaveEdit = async () => {
    if (!editingProduct || !validateEditForm()) return;

    try {
      // Find images that were removed
      const removedImages = originalImages.filter(
        (img) => !editImages.existing.includes(img)
      );

      // Delete removed images from backend
      if (removedImages.length > 0) {
        await deleteProductImages(editingProduct.id, removedImages);
      }

      // Upload new images
      let newImageUrls: string[] = [];
      if (editImages.new.length > 0) {
        newImageUrls = await Promise.all(
          editImages.new.map((file) => uploadProductImage(file))
        );
      }

      // Update product details
      updateMutation.mutate(
        {
          productId: editingProduct.id,
          updates: {
            name: editingProduct.name,
            description: editingProduct.description,
            price: editingProduct.price,
            stock: editingProduct.stock,
            ...(newImageUrls.length > 0 && { image_urls: newImageUrls }),
          },
        },
        {
          onSuccess: () => {
            setEditingProduct(null);
            setEditErrors({});
            setEditImages({ existing: [], new: [] });
            setEditImagePreviews([]);
            setOriginalImages([]);
          },
        }
      );
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Error saving product. Please try again.");
    }
  };

  const handleDelete = (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteMutation.mutate(productId);
    }
  };

  /* ---------- FILE UPLOAD ---------- */

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    setFiles((prev) => [...prev, ...selectedFiles]);
    setPreviews((prev) => [
      ...prev,
      ...selectedFiles.map((file) => URL.createObjectURL(file)),
    ]);
  };

  /* ---------- SUBMIT ---------- */

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    if (!validateForm(formData)) return;

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const stock = Number(formData.get("stock"));

    let image_urls: string[] = [];

    if (files.length) {
      image_urls = await Promise.all(
        files.map((file) => uploadProductImage(file))
      );
    }

    createMutation.mutate(
      { name, description, price, stock, image_urls },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["products"] });
          router.push("/products");
        },
      }
    );
  };

  /* ---------------- RENDER ---------------- */

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-10">
      {/* ================= FORM ================= */}

      <div>
        <h1 className="text-2xl font-bold mb-4">Create Product</h1>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* NAME */}
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          <input
            name="name"
            placeholder="Name"
            className="w-full p-2 border rounded"
            onChange={() => clearError("name")}
          />

          {/* DESCRIPTION */}
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description}</p>
          )}
          <textarea
            name="description"
            placeholder="Description"
            className="w-full p-2 border rounded"
            onChange={() => clearError("description")}
          />

          {/* PRICE */}
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price}</p>
          )}
          <input
            name="price"
            type="number"
            step="0.01"
            placeholder="Price"
            className="w-full p-2 border rounded"
            onChange={() => clearError("price")}
          />

          {/* STOCK */}
          {errors.stock && (
            <p className="text-red-500 text-sm">{errors.stock}</p>
          )}
          <input
            name="stock"
            type="number"
            min="0"
            placeholder="Stock"
            className="w-full p-2 border rounded"
            onChange={() => clearError("stock")}
          />

          {/* IMAGES (OPTIONAL) */}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />

          <div className="grid grid-cols-3 gap-2">
            {previews.map((src, i) => (
              <ImagePreview key={i} src={src} />
            ))}
          </div>

          <button
            type="submit"
            disabled={createMutation.isPending}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {createMutation.isPending ? "Creating..." : "Create Product"}
          </button>

          {createMutation.isError && (
            <p className="text-red-500">
              {(createMutation.error as Error).message}
            </p>
          )}
        </form>
      </div>

      {/* ================= TABLE ================= */}

      <div>
        <h2 className="text-xl font-bold mb-3">Available Products</h2>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">Name</th>
                    <th className="border p-2">Image</th>
                    <th className="border p-2">Price</th>
                    <th className="border p-2">Stock</th>
                    <th className="border p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.data.map((p: Product) => (
                    <tr key={p.id}>
                      <td className="border p-2">{p.name}</td>
                      <td className="border p-2">
                        {p.product_images && p.product_images.length > 0 ? (
                          <div className="flex justify-center items-center">
                          <Image
                            src={p.product_images[0].image_url}
                            alt={p.name}
                            width={64}
                            height={64}
                            className="object-cover rounded"
                          />
                          </div>
                        ) : (
                          <span>No Image</span>
                        )}
                      </td>
                      <td className="border p-2">${p.price}</td>
                      <td className="border p-2">{p.stock}</td>
                      <td className="border p-2">
                        <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => handleEdit(p)}
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          disabled={deleteMutation.isPending}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                        >
                          {deleteMutation.isPending ? "Deleting..." : "Delete"}
                        </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="flex gap-3 mt-4 items-center">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>

              <span>
                Page {page} of {data?.totalPages}
              </span>

              <button
                disabled={page === data?.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {/* ================= EDIT MODAL ================= */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Edit Product</h2>

            <div className="space-y-3">
              {/* NAME */}
              {editErrors.name && (
                <p className="text-red-500 text-sm">{editErrors.name}</p>
              )}
              <input
                type="text"
                value={editingProduct.name}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, name: e.target.value })
                }
                placeholder="Name"
                className="w-full p-2 border rounded"
              />

              {/* DESCRIPTION */}
              {editErrors.description && (
                <p className="text-red-500 text-sm">{editErrors.description}</p>
              )}
              <textarea
                value={editingProduct.description}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    description: e.target.value,
                  })
                }
                placeholder="Description"
                className="w-full p-2 border rounded"
              />

              {/* PRICE */}
              {editErrors.price && (
                <p className="text-red-500 text-sm">{editErrors.price}</p>
              )}
              <input
                type="number"
                step="0.01"
                value={editingProduct.price}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    price: Number(e.target.value),
                  })
                }
                placeholder="Price"
                className="w-full p-2 border rounded"
              />

              {/* STOCK */}
              {editErrors.stock && (
                <p className="text-red-500 text-sm">{editErrors.stock}</p>
              )}
              <input
                type="number"
                min="0"
                value={editingProduct.stock}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    stock: Number(e.target.value),
                  })
                }
                placeholder="Stock"
                className="w-full p-2 border rounded"
              />

              {/* IMAGES */}
              <div className="border-t pt-3">
                <label className="block text-sm font-semibold mb-2">
                  Product Images
                </label>

                {/* Existing Images */}
                {editImages.existing.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-600 mb-2">
                      Current Images:
                    </p>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {editImages.existing.map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={url}
                            alt={`existing-${index}`}
                            className="w-full h-20 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveExistingImage(index)}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Images */}
                {editImagePreviews.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-600 mb-2">New Images:</p>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {editImagePreviews.map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={url}
                            alt={`new-${index}`}
                            className="w-full h-20 object-cover rounded border border-green-400"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveNewImage(index)}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload New Images */}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleEditImageChange}
                  className="w-full text-sm"
                />
              </div>

              {/* BUTTONS */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSaveEdit}
                  disabled={updateMutation.isPending}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {updateMutation.isPending ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setEditErrors({});
                  }}
                  className="flex-1 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>

              {updateMutation.isError && (
                <p className="text-red-500 text-sm">
                  {(updateMutation.error as Error).message}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
