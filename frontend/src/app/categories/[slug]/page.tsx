"use client";

import { useCategoryWithProducts } from "@/services/hooks/useProductsByCategories";
import * as React from "react";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/services/types";

type Props = {
  params: Promise<{ slug: string }>;
};

export default function CategoryPage({ params }: Props) {
  const resolvedParams = React.use(params);
  const slug = resolvedParams.slug;

  const { data: category, isLoading, isError } = useCategoryWithProducts(slug);

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;
  if (isError || !category) return <p>Failed to load category.</p>;

  return (
    <div className="container mx-auto py-8 px-12 md:px-0">
      <h1 className="text-lg md:text-2xl font-bold mb-6 capitalize text-center">{category.name}</h1>

      {category.products?.length === 0 ? (
        <p>No products found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {category.products.map((product: Product) => (
            <ProductCard
              key={product.id}
              product={product}
              showDescription={false} // optional, hide description for compact cards
            />
          ))}
        </div>
      )}
    </div>
  );
}

// "use client";

// import { useCategoryWithProducts } from "@/services/hooks/useProductsByCategories";
// import Image from "next/image";
// import Link from "next/link";
// import * as React from "react";

// type Props = {
//   params: Promise<{ slug: string }>;
// };

// export default function CategoryPage({ params }: Props) {
//   const resolvedParams = React.use(params);
//   const slug = resolvedParams.slug;

//   const { data: category, isLoading, isError } = useCategoryWithProducts(slug);

//   if (isLoading) return <p>Loading...</p>;
//   if (isError || !category) return <p>Failed to load category.</p>;

//   return (
//     <div className="container mx-auto py-8">
//       <h1 className="text-2xl font-bold mb-6 capitalize">{category.name}</h1>

//       {category.products?.length === 0 ? (
//         <p>No products found in this category.</p>
//       ) : (
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//           {category.products.map((product) => (
//             <Link
//               key={product.id}
//               href={`/products/${product.id}`}
//               className="border rounded p-3 hover:shadow-md transition"
//             >
//               {product.product_images?.[0]?.image_url && (
//                 <div className="relative h-40 mb-2">
//                   <Image
//                     src={product.product_images[0].image_url}
//                     alt={product.name}
//                     fill
//                     className="object-cover rounded"
//                     loading="eager"
//                   />
//                 </div>
//               )}
//               <h3 className="font-medium">{product.name}</h3>
//               <p className="text-green-700 font-bold">{product.price} €</p>
//             </Link>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
