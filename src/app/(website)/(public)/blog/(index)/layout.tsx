import { BlogCategoryFilter } from "@/components/blog/blog-category-filter";
import { BlogCategoryList } from "@/components/blog/blog-category-list";
import { BlogCategoryListMobile } from "@/components/blog/blog-category-list-mobile";
import Container from "@/components/shared/container";
import { HeaderSection } from "@/components/shared/header-section";
import { BlogCategoryListQueryResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { blogCategoryListQuery } from "@/sanity/lib/queries";
import { Suspense } from "react";

export default async function BlogListLayout({ children }: { children: React.ReactNode }) {
  const categoryList = await sanityFetch<BlogCategoryListQueryResult>({
    query: blogCategoryListQuery
  });

  return (
    <>
      {/* blog category filter */}
      <div className="mt-8">
        <BlogCategoryFilter />
      </div>

      <Container className="mt-8 pb-16">
        {children}
      </Container>
    </>
  );
}
