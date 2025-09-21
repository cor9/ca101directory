import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";
import { notFound } from "next/navigation";

export const metadata = constructMetadata({
  title: "Dashboard - Coming Soon",
  description: "Dashboard coming soon with Airtable integration",
  canonicalUrl: `${siteConfig.url}/dashboard`,
});

/**
 * Dashboard page - temporarily disabled while migrating to Airtable
 * This will be re-implemented with Airtable integration
 */
export default async function DashboardPage() {
  // Temporarily return 404 until Airtable integration is complete
  return notFound();
}