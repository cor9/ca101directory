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
    title: "Blog Category - Coming Soon",
    description: "Blog category feature coming soon with Airtable integration",
    canonicalUrl: `${siteConfig.url}/blog/category/${params.slug}`,
  });
}

/**
 * Blog category page - temporarily disabled while migrating to Airtable
 * Blog functionality is not part of the core Child Actor 101 Directory
 */
export default async function BlogCategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  // Temporarily return 404 until Airtable integration is complete
  return notFound();
}