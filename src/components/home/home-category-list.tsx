import type { CategoryListQueryResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { categoryListQuery } from "@/sanity/lib/queries";
import { HomeCategoryListClient } from "./home-category-list-client";

export async function HomeCategoryList({
  urlPrefix,
}: {
  urlPrefix: string;
}) {
  const categoryList = await sanityFetch<CategoryListQueryResult>({
    query: categoryListQuery,
  });

  return (
    <HomeCategoryListClient categoryList={categoryList} urlPrefix={urlPrefix} />
  );
}
