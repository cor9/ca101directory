import { getCategories } from "@/data/categories";
import { getPublicListings } from "@/data/listings";
import type { MetadataRoute } from "next";

const site_url = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/**
 * Sitemap for Child Actor 101 Directory using Supabase
 * Updated to use Supabase for better SEO and accurate listing data
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapList: MetadataRoute.Sitemap = [];

  // Static routes (excluding auth pages - they should have noindex)
  const staticRoutes = [
    "", // home
    "search", // directory
    "directory", // directory page
    "category",
    "pricing",
    "submit",
    "suggest-vendor",
  ];

  // Location pages (high priority for local SEO)
  const locationRoutes = [
    "location/los-angeles",
    "location/new-york",
    "location/atlanta",
  ];

  for (const route of staticRoutes) {
    sitemapList.push({
      url: `${site_url}/${route}`,
      lastModified: new Date().toISOString(),
      changeFrequency: route === "" ? "daily" : "weekly",
      priority: route === "" ? 1.0 : 0.8,
    });
  }

  // Add location pages with high priority for local SEO
  for (const route of locationRoutes) {
    sitemapList.push({
      url: `${site_url}/${route}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.9, // High priority for local SEO
    });
  }

  try {
    // Get listings and categories from Supabase
    const [listings, categories] = await Promise.all([
      getPublicListings(),
      getCategories(),
    ]);

    // Add listing pages
    for (const listing of listings) {
      // Only include active, live listings with valid slugs
      if (listing.status === "Live" && listing.is_active && listing.slug) {
        sitemapList.push({
          url: `${site_url}/listing/${listing.slug}`,
          lastModified: listing.updated_at
            ? new Date(listing.updated_at).toISOString()
            : new Date().toISOString(),
          changeFrequency: "weekly", // More frequent for better crawl
          priority: listing.featured ? 0.9 : 0.8, // Higher priority for all listings
        });
      }
    }

    // Add category pages
    for (const category of categories) {
      const slug = (category.category_name || "")
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      
      if (slug) {
        sitemapList.push({
          url: `${site_url}/category/${slug}`,
          lastModified: new Date().toISOString(),
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }
    }

    console.log(`Sitemap generated: ${sitemapList.length} URLs`);
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Return static routes even if Supabase fails
  }

  return sitemapList;
}
