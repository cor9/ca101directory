import { getCategories, getListings } from "@/lib/airtable";
import type { MetadataRoute } from "next";

const site_url = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/**
 * Simplified sitemap for Child Actor 101 Directory using Airtable
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapList: MetadataRoute.Sitemap = [];

  // Static routes
  const staticRoutes = [
    "", // home
    "search", // directory
    "category",
    "pricing",
    "submit",
    "auth/login",
    "auth/register",
  ];

  for (const route of staticRoutes) {
    sitemapList.push({
      url: `${site_url}/${route}`,
      lastModified: new Date().toISOString(),
    });
  }

  // Only try to fetch from Airtable if API key is available
  if (process.env.AIRTABLE_API_KEY && process.env.AIRTABLE_BASE_ID) {
    try {
      // Get listings and categories from Airtable
      const [listings, categories] = await Promise.all([
        getListings(),
        getCategories(),
      ]);

      // Add listing pages
      for (const listing of listings) {
        const slug = listing.businessName
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");
        sitemapList.push({
          url: `${site_url}/listing/${slug}`,
          lastModified: new Date(
            listing.dateApproved || listing.dateSubmitted,
          ).toISOString(),
        });
      }

      // Add category pages
      for (const category of categories) {
        const slug = category.categoryName
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");
        sitemapList.push({
          url: `${site_url}/category/${slug}`,
          lastModified: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Error generating sitemap:", error);
      // Return static routes even if Airtable fails
    }
  }

  return sitemapList;
}
