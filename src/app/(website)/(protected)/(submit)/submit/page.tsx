import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";
import { notFound } from "next/navigation";

export const metadata = constructMetadata({
  title: "Submit Listing - Coming Soon",
  description: "Submit your listing - feature coming soon with Airtable integration",
  canonicalUrl: `${siteConfig.url}/submit`,
});

/**
 * Submit page - temporarily disabled while migrating to Airtable
 * This will be re-implemented with Airtable integration
 */
export default async function SubmitPage() {
  // Temporarily return 404 until Airtable integration is complete
  return notFound();
}
