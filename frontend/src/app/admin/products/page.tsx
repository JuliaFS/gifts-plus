"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadProductImage } from "@/services/storage";
import { useCreateProduct } from "../hooks/useCreateProduct";
import { useQueryClient } from "@tanstack/react-query";
import ImagePreview from "./ImagePreview";

export default function AdminProductPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const createMutation = useCreateProduct();

  // Handle file selection and preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);

    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = (formData.get("name") as string) || "";
    const description = (formData.get("description") as string) || "";
    const price = Number(formData.get("price"));
    const stock = Number(formData.get("stock"));

    let image_url: string | undefined;
    if (file) {
      image_url = await uploadProductImage(file);
    }

    createMutation.mutate(
      { name, description, price, stock, image_url },
      {
        onSuccess: () => {
          router.push("/products");
          queryClient.invalidateQueries({ queryKey: ["products"] });
        },
      }
    );
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create Product</h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="name"
          placeholder="Name"
          required
          className="w-full p-2 border rounded"
        />

        <textarea
          name="description"
          placeholder="Description"
          className="w-full p-2 border rounded"
        />

        <input
          name="price"
          type="number"
          step="0.01"
          placeholder="Price"
          required
          className="w-full p-2 border rounded"
        />

        <input
          name="stock"
          type="number"
          min="0"
          placeholder="Stock"
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full"
          placeholder="Choose image"
        />

        {/* Image preview */}
        {preview && (
          <ImagePreview src={preview} />
        )}

        <button
          type="submit"
          disabled={createMutation.isPending}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {createMutation.isPending ? "Creating..." : "Create Product"}
        </button>
      </form>

      {createMutation.isError && (
        <p className="text-red-500 mt-2">
          {(createMutation.error as Error).message}
        </p>
      )}
    </div>
  );
}
