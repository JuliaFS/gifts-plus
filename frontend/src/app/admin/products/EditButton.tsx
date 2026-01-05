"use client";

import { Product } from "@/services/types";

type Props = {
  product: Product;
  onEdit: (product: Product) => void;
};

export default function EditButton({ product, onEdit }: Props) {
  return (
    <button
      onClick={() => onEdit(product)}
      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Edit
    </button>
  );
}
