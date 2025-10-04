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
    title: "Page - Coming Soon",
    description: "Page functionality coming soon with Airtable integration",
    canonicalUrl: `${siteConfig.url}/${params.slug}`,
  });
}

/**
 * Dynamic page - temporarily disabled while migrating to Airtable
 * Dynamic page functionality will be re-implemented with Airtable integration
 */
export default async function DynamicPage({
  params,
}: {
  params: { slug: string };
}) {
  // Temporarily return 404 until Airtable integration is complete
  return notFound();
}
