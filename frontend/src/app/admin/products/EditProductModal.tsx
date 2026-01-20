"use client";

import Image from "next/image";
import { useState } from "react";
import { Product, Category } from "@/services/types";
import { uploadProductImage } from "@/services/storage";
import { deleteProductImages, updateProduct } from "@/services/products";
import { useProductImages } from "../hooks/useProductImages";
import { useQueryClient } from "@tanstack/react-query";
import { useCategories } from "@/services/hooks/useCategories";

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
  const queryClient = useQueryClient();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

  // Initialize form state from product
  const [form, setForm] = useState({
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
  });

  // Initialize selected categories from product
  const initialCategoryIds = product.product_categories
    ? product.product_categories.map((c) => c.categories.id)
    : [];

  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategoryIds);

  // Baseline for change detection
  const [initialForm, setInitialForm] = useState(form);
  const [initialSelectedCategories, setInitialSelectedCategories] = useState<string[]>(initialCategoryIds);

  // Images state
  const initialImages = product.product_images?.map((i) => i.image_url) || [];
  const { images, addImages, removeExisting, removeNew } = useProductImages(initialImages);
  const [initialImagesState, setInitialImagesState] = useState(initialImages);

  // Success / error message
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});

  // Clear specific field error
  const clearError = (field: keyof Errors) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // Validation
  const validate = () => {
    const e: Errors = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.price) e.price = "Price is required";
    if (form.stock === undefined) e.stock = "Stock is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // Detect if anything changed
  const hasChanges =
    form.name !== initialForm.name ||
    form.description !== initialForm.description ||
    form.price !== initialForm.price ||
    form.stock !== initialForm.stock ||
    JSON.stringify(selectedCategories) !== JSON.stringify(initialSelectedCategories) ||
    images.new.length > 0 ||
    images.existing.length !== initialImagesState.length;

  // Save function
  const save = async () => {
    if (!validate()) return;

    try {
      // Delete removed images
      const removedImages = initialImagesState.filter((url) => !images.existing.includes(url));
      if (removedImages.length) {
        await deleteProductImages(product.id, removedImages);
      }

      // Upload new images
      const newImageUrls = images.new.length
        ? await Promise.all(images.new.map((file) => uploadProductImage(file)))
        : [];

      // Update product
      await updateProduct(product.id, {
        ...form,
        category_ids: selectedCategories,
        ...(newImageUrls.length && { image_urls: newImageUrls }),
      });

      // Show success message
      setMessage("Product updated successfully");

      // Reset baseline for change detection
      setInitialForm({ ...form });
      setInitialSelectedCategories([...selectedCategories]);
      setInitialImagesState([...images.existing, ...newImageUrls]);
    } catch (err: unknown) {
      if (err instanceof Error) setMessage(err.message);
      else setMessage("Failed to update product.");
    }

    // Refresh queries
    queryClient.invalidateQueries({ queryKey: ["product", product.id] });
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Product</h2>

        {/* Message */}
        {message && (
          <p className={`mb-2 ${message.includes("successfully") ? "text-green-600" : "text-red-500"}`}>
            {message}
          </p>
        )}

        {/* FORM */}
        <input
          className="w-full p-2 border rounded mb-2"
          value={form.name}
          onChange={(e) => {
            setForm({ ...form, name: e.target.value });
            clearError("name");
            setMessage(null);
          }}
        />
        {errors.name && <p className="text-red-500">{errors.name}</p>}

        <textarea
          className="w-full p-2 border rounded mb-2"
          value={form.description}
          onChange={(e) => {
            setForm({ ...form, description: e.target.value });
            clearError("description");
            setMessage(null);
          }}
        />
        {errors.description && <p className="text-red-500">{errors.description}</p>}

        <input
          type="number"
          className="w-full p-2 border rounded mb-2"
          value={form.price}
          onChange={(e) => {
            setForm({ ...form, price: Number(e.target.value) });
            clearError("price");
            setMessage(null);
          }}
        />
        {errors.price && <p className="text-red-500">{errors.price}</p>}

        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={form.stock}
          className="w-full p-2 border rounded mb-2"
          placeholder="Enter stock..."
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value)) {
              setForm({ ...form, stock: Number(value) });
              clearError("stock");
              setMessage(null);
            }
          }}
        />
        {errors.stock && <p className="text-red-500">{errors.stock}</p>}

        {/* Categories */}
        <label className="block mb-1 font-medium">Categories</label>
        {categoriesLoading ? (
          <p>Loading categories...</p>
        ) : (
          <select
            multiple
            className="w-full p-2 border rounded mb-2"
            value={selectedCategories}
            onChange={(e) => {
              setSelectedCategories(Array.from(e.target.selectedOptions, (opt) => opt.value));
              setMessage(null);
            }}
          >
            {categories.map((cat: Category) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        )}

        {/* Images */}
        {images.existing.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-3">
            {images.existing.map((url, i) => (
              <div key={url} className="relative h-20 w-full">
                <Image src={url} alt="Product image" fill className="object-cover rounded" />
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

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => addImages(Array.from(e.target.files || []))}
        />

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={save}
            disabled={!hasChanges}
            className="flex-1 bg-blue-600 text-white py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save
          </button>
          <button onClick={onClose} className="flex-1 bg-gray-400 text-white py-2 rounded">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

