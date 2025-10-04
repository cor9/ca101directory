import { createServerClient } from "./supabase";

/**
 * Helper functions for constructing image URLs from Supabase Storage
 */

/**
 * Get Supabase Storage URL for listing images
 */
export function getListingImageUrl(filename: string): string {
  if (!filename) return "";

  // If it's already a full URL (from old Vercel Blob or external), return as-is
  if (filename.startsWith("http")) {
    return filename;
  }

  // Otherwise, construct Supabase Storage URL
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  return `${supabaseUrl}/storage/v1/object/public/listing-images/${filename}`;
}

/**
 * Parse gallery images from database
 */
export function parseGalleryImages(galleryString: string | null): string[] {
  if (!galleryString) return [];

  try {
    const parsed = JSON.parse(galleryString);
    if (Array.isArray(parsed)) {
      return parsed.map((url) => {
        // Convert old Vercel Blob URLs to new Supabase URLs
        if (url.includes("vercel-storage.com")) {
          const filename = url.split("/").pop();
          return filename ? getListingImageUrl(filename) : url;
        }
        return url;
      });
    }
  } catch (error) {
    console.error("Failed to parse gallery images:", error);
  }

  return [];
}
