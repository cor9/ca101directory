import { auth } from "@/auth";
import { siteConfig } from "@/config/site";
import { getListingById } from "@/data/listings";
import { constructMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata | undefined> {
  return constructMetadata({
    title: "Edit Listing",
    description: "Edit your professional listing",
    canonicalUrl: `${siteConfig.url}/edit/${params.id}`,
  });
}

/**
 * Edit page - Edit existing listing
 */
export default async function EditPage({ params }: { params: { id: string } }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login?next=/edit/" + encodeURIComponent(params.id));
  }

  // Get the listing
  const listing = await getListingById(params.id);

  if (!listing) {
    notFound();
  }

  // Check if user owns this listing
  if (listing.owner_id !== session.user.id) {
    redirect("/dashboard/vendor");
  }

  // For now, redirect to submit page with claim toggle
  // This reuses the existing form but pre-fills with listing data
  redirect(`/submit?claim=true&listingId=${params.id}`);
}
