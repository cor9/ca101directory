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
    title: "Listing Details - Coming Soon",
    description: "Listing detail pages coming soon with Airtable integration",
    canonicalUrl: `${siteConfig.url}/item/${params.slug}`,
  });
}

/**
 * Item detail page - temporarily disabled while migrating to Airtable
 * This will be re-implemented with Airtable integration
 */
export default async function ItemDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  // Temporarily return 404 until Airtable integration is complete
  return notFound();
}