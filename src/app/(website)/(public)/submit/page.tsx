import { AirtableSubmitForm } from "@/components/submit/airtable-submit-form";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";
import { getCategories } from "@/lib/airtable";

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
    console.log("SubmitPage: Successfully fetched categories:", categories.length);
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
      priority: 1,
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
      priority: 2,
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
      priority: 3,
    },
  ];

  return <AirtableSubmitForm tagList={tagList} categoryList={categoryList} />;
}
