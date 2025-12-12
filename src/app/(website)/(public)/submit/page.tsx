import { auth } from "@/auth";
import { SupabaseSubmitForm } from "@/components/submit/supabase-submit-form";
import { siteConfig } from "@/config/site";
import { getCategories } from "@/data/categories";
import { getListingById, getListingBySlug } from "@/data/listings";
import { constructMetadata } from "@/lib/metadata";
import { redirect } from "next/navigation";

export const metadata = constructMetadata({
  title: "Submit Your Business | List on Child Actor 101 Directory",
  description:
    "Join 250+ trusted child actor professionals on our directory. Submit your acting coaching, photography, talent management, or other child entertainment services. Get discovered by families nationwide.",
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
    <div className="bg-bg-dark min-h-screen">
      <section className="max-w-4xl mx-auto px-4 py-12">
        {/* STEP 2: Header copy - low pressure */}
        <header className="mb-10">
          <h1 className="text-3xl font-semibold text-text-primary">
            {isClaimFlow ? "Claim Your Listing" : "Submit your business"}
          </h1>
          <p className="mt-3 text-text-secondary max-w-2xl">
            {isClaimFlow
              ? "Complete your listing details to claim this business."
              : "Create a free listing and be discovered by parents looking for trusted child-acting professionals."}
          </p>
          {existingListing && (
            <div className="mt-4 bg-card-surface border border-border-subtle rounded-lg p-4">
              <p className="text-sm text-text-primary font-semibold">
                <strong>Claiming:</strong> {existingListing.listing_name}
              </p>
            </div>
          )}
        </header>
        {/* STEP 3: Form container - safe place to start */}
        <div className="
          bg-card-surface
          border
          border-border-subtle
          rounded-xl
          p-6
          shadow-card
        ">
          <SupabaseSubmitForm
            categories={freeFormCategories}
            existingListing={existingListing}
            isClaimFlow={isClaimFlow}
          />
        </div>
      </section>
    </div>
  );
}
