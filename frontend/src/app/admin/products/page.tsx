
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { uploadProductImage } from "@/services/storage";
import { useCreateProduct } from "../hooks/useCreateProduct";
import { useQueryClient } from "@tanstack/react-query";
import ImagePreview from "./ImagePreview";
import { Product } from "@/services/types";
import { useGetProducts } from "@/app/products/hooks/useGetProducts";

// export default function AdminProductPage() {
//   const queryClient = useQueryClient();
//   const router = useRouter();
//   const [files, setFiles] = useState<File[]>([]);
//   const [previews, setPreviews] = useState<string[]>([]);

//   const createMutation = useCreateProduct();

//   useEffect(() => {
//   return () => {
//     previews.forEach((url) => URL.revokeObjectURL(url));
//   };
// }, [previews]);
// const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//   const selectedFiles = Array.from(e.target.files || []);

//   // To APPEND files instead of replacing:
//   setFiles((prev) => [...prev, ...selectedFiles]);

//   const newPreviewUrls = selectedFiles.map((file) => URL.createObjectURL(file));
//   setPreviews((prev) => [...prev, ...newPreviewUrls]);
// };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     const form = e.currentTarget;
//     const formData = new FormData(form);

//     const name = formData.get("name") as string;
//     const description = formData.get("description") as string;
//     const price = Number(formData.get("price"));
//     const stock = Number(formData.get("stock"));

//     let image_urls: string[] = [];

//     if (files.length) {
//       image_urls = await Promise.all(
//         files.map((file) => uploadProductImage(file))
//       );
//     }

//     createMutation.mutate(
//       { name, description, price, stock, image_urls },
//       {
//         onSuccess: () => {
//           queryClient.invalidateQueries({ queryKey: ["products"] });
//           router.push("/products");
//         },
//       }
//     );
//   };

//   return (
//     <div className="max-w-md mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-4">Create Product</h1>

//       <form onSubmit={handleSubmit} className="space-y-3">
//         <input
//           name="name"
//           placeholder="Name"
//           required
//           className="w-full p-2 border rounded"
//         />

//         <textarea
//           name="description"
//           placeholder="Description"
//           className="w-full p-2 border rounded"
//         />

//         <input
//           name="price"
//           type="number"
//           step="0.01"
//           placeholder="Price"
//           required
//           className="w-full p-2 border rounded"
//         />

//         <input
//           name="stock"
//           type="number"
//           min="0"
//           placeholder="Stock"
//           required
//           className="w-full p-2 border rounded"
//         />

//         <input
//           type="file"
//           accept="image/*"
//           multiple
//           onChange={handleFileChange}
//           className="w-full"
//         />

//         <div className="grid grid-cols-3 gap-2">
//           {previews.map((src, i) => (
//             <ImagePreview key={i} src={src} />
//           ))}
//         </div>

//         <button
//           type="submit"
//           disabled={createMutation.isPending}
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           {createMutation.isPending ? "Creating..." : "Create Product"}
//         </button>
//       </form>

//       {createMutation.isError && (
//         <p className="text-red-500 mt-2">
//           {(createMutation.error as Error).message}
//         </p>
//       )}
//     </div>
//   );
// }

type FormErrors = {
  name?: string;
  description?: string;
  price?: string;
  stock?: string;
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

  const { data, isLoading } =useGetProducts(page);

  const createMutation = useCreateProduct();

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
    if (!description?.trim())
      newErrors.description = "Description is required";
    if (!price) newErrors.price = "Price is required";
    if (!stock) newErrors.stock = "Stock is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name}</p>
          )}
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
                    <th className="border p-2">Price</th>
                    <th className="border p-2">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.data.map((p: Product) => (
                    <tr key={p.id}>
                      <td className="border p-2">{p.name}</td>
                      <td className="border p-2">${p.price}</td>
                      <td className="border p-2">{p.stock}</td>
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

              <span>Page {page} of {data?.totalPages}</span>

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
    </div>
  );
}