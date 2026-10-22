import { auth } from "@/auth";
import { SupabaseSubmitForm } from "@/components/submit/supabase-submit-form";
import { siteConfig } from "@/config/site";
import { getCategories } from "@/data/categories";
import { getListingById, getListingBySlug } from "@/data/listings";
import { constructMetadata } from "@/lib/metadata";
import { redirect } from "next/navigation";

export const metadata = constructMetadata({
  title: "Add Your Listing | Child Actor 101 Vendor Directory",
  description:
    "Create a free listing in the Child Actor 101 Vendor Directory so families can discover your services or professional information.",
  canonicalUrl: `${siteConfig.url}/submit`,
});

/**
 * Submit page - now with working form rendering
 */
export default async function SubmitPage({
  searchParams,
}: {
  searchParams: { claim?: string; listingId?: string };
}) {
  // Check if this is a claim flow
  const isClaimFlow = searchParams.claim === "true";
  const listingId = searchParams.listingId;

  // For claim flow, require authentication
  if (isClaimFlow) {
    const session = await auth();
    if (!session?.user) {
      redirect(
        `/auth/register?callbackUrl=${encodeURIComponent(`/submit?claim=true&listingId=${listingId}`)}`,
      );
    }
  }

  // Get existing listing data if claiming
  let existingListing = null;
  if (isClaimFlow && listingId) {
    try {
      const looksLikeUuid =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          listingId,
        );
      existingListing = looksLikeUuid
        ? await getListingById(listingId)
        : await getListingBySlug(listingId);
      console.log(
        "SubmitPage: Found existing listing for claim:",
        existingListing?.listing_name,
      );
    } catch (error) {
      console.error("SubmitPage: Error fetching existing listing:", error);
    }
  }

  // Get categories from Supabase with error handling
  let categories = [];
  try {
    categories = await getCategories();
    console.log(
      "SubmitPage: Successfully fetched categories:",
      categories.length,
    );
  } catch (error) {
    console.error("SubmitPage: Error fetching categories:", error);
    // Fallback to empty array if Supabase fails
    categories = [];
  }

  // Convert Supabase categories to the format expected by SubmitForm
  const categoryList = categories
    .filter((cat) => cat.category_name) // Filter out categories with null/undefined names
    .map((cat) => ({
      _id: cat.id,
      _type: "category" as const,
      _createdAt: new Date().toISOString(),
      _updatedAt: new Date().toISOString(),
      _rev: "",
      name: cat.category_name,
      slug: {
        _type: "slug" as const,
        current:
          cat.category_name?.toLowerCase().replace(/\s+/g, "-") || "unknown",
      },
      description: cat.description || null,
      group: null,
      priority: null,
    }));

  // Format and region tags instead of age ranges
  const tagList = [
    {
      _id: "online",
      _type: "tag" as const,
      _createdAt: new Date().toISOString(),
      _updatedAt: new Date().toISOString(),
      _rev: "",
      name: "Online Only",
      slug: {
        _type: "slug" as const,
        current: "online",
      },
      description: "Services provided online only",
      group: "format",
      priority: "1",
    },
    {
      _id: "in-person",
      _type: "tag" as const,
      _createdAt: new Date().toISOString(),
      _updatedAt: new Date().toISOString(),
      _rev: "",
      name: "In-Person Only",
      slug: {
        _type: "slug" as const,
        current: "in-person",
      },
      description: "Services provided in-person only",
      group: "format",
      priority: "2",
    },
    {
      _id: "hybrid",
      _type: "tag" as const,
      _createdAt: new Date().toISOString(),
      _updatedAt: new Date().toISOString(),
      _rev: "",
      name: "Hybrid",
      slug: {
        _type: "slug" as const,
        current: "hybrid",
      },
      description: "Services provided both online and in-person",
      group: "format",
      priority: "3",
    },
    {
      _id: "los-angeles",
      _type: "tag" as const,
      _createdAt: new Date().toISOString(),
      _updatedAt: new Date().toISOString(),
      _rev: "",
      name: "Los Angeles",
      slug: {
        _type: "slug" as const,
        current: "los-angeles",
      },
      description: "Services available in Los Angeles area",
      group: "region",
      priority: "4",
    },
    {
      _id: "new-york",
      _type: "tag" as const,
      _createdAt: new Date().toISOString(),
      _updatedAt: new Date().toISOString(),
      _rev: "",
      name: "New York",
      slug: {
        _type: "slug" as const,
        current: "new-york",
      },
      description: "Services available in New York area",
      group: "region",
      priority: "5",
    },
    {
      _id: "virtual",
      _type: "tag" as const,
      _createdAt: new Date().toISOString(),
      _updatedAt: new Date().toISOString(),
      _rev: "",
      name: "Virtual/Remote",
      slug: {
        _type: "slug" as const,
        current: "virtual",
      },
      description: "Services available virtually/remotely",
      group: "region",
      priority: "6",
    },
  ];

  // Convert categories to the format expected by FreeSubmitForm
  const freeFormCategories = categories
    .filter((cat) => cat.category_name) // Filter out categories with null/undefined names
    .map((cat) => ({
      id: cat.id,
      name: cat.category_name,
    }));

  return (
    <div className="surface-canvas min-h-screen">
      <header className="surface-hero">
        <div className="mx-auto max-w-4xl px-4 pb-14 pt-12 sm:px-6">
          <p className="eyebrow">
            {isClaimFlow ? "Claim a listing" : "Free listing"}
          </p>
          <h1 className="heading-display mt-4 text-4xl text-white sm:text-5xl">
            {isClaimFlow ? "Claim Your Listing" : "Add Your Listing"}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed !text-zinc-300">
            {isClaimFlow
              ? "Complete your listing details to claim this listing."
              : "Create a free listing in the Child Actor 101 Vendor Directory so families can discover your services or professional information."}
          </p>
          {existingListing && (
            <p className="mt-5 inline-block rounded-full border border-white/20 px-4 py-1.5 text-sm font-medium text-white">
              Claiming: {existingListing.listing_name}
            </p>
          )}
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <SupabaseSubmitForm
          categories={freeFormCategories}
          existingListing={existingListing}
          isClaimFlow={isClaimFlow}
        />
      </section>
    </div>
  );
}
