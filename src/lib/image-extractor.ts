/**
 * Image extraction service
 * Attempts to find logo and gallery images from vendor websites
 */

export type ExtractedImages = {
  logo: string | null;
  gallery: string[];
  source: "website" | "instagram" | "manual";
};

/**
 * Extract images from a vendor's website
 * This is a simplified version - in production you'd use a proper scraping service
 */
export async function extractImagesFromWebsite(
  websiteUrl: string
): Promise<ExtractedImages> {
  if (!websiteUrl) {
    return { logo: null, gallery: [], source: "manual" };
  }

  try {
    // Normalize URL
    const url = websiteUrl.startsWith("http")
      ? websiteUrl
      : `https://${websiteUrl}`;

    // In a real implementation, you'd use a service like:
    // - Puppeteer/Playwright for scraping
    // - Microlink for metadata extraction
    // - OpenGraph tags
    // - Custom image detection

    // For now, return null - admin will add manually
    // This is a placeholder for future enhancement
    return {
      logo: null,
      gallery: [],
      source: "manual",
    };
  } catch (error) {
    console.error("Error extracting images:", error);
    return { logo: null, gallery: [], source: "manual" };
  }
}

/**
 * Get Open Graph image from website (simple version)
 */
export async function getOpenGraphImage(
  websiteUrl: string
): Promise<string | null> {
  try {
    const url = websiteUrl.startsWith("http")
      ? websiteUrl
      : `https://${websiteUrl}`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; DirectoryBot/1.0)",
      },
    });

    if (!response.ok) return null;

    const html = await response.text();

    // Extract og:image meta tag
    const ogImageMatch = html.match(
      /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i
    );

    if (ogImageMatch && ogImageMatch[1]) {
      return ogImageMatch[1];
    }

    // Extract twitter:image as fallback
    const twitterImageMatch = html.match(
      /<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i
    );

    if (twitterImageMatch && twitterImageMatch[1]) {
      return twitterImageMatch[1];
    }

    return null;
  } catch (error) {
    console.error("Error getting OG image:", error);
    return null;
  }
}

/**
 * Suggest placeholder images based on category
 */
export function getPlaceholderImages(category: string): {
  logo: string;
  gallery: string[];
} {
  // Map categories to stock image URLs
  const categoryImages: Record<string, { logo: string; gallery: string[] }> = {
    "Acting Coaches": {
      logo: "/placeholders/acting-coach-logo.jpg",
      gallery: [
        "/placeholders/acting-class-1.jpg",
        "/placeholders/acting-class-2.jpg",
        "/placeholders/acting-class-3.jpg",
        "/placeholders/acting-class-4.jpg",
      ],
    },
    "Headshot Photographers": {
      logo: "/placeholders/photographer-logo.jpg",
      gallery: [
        "/placeholders/headshot-1.jpg",
        "/placeholders/headshot-2.jpg",
        "/placeholders/headshot-3.jpg",
        "/placeholders/headshot-4.jpg",
      ],
    },
    "Talent Agents": {
      logo: "/placeholders/agency-logo.jpg",
      gallery: [
        "/placeholders/agency-1.jpg",
        "/placeholders/agency-2.jpg",
        "/placeholders/agency-3.jpg",
        "/placeholders/agency-4.jpg",
      ],
    },
    default: {
      logo: "/placeholders/default-logo.jpg",
      gallery: [
        "/placeholders/default-1.jpg",
        "/placeholders/default-2.jpg",
        "/placeholders/default-3.jpg",
        "/placeholders/default-4.jpg",
      ],
    },
  };

  return categoryImages[category] || categoryImages.default;
}

/**
 * Future enhancement: Instagram image extraction
 */
export async function extractInstagramImages(
  instagramHandle: string
): Promise<string[]> {
  // Placeholder for future implementation
  // Would use Instagram Graph API or web scraping
  return [];
}
