"use client";

import { useEffect, useState } from "react";

export type ImageState = {
  existing: string[];
  new: File[];
  previews: string[];
};

export function useProductImages(initialImages: string[] = []) {
  const [images, setImages] = useState<ImageState>({
    existing: initialImages,
    new: [],
    previews: [],
  });

  const addImages = (files: File[]) => {
    const previews = files.map((file) => URL.createObjectURL(file));

    setImages((prev) => ({
      existing: prev.existing,
      new: [...prev.new, ...files],
      previews: [...prev.previews, ...previews],
    }));
  };

  const removeExisting = (index: number) => {
    setImages((prev) => ({
      ...prev,
      existing: prev.existing.filter((_, i) => i !== index),
    }));
  };

  const removeNew = (index: number) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev.previews[index]);

      return {
        ...prev,
        new: prev.new.filter((_, i) => i !== index),
        previews: prev.previews.filter((_, i) => i !== index),
      };
    });
  };

  useEffect(() => {
    return () => {
      images.previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images.previews]);

  return {
    images,
    addImages,
    removeExisting,
    removeNew,
    reset: () =>
      setImages({
        existing: initialImages,
        new: [],
        previews: [],
      }),
  };
}
