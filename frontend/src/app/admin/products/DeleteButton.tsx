"use client";

type Props = {
  productId: string;
  onDelete: (productId: string) => void;
  isDeleting?: boolean;
};

export default function DeleteButton({ productId, onDelete, isDeleting }: Props) {
  return (
    <button
      onClick={() => onDelete(productId)} // pass the id to the callback
      disabled={isDeleting}
      className="px-3 py-1 bg-red-500 text-white rounded cursor-pointer hover:bg-red-600 disabled:opacity-50"
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}
