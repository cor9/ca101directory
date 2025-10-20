import { getCategories } from "@/data/categories";
import {
  QUERY_FILTER_LIST,
  SORT_FILTER_LIST,
  SUPPORT_CATEGORY_GROUP,
} from "@/lib/constants";
import type {
  CategoryListQueryResult,
  GroupListQueryResult,
  TagListQueryResult,
} from "@/types";
import {
  type CategoryFilterItem,
  HomeSearchFilterClient,
  type TagFilterItem,
} from "./home-search-filter-client";

interface HomeSearchFilterProps {
  urlPrefix: string;
}

export async function HomeSearchFilter({ urlPrefix }: HomeSearchFilterProps) {
  let categories: CategoryFilterItem[] = [];
  let tags: TagFilterItem[] = [];

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

  // For now, use categories as both categories and tags (simplified approach)
  categories = categoryList.map((category) => ({
    slug: category.slug.current,
    name: category.name,
  }));

  // Use a subset of categories as tags for now
  tags = categoryList.slice(0, 10).map((category) => ({
    slug: category.slug.current,
    name: category.name,
  }));

  return (
    <div>
      {/* Desktop View, has Container */}
      <div className="hidden md:flex md:flex-col">
        <div className="w-full">
          <HomeSearchFilterClient
            tagList={tags}
            categoryList={categories}
            sortList={SORT_FILTER_LIST}
            filterList={QUERY_FILTER_LIST}
            urlPrefix={urlPrefix}
          />
        </div>
      </div>

      {/* Mobile View, no Container */}
      <div className="md:hidden flex flex-col">
        <div className="">
          <HomeSearchFilterClient
            tagList={tags}
            categoryList={categories}
            sortList={SORT_FILTER_LIST}
            filterList={QUERY_FILTER_LIST}
            urlPrefix={urlPrefix}
          />
        </div>
      </div>
    </div>
  );
}
