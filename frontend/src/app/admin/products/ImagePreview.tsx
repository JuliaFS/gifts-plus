import Image from "next/image";

export default function ImagePreview({ src }: { src: string }) {
  return (
    <Image
      src={src}
      alt="Preview"
      width={128}
      height={128}
      sizes="128px"
      unoptimized
      className="object-cover rounded"
    />
  );
}

