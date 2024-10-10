import { SORT_FILTER_LIST } from "@/lib/constants";
import { CategoryListQueryResult, TagListQueryResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { categoryListQuery, tagListQuery } from "@/sanity/lib/queries";
import Container from "../container";
import { SearchFilterClient } from "./search-filter-client";

export async function SearchFilter() {
  const [categoryList, tagList] = await Promise.all([
    sanityFetch<CategoryListQueryResult>({
      query: categoryListQuery,
    }),
    sanityFetch<TagListQueryResult>({
      query: tagListQuery,
    }),
  ]);

  const categories = categoryList.map((category) => ({
    slug: category.slug.current,
    name: category.name,
  }));
  const tags = tagList.map((tag) => ({
    slug: tag.slug.current,
    name: tag.name,
  }));

  return (
    <div>
      {/* Desktop View, has Container */}
      <Container className="hidden md:flex md:flex-col">
        <div className="w-full">
          <SearchFilterClient
            tagList={tags}
            categoryList={categories}
            sortList={SORT_FILTER_LIST}
          />
        </div>
      </Container>

      {/* Mobile View, no Container */}
      <div className="md:hidden flex flex-col">
        <div className="mx-4">
          <SearchFilterClient
            tagList={tags}
            categoryList={categories}
            sortList={SORT_FILTER_LIST}
          />
        </div>
      </div>
    </div>
  );
}
