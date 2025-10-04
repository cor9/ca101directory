import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";
import { notFound } from "next/navigation";

export const metadata = constructMetadata({
  title: "Collections - Coming Soon",
  description: "Collections coming soon with Airtable integration",
  canonicalUrl: `${siteConfig.url}/collection`,
});

/**
 * Collection listing page - temporarily disabled while migrating to Airtable
 * Collection functionality will be re-implemented with Airtable integration
 */
export default async function CollectionListingPage() {
  // Temporarily return 404 until Airtable integration is complete
  return notFound();
}
