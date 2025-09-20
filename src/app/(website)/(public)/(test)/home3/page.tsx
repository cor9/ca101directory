import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";
import { notFound } from "next/navigation";

export const metadata = constructMetadata({
  title: "Home Variant 3 - Coming Soon",
  description: "Home variant 3 coming soon with Airtable integration",
  canonicalUrl: `${siteConfig.url}/home3`,
});

/**
 * Home variant 3 page - temporarily disabled while migrating to Airtable
 * This is a test variant and not part of the core functionality
 */
export default async function Home3Page() {
  // Temporarily return 404 until Airtable integration is complete
  return notFound();
}