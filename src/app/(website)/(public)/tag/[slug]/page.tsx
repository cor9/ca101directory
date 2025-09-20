import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata | undefined> {
  return constructMetadata({
    title: "Tag - Coming Soon",
    description: "Tag functionality coming soon with Airtable integration",
    canonicalUrl: `${siteConfig.url}/tag/${params.slug}`,
  });
}

/**
 * Tag detail page - temporarily disabled while migrating to Airtable
 * Tag functionality will be re-implemented with Airtable integration
 */
export default async function TagDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  // Temporarily return 404 until Airtable integration is complete
  return notFound();
}