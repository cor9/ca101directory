import { AirtableSubmitForm } from "@/components/submit/airtable-submit-form";
import FreeSubmitForm from "@/components/submit/free-submit-form";
import { siteConfig } from "@/config/site";
import { getCategories } from "@/lib/airtable";
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
  // Get categories from Airtable with error handling
  let categories = [];
  try {
    categories = await getCategories();
    console.log(
      "SubmitPage: Successfully fetched categories:",
      categories.length,
    );
  } catch (error) {
    console.error("SubmitPage: Error fetching categories:", error);
    // Fallback to empty array if Airtable fails
    categories = [];
  }

  // Convert Airtable categories to the format expected by SubmitForm
  const categoryList = categories.map((cat) => ({
    _id: cat.id,
    _type: "category" as const,
    _createdAt: new Date().toISOString(),
    _updatedAt: new Date().toISOString(),
    _rev: "",
    name: cat.categoryName,
    slug: {
      _type: "slug" as const,
      current: cat.categoryName.toLowerCase().replace(/\s+/g, "-"),
    },
    description: cat.description || null,
    group: null,
    priority: null,
  }));

  // For now, we'll use empty tags since we're using age ranges in Airtable
  const tagList = [
    {
      _id: "tag-1",
      _type: "tag" as const,
      _createdAt: new Date().toISOString(),
      _updatedAt: new Date().toISOString(),
      _rev: "",
      name: "Ages 0-5",
      slug: {
        _type: "slug" as const,
        current: "ages-0-5",
      },
      description: "Services for children ages 0-5",
      group: "age-range",
      priority: "1",
    },
    {
      _id: "tag-2",
      _type: "tag" as const,
      _createdAt: new Date().toISOString(),
      _updatedAt: new Date().toISOString(),
      _rev: "",
      name: "Ages 6-12",
      slug: {
        _type: "slug" as const,
        current: "ages-6-12",
      },
      description: "Services for children ages 6-12",
      group: "age-range",
      priority: "2",
    },
    {
      _id: "tag-3",
      _type: "tag" as const,
      _createdAt: new Date().toISOString(),
      _updatedAt: new Date().toISOString(),
      _rev: "",
      name: "Ages 13-17",
      slug: {
        _type: "slug" as const,
        current: "ages-13-17",
      },
      description: "Services for children ages 13-17",
      group: "age-range",
      priority: "3",
    },
  ];

  // Convert categories to the format expected by FreeSubmitForm
  const freeFormCategories = categories.map((cat) => ({
    id: cat.id,
    name: cat.categoryName,
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Submit Your Listing</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Choose your submission type
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Free Form */}
        <div>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-brand-orange mb-2">
              Free Listing
            </h2>
            <p className="text-muted-foreground">
              Quick and easy - perfect for getting started
            </p>
          </div>
          <FreeSubmitForm categories={freeFormCategories} />
        </div>

        {/* Full Form */}
        <div>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-brand-blue mb-2">
              Premium Listing
            </h2>
            <p className="text-muted-foreground">
              Full features with logo, detailed descriptions, and more
            </p>
          </div>
          <AirtableSubmitForm tagList={tagList} categoryList={categoryList} />
        </div>
      </div>
    </div>
  );
}
