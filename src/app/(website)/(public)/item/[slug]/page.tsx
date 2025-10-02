import { constructMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

// Force dynamic rendering to avoid static/dynamic conflicts
export const dynamic = "force-dynamic";

/**
 * Generate static params - redirecting all to Supabase listings
 * Not generating static params since we redirect everything to Supabase
 */
export async function generateStaticParams() {
  // Return empty array since we redirect all item URLs to Supabase
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata | undefined> {
  return constructMetadata({
    title: `Item - Child Actor 101 Directory`,
    description: "Redirecting to listing page...",
    canonicalUrl: `https://directory.childactor101.com/item/${params.slug}`,
  });
}

export default async function ItemDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  try {
    console.log("ItemDetailPage: Redirecting item slug to Supabase listing:", params.slug);
    // Try to find this slug in Supabase listings and redirect to /listing/
    const { getListingBySlug } = await import("@/data/listings");
    const supabaseListing = await getListingBySlug(params.slug);
    
    if (supabaseListing) {
      console.log("ItemDetailPage: Found Supabase listing, redirecting to UUID-based URL:", supabaseListing.id);
      redirect(`/listing/${supabaseListing.id}`);
    } else {
      console.error("ItemDetailPage: Listing not found for slug:", params.slug);
      return notFound();
    }
  } catch (error) {
    console.error("Error loading item detail page:", error);
    return notFound();
  }
}