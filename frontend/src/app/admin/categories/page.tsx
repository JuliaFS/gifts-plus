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
  const [success, setSuccess] = useState<string | null>(null);

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
      const result = await createCategory(name, slug);

      setSuccess(result.message); // ✅ BACKEND MESSAGE
      setError(null);

      queryClient.invalidateQueries({ queryKey: ["categories"] });

      setName("");
      setSlug("");
      setLastAttempt({ name: "", slug: "" });
      router.push("/admin/categories");
    } catch (err) {
      setSuccess(null);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create category.");
      }

      setLastAttempt({ name, slug });
    }
    setIsPending(false);
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const handleSlugChange = (value: string) => {
    setSlug(value);
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4 text-green-500">
        Create Category
      </h1>

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
      {success && (
        <p className="text-green-600 font-medium mt-2">
          {success
            .split('"')
            .map((part, i) =>
              i % 2 === 1 ? <strong key={i}>{`"${part}"`}</strong> : part
            )}
        </p>
      )}

      {/* Display existing categories */}
      <div className="mt-6 container">
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
