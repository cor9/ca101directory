import { getCategories } from "@/data/categories";
import { SUPPORT_CATEGORY_GROUP } from "@/lib/constants";
import type { CategoryListQueryResult, GroupListQueryResult } from "@/types";
import { HomeCategoryListClient } from "./home-category-list-client";
import { HomeGroupListClient } from "./home-group-list-client";

export async function HomeCategoryList({
  urlPrefix,
}: {
  urlPrefix: string;
}) {
  // Get categories from Supabase
  const supabaseCategories = await getCategories();

  // Transform Supabase categories to match expected format
  const categoryList: CategoryListQueryResult = supabaseCategories.map(
    (category) => ({
      _id: category.id,
      _type: "category" as const,
      _createdAt: category.created_at || new Date().toISOString(),
      _updatedAt: category.updated_at || new Date().toISOString(),
      _rev: "",
      name: category.category_name,
      slug: {
        _type: "slug" as const,
        current:
          category.category_name?.toLowerCase().replace(/\s+/g, "-") ||
          "unknown",
      },
      description: category.description,
      group: null,
      priority: null,
    }),
  );

  return (
    <HomeCategoryListClient categoryList={categoryList} urlPrefix={urlPrefix} />
  );
}
