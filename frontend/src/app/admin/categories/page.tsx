"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createCategory, fetchCategories } from "@/services/categories";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@/services/types";

export default function CreateCategoryPage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  // Track last attempted values (to detect changes after error)
  const [lastAttempt, setLastAttempt] = useState({ name: "", slug: "" });

  const queryClient = useQueryClient();
  const router = useRouter();

  // Fetch existing categories
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 5,
  });

  // Determine if form changed after error
  const hasChangedAfterError =
    name !== lastAttempt.name || slug !== lastAttempt.slug;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim() || !slug.trim()) {
      setError("Name and slug are required.");
      return;
    }

    setError(null);
    setIsPending(true);

    try {
      await createCategory(name, slug);
      queryClient.invalidateQueries({ queryKey: ["categories"] });

      // Clear inputs on success
      setName("");
      setSlug("");
      setLastAttempt({ name: "", slug: "" });

      router.push("/admin/categories");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create category.");
      }

      // Save last attempted values to disable button until changed
      setLastAttempt({ name, slug });
    } finally {
      setIsPending(false);
    }
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (error) setError(null); // clear error on typing
  };

  const handleSlugChange = (value: string) => {
    setSlug(value);
    if (error) setError(null); // clear error on typing
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4 text-green-500">Create Category</h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Category Name"
          className="w-full p-2 border rounded"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
        />

        <input
          type="text"
          placeholder="Slug (e.g. category-slug)"
          className="w-full p-2 border rounded"
          value={slug}
          onChange={(e) => handleSlugChange(e.target.value)}
        />

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isPending || (!!error && !hasChangedAfterError)}
        >
          {isPending ? "Creating..." : "Create Category"}
        </button>
      </form>

      {/* Display existing categories */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Existing Categories</h2>
        {isLoading ? (
          <p>Loading categories...</p>
        ) : (
          <pre className="bg-gray-100 p-2 rounded max-h-64 overflow-auto">
            {JSON.stringify(categories, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}


