import { AirtableSubmitForm } from "@/components/submit/airtable-submit-form";
import FreeSubmitForm from "@/components/submit/free-submit-form";
import { SupabaseSubmitForm } from "@/components/submit/supabase-submit-form";
import { siteConfig } from "@/config/site";
import { getCategories } from "@/data/categories";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Submit Your Listing",
  description: "Submit your child actor business to our directory",
  canonicalUrl: `${siteConfig.url}/submit`,
});

/**
 * Submit page - now with working form rendering
 */
export default async function SubmitPage() {
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
        current: cat.category_name?.toLowerCase().replace(/\s+/g, "-") || "unknown",
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
        <h1 className="text-4xl font-bold mb-4">Submit Your Listing</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Choose your submission type
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Free Listing Form */}
          <div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-brand-blue mb-2">
                Free Listing
              </h2>
              <p className="text-muted-foreground">
                Get started with a basic listing. Upgrade later for more
                features.
              </p>
            </div>
            <FreeSubmitForm categories={freeFormCategories} />
          </div>

          {/* Paid Listing Form */}
          <div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-brand-orange mb-2">
                Paid Listing
              </h2>
              <p className="text-muted-foreground">
                Create a professional listing with advanced features and
                priority placement.
              </p>
            </div>
            <SupabaseSubmitForm categories={freeFormCategories} />
          </div>
        </div>
      </div>
    </div>
  );
}
