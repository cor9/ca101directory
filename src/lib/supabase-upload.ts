import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
);

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Upload logo to Supabase Storage
 */
export async function uploadLogoToSupabase(
  file: File,
  businessSlug?: string,
): Promise<UploadResult> {
  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return {
        success: false,
        error: "Image upload is temporarily unavailable. Please contact support or try again later.",
      };
    }

    // Validate file size (200KB limit for fast loading)
    const maxSizeInBytes = 200 * 1024; // 200KB
    if (file.size > maxSizeInBytes) {
      return {
        success: false,
        error: "File must be under 200KB for fast loading.",
      };
    }

    // Validate file type
    if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
      return {
        success: false,
        error: "Only JPEG and PNG images are allowed.",
      };
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.type === "image/jpeg" ? "jpg" : "png";
    const slug = businessSlug || "logo";
    const fileName = `${slug}-${timestamp}.${fileExtension}`;

    // Upload to Supabase Storage using the proper API
    const { data, error } = await supabase.storage
      .from('directory-logos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return {
        success: false,
        error: "Upload failed. Please try again.",
      };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('directory-logos')
      .getPublicUrl(fileName);

    return {
      success: true,
      url: publicUrl,
    };
  } catch (error) {
    console.error("Supabase upload error:", error);
    return {
      success: false,
      error: "Upload failed. Please try again.",
    };
  }
}

/**
 * Compress image before upload (optional)
 */
export function compressImage(
  file: File,
  maxWidth = 400,
  quality = 0.8,
): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        },
        file.type,
        quality,
      );
    };

    img.src = URL.createObjectURL(file);
  });
}