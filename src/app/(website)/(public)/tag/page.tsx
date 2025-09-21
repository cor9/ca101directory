import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";
import { notFound } from "next/navigation";

export const metadata = constructMetadata({
  title: "Tags - Coming Soon",
  description: "Tag listing coming soon with Airtable integration",
  canonicalUrl: `${siteConfig.url}/tag`,
});

/**
 * Tag listing page - temporarily disabled while migrating to Airtable
 * Tag functionality will be re-implemented with Airtable integration
 */
export default async function TagListingPage() {
  // Temporarily return 404 until Airtable integration is complete
  return notFound();
}