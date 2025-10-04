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

  // Normalize any stored path variants to avoid double bucket prefixes
  // Supported inputs:
  // - "filename.jpg"
  // - "listing-images/filename.jpg"
  // - "storage/v1/object/public/listing-images/filename.jpg"
  // - "/storage/v1/object/public/listing-images/filename.jpg"
  let normalizedPath = filename.replace(
    /^\/?storage\/v1\/object\/public\//,
    "",
  );

  // If path already contains the bucket segment, keep it; otherwise prepend it
  if (!normalizedPath.startsWith("listing-images/")) {
    normalizedPath = `listing-images/${normalizedPath}`;
  }

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  return `${supabaseUrl}/storage/v1/object/public/${normalizedPath}`;
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

/**
 * Get URL for category icon PNGs (served from local /categories/ folder)
 */
export function getCategoryIconUrl(filename: string): string {
  if (!filename) return "";
  if (filename.startsWith("http")) return filename;
  
  // Category icons are served from the local /categories/ folder in public directory
  // Remove any path prefixes and just use the filename
  const justFilename = filename.split('/').pop() || filename;
  
  // Return local path to categories folder
  return `/categories/${justFilename}`;
}
