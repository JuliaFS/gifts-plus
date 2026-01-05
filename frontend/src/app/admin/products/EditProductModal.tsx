"use client";

import Image from "next/image";
import { useState } from "react";
import { Product } from "@/services/types";
import { uploadProductImage } from "@/services/storage";
import { deleteProductImages } from "@/services/products";
import { useUpdateProduct } from "@/app/admin/hooks/useUpdateProduct";
import { useProductImages } from "../hooks/useProductImages";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  product: Product;
  onClose: () => void;
};

type Errors = {
  name?: string;
  description?: string;
  price?: string;
  stock?: string;
};

export default function EditProductModal({ product, onClose }: Props) {
  const updateMutation = useUpdateProduct();

  const [form, setForm] = useState({
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
  });

  const [errors, setErrors] = useState<Errors>({});
  const queryClient = useQueryClient();

  const initialImages = product.product_images?.map((i) => i.image_url) || [];

  const { images, addImages, removeExisting, removeNew } =
    useProductImages(initialImages);

  const validate = () => {
    const e: Errors = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.price) e.price = "Price is required";
    if (form.stock === undefined) e.stock = "Stock is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = async () => {
    if (!validate()) return;

    const removedImages = initialImages.filter(
      (url) => !images.existing.includes(url)
    );

    if (removedImages.length) {
      await deleteProductImages(product.id, removedImages);
    }

    const newImageUrls = images.new.length
      ? await Promise.all(images.new.map((file) => uploadProductImage(file)))
      : [];

    updateMutation.mutate(
      {
        productId: product.id,
        updates: {
          ...form,
          ...(newImageUrls.length && { image_urls: newImageUrls }),
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["product", product.id],
          });

          onClose(); // close modal
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Product</h2>

        {/* FORM */}
        <input
          className="w-full p-2 border rounded mb-2"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        {errors.name && <p className="text-red-500">{errors.name}</p>}

        <textarea
          className="w-full p-2 border rounded mb-2"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        {errors.description && (
          <p className="text-red-500">{errors.description}</p>
        )}

        <input
          type="number"
          className="w-full p-2 border rounded mb-2"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
        />
        {errors.price && <p className="text-red-500">{errors.price}</p>}

        {/* <input
          type="number"
          className="w-full p-2 border rounded mb-4"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
        /> */}
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={form.stock}
          className="w-full p-2 border rounded mb-2"
          placeholder="Enter stock..."
          onChange={(e) => {
            const value = e.target.value;

            // allow only digits
            if (/^\d*$/.test(value)) {
              setForm({ ...form, stock: value });
              clearError("stock");
            }
          }}
        />

        {errors.stock && <p className="text-red-500">{errors.stock}</p>}

        {/* EXISTING IMAGES */}
        {images.existing.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-3">
            {images.existing.map((url, i) => (
              <div key={url} className="relative h-20 w-full">
                <Image
                  src={url}
                  alt="Product image"
                  fill
                  className="object-cover rounded"
                />
                <button
                  onClick={() => removeExisting(i)}
                  className="absolute top-0 right-0 bg-red-500 text-white w-5 h-5 rounded-full text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* NEW IMAGES */}
        {images.previews.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-3">
            {images.previews.map((url, i) => (
              <div key={url} className="relative h-20 w-full">
                <Image
                  src={url}
                  alt="New image preview"
                  fill
                  className="object-cover rounded border border-green-400"
                />
                <button
                  onClick={() => removeNew(i)}
                  className="absolute top-0 right-0 bg-red-500 text-white w-5 h-5 rounded-full text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* UPLOAD */}
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => addImages(Array.from(e.target.files || []))}
        />

        {/* ACTIONS */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={save}
            disabled={updateMutation.isPending}
            className="flex-1 bg-blue-600 text-white py-2 rounded"
          >
            {updateMutation.isPending ? "Saving..." : "Save"}
          </button>

          <button
            onClick={onClose}
            className="flex-1 bg-gray-400 text-white py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
