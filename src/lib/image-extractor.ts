const FALLBACK_IMAGE = "/og-default.jpg";

function normalizeUrl(url?: string | null): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
    return parsed.toString();
  } catch (error) {
    console.warn("normalizeUrl failed", error);
    return null;
  }
}

async function fetchOpenGraphImage(
  url?: string | null,
): Promise<string | null> {
  const normalized = normalizeUrl(url);
  if (!normalized) return null;

  try {
    const response = await fetch(normalized, { cache: "no-store" });
    const html = await response.text();
    const match = html.match(
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["'][^>]*>/i,
    );

    if (match?.[1]) {
      const imageUrl = match[1];
      return imageUrl.startsWith("http")
        ? imageUrl
        : new URL(imageUrl, normalized).toString();
    }
  } catch (error) {
    console.warn("fetchOpenGraphImage failed", error);
  }

  return null;
}

function getCategoryPlaceholder(categories?: string[] | null): string {
  if (categories && categories.length > 0) {
    const primary = categories[0].replace(/[^a-z0-9]/gi, " ").trim();
    return `https://placehold.co/600x400?text=${encodeURIComponent(primary)}+Spotlight`;
  }
  return "https://placehold.co/600x400?text=Child+Actor+101";
}

export async function extractListingImages(options: {
  website?: string | null;
  categories?: string[] | null;
  profileImage?: string | null;
  gallery?: string | null;
}): Promise<string[]> {
  if (options.profileImage) {
    return [options.profileImage];
  }

  // Try gallery JSON if available
  if (options.gallery) {
    try {
      const parsed = JSON.parse(options.gallery) as string[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (error) {
      console.warn("Failed to parse gallery JSON", error);
    }
  }

  const ogImage = await fetchOpenGraphImage(options.website);
  if (ogImage) {
    return [ogImage];
  }

  return [getCategoryPlaceholder(options.categories) ?? FALLBACK_IMAGE];
}
