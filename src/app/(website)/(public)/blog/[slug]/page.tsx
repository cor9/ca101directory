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
    title: "Blog Post - Coming Soon",
    description: "Blog functionality coming soon with Airtable integration",
    canonicalUrl: `${siteConfig.url}/blog/${params.slug}`,
  });
}

/**
 * Blog post page - temporarily disabled while migrating to Airtable
 * Blog functionality is not part of the core Child Actor 101 Directory
 */
export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  // Temporarily return 404 until Airtable integration is complete
  return notFound();
}