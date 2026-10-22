export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
import { CategoryIndexView } from "@/components/directory/CategoryIndexView";
import { siteConfig } from "@/config/site";
import { getPublicListings } from "@/data/listings";
import { countByPrimary } from "@/lib/category-taxonomy";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Categories - Child Actor 101 Vendor Directory",
  description:
    "Browse services and training, talent representation, and industry and on-set resources for young actors.",
  canonicalUrl: `${siteConfig.url}/category`,
});

export default async function CategoryPage() {
  let counts: Record<string, number> = {};
  try {
    counts = countByPrimary(await getPublicListings());
  } catch (error) {
    console.error("Error fetching category counts:", error);
  }
  return <CategoryIndexView counts={counts} />;
}
