import { auth } from "@/auth";
import { EditForm } from "@/components/submit/edit-form";
import { siteConfig } from "@/config/site";
import { getCategories } from "@/data/categories";
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
    redirect(`/auth/login?next=${encodeURIComponent(`/edit/${params.id}`)}`);
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

  // Get categories for the form
  const categories = await getCategories();
  const formCategories = categories
    .filter((cat) => cat.category_name)
    .map((cat) => ({
      id: cat.id,
      name: cat.category_name,
    }));

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Edit Your Listing</h1>
        <p className="text-lg text-muted-foreground">
          Update your listing information and images
        </p>
      </div>

      <EditForm listing={listing} categories={formCategories} />
    </div>
  );
}
