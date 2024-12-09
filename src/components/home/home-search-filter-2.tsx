import { QUERY_FILTER_LIST, SORT_FILTER_LIST } from "@/lib/constants";
import type {
  CategoryListQueryResult,
  TagListQueryResult,
} from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { categoryListQuery, tagListQuery } from "@/sanity/lib/queries";
import { HomeSearchFilterClient2 } from "./home-search-filter-client-2";

interface HomeSearchFilterProps {
  urlPrefix: string;
}

export async function HomeSearchFilter2({ urlPrefix }: HomeSearchFilterProps) {
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
      <div className="hidden md:flex md:flex-col">
        <div className="w-full">
          <HomeSearchFilterClient2
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
          <HomeSearchFilterClient2
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
