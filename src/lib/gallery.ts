import { getListingImageUrl } from "@/lib/image-urls";

export type GalleryItem = { url: string; caption?: string };

type RawEntry = string | { url?: unknown; src?: unknown; caption?: unknown };

function toItem(entry: RawEntry | null | undefined): GalleryItem | null {
  if (typeof entry === "string") {
    return entry.trim() ? { url: getListingImageUrl(entry.trim()) } : null;
  }
  if (entry && typeof entry === "object") {
    const raw = entry.url || entry.src;
    if (!raw || typeof raw !== "string") return null;
    return {
      url: getListingImageUrl(raw),
      caption: typeof entry.caption === "string" ? entry.caption : undefined,
    };
  }
  return null;
}

/**
 * Parse a listing's `gallery` column into image URLs (+ optional captions).
 * Accepts a JSON array of strings/objects, a plain array, or a delimited string.
 */
export function parseGalleryItems(
  gallery: string | RawEntry[] | null | undefined,
): GalleryItem[] {
  if (!gallery) return [];
  let entries: RawEntry[] = [];
  if (Array.isArray(gallery)) {
    entries = gallery;
  } else if (typeof gallery === "string" && gallery.trim() !== "") {
    try {
      const parsed = JSON.parse(gallery);
      if (Array.isArray(parsed)) entries = parsed;
    } catch {
      entries = gallery
        .split(/[,\n]/)
        .map((s) => s.trim().replace(/^["'\[\]]+|["'\[\]]+$/g, ""))
        .filter(Boolean);
    }
  }
  return entries.map(toItem).filter((i): i is GalleryItem => i !== null);
}
