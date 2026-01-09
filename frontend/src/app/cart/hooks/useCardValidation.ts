// import { useCartStore } from "@/store/cartStore";

// export function useCartValidation() {
//   const removeMany = useCartStore((s) => s.removeMany);

//   const validate = async () => {
//     // Example: remove products with qty <= 0 locally
//     const invalidItems = []; // compute invalid items if needed

//     if (invalidItems.length > 0) {
//       removeMany(invalidItems.map((i) => i.productId));
//       throw new Error(
//         "Some products were removed because they are no longer available."
//       );
//     }

//     return true;
//   };

//   return { validate };
// }

