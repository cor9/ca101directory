import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata | undefined> {
  return constructMetadata({
    title: "Edit Listing - Coming Soon",
    description: "Edit your listing - feature coming soon with Airtable integration",
    canonicalUrl: `${siteConfig.url}/edit/${params.id}`,
  });
}

/**
 * Edit page - temporarily disabled while migrating to Airtable
 * This will be re-implemented with Airtable integration
 */
export default async function EditPage({ params }: { params: { id: string } }) {
  // Temporarily return 404 until Airtable integration is complete
  return notFound();
}
