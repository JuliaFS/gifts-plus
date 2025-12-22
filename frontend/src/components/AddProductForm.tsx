// "use client";

// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { createProduct } from "@/services/products";

// export default function AddProductForm() {
//   const queryClient = useQueryClient();

//   const mutation = useMutation({
//     mutationFn: createProduct,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["products"] });
//     },
//   });

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const form = e.currentTarget;

//     mutation.mutate({
//       name: form.name.value,
//       description: form.description.value,
//       price: Number(form.price.value),
//       stock: Number(form.stock.value), // 🔑 pieces
//       image_url: form.image_url.value,
//     });
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
//       <input name="name" placeholder="Name" required />
//       <textarea name="description" placeholder="Description" />
//       <input name="price" type="number" step="0.01" required />
//       <input name="stock" type="number" min="0" required />
//       <input name="image_url" placeholder="Image URL" />

//       <button type="submit">Add product</button>
//     </form>
//   );
// }
