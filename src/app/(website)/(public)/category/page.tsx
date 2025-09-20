import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";
import { notFound } from "next/navigation";

export const metadata = constructMetadata({
  title: "Categories - Coming Soon",
  description: "Category listing coming soon with Airtable integration",
  canonicalUrl: `${siteConfig.url}/category`,
});

/**
 * Category listing page - temporarily disabled while migrating to Airtable
 * Category functionality will be re-implemented with Airtable integration
 */
export default async function CategoryPage() {
  // Temporarily return 404 until Airtable integration is complete
  return notFound();
}