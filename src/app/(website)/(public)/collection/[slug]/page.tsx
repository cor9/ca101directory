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
    title: "Collection - Coming Soon",
    description: "Collection pages coming soon with Airtable integration",
    canonicalUrl: `${siteConfig.url}/collection/${params.slug}`,
  });
}

/**
 * Collection page - temporarily disabled while migrating to Airtable
 * This will be re-implemented with Airtable integration
 */
export default async function CollectionPage({
  params,
}: {
  params: { slug: string };
}) {
  // Temporarily return 404 until Airtable integration is complete
  return notFound();
}