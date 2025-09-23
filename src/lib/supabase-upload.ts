export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Upload logo to Supabase Storage via API route (uses 'public' bucket)
 */
export async function uploadLogoToSupabase(
  file: File,
  businessSlug?: string,
): Promise<UploadResult> {
  try {
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

    // Create form data
    const formData = new FormData();
    formData.append("file", file);
    if (businessSlug) {
      formData.append("businessSlug", businessSlug);
    }

    // Upload via API route
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || "Upload failed",
      };
    }

    return {
      success: true,
      url: result.url,
    };
  } catch (error) {
    console.error("Upload error:", error);
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
