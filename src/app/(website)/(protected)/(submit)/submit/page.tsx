import { SubmitForm } from "@/components/submit/submit-form";
import { siteConfig } from "@/config/site";
import { getCategories } from "@/lib/airtable";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Submit Your Listing",
  description: "Submit your child actor business to our directory",
  canonicalUrl: `${siteConfig.url}/submit`,
});

/**
 * Submit page - re-enabled with Airtable integration
 */
export default async function SubmitPage() {
  // Get categories from Airtable
  const categories = await getCategories();
  
  // Convert Airtable categories to the format expected by SubmitForm
  const categoryList = {
    categories: categories.map(cat => ({
      _id: cat.id,
      _type: "category" as const,
      _createdAt: new Date().toISOString(),
      _updatedAt: new Date().toISOString(),
      _rev: '',
      name: cat.categoryName,
      slug: {
        _type: "slug" as const,
        current: cat.categoryName.toLowerCase().replace(/\s+/g, '-'),
      },
      description: cat.description || null,
      group: null,
      priority: null,
    }))
  };

  // For now, we'll use empty tags since we're using age ranges in Airtable
  const tagList = {
    tags: [
      { _id: "5-8", _type: "tag" as const, _createdAt: new Date().toISOString(), _updatedAt: new Date().toISOString(), _rev: '', name: "5-8", slug: { _type: "slug" as const, current: "5-8" }, description: null, priority: null },
      { _id: "9-12", _type: "tag" as const, _createdAt: new Date().toISOString(), _updatedAt: new Date().toISOString(), _rev: '', name: "9-12", slug: { _type: "slug" as const, current: "9-12" }, description: null, priority: null },
      { _id: "13-17", _type: "tag" as const, _createdAt: new Date().toISOString(), _updatedAt: new Date().toISOString(), _rev: '', name: "13-17", slug: { _type: "slug" as const, current: "13-17" }, description: null, priority: null },
      { _id: "18+", _type: "tag" as const, _createdAt: new Date().toISOString(), _updatedAt: new Date().toISOString(), _rev: '', name: "18+", slug: { _type: "slug" as const, current: "18-plus" }, description: null, priority: null },
    ]
  };

  return <SubmitForm tagList={tagList} categoryList={categoryList} />;
}
