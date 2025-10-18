import { auth } from "@/auth";
import { SupabaseSubmitForm } from "@/components/submit/supabase-submit-form";
import { siteConfig } from "@/config/site";
import { getCategories } from "@/data/categories";
import { getListingBySlug } from "@/data/listings";
import { constructMetadata } from "@/lib/metadata";
import { redirect } from "next/navigation";

export const metadata = constructMetadata({
  title: "Submit Your Listing",
  description: "Submit your child actor business to our directory",
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
      existingListing = await getListingBySlug(listingId);
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
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-paper mb-4">
          {isClaimFlow ? "Claim Your Listing" : "List Your Business"}
        </h1>
        <p className="text-xl text-paper mb-2">
          {isClaimFlow
            ? "Choose a plan and complete your listing details"
            : "Join the Child Actor 101 Directory and connect with parents"}
        </p>
        <p className="text-sm text-paper">
          Choose your plan below and get started in minutes.
        </p>
        {existingListing && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-2xl mx-auto">
            <p className="text-sm text-blue-800">
              <strong>Claiming:</strong> {existingListing.listing_name}
            </p>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto">
        {isClaimFlow ? (
          // Show plan selection for claim flow
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-paper mb-2">
                Choose Your Plan
              </h2>
              <p className="text-paper">
                Select a plan to claim and enhance this listing.
              </p>
            </div>
            <SupabaseSubmitForm
              categories={freeFormCategories}
              existingListing={existingListing}
              isClaimFlow={true}
            />
          </div>
        ) : (
          // Show plan selection for new submissions
          <div className="space-y-8">
            <SupabaseSubmitForm categories={freeFormCategories} />
          </div>
        )}
      </div>
    </div>
  );
}
