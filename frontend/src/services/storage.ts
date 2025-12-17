import { supabase } from "../lib/supabase";

/**
 * Uploads a file to Supabase Storage and returns a URL.
 * @param file - File object to upload
 * @param bucketName - Name of the Supabase bucket
 * @param isPublic - Whether the bucket is public or private
 * @param expiresIn - Expiration time in seconds for signed URL (only for private)
 * @returns URL to access the uploaded file
 */
export async function uploadProductImage(
  file: File,
  bucketName: string = "products",
  isPublic: boolean = true,
  expiresIn: number = 60 // signed URL valid for 1 minute
) {
  const fileExt = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = fileName; // you can also use a folder like `uploads/${fileName}`

  // Upload file
  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  // Return URL
  if (isPublic) {
    const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
    return data.publicUrl;
  } else {
    const { data, error: signedError } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(filePath, expiresIn);

    if (signedError) throw signedError;
    return data.signedUrl;
  }
}

//for public bucket
// import { supabase } from "../lib/supabase";

// export async function uploadProductImage(file: File) {
//   const fileExt = file.name.split(".").pop();
//   const fileName = `${crypto.randomUUID()}.${fileExt}`;
//   const filePath = fileName; // or use folder: `uploads/${fileName}`

//   // Upload file
//   const { error } = await supabase.storage
//     .from("products")
//     .upload(filePath, file);

//   if (error) throw error;

//   // Get public URL
//   const { data } = supabase.storage
//     .from("products")
//     .getPublicUrl(filePath);

//   return data.publicUrl;
// }


