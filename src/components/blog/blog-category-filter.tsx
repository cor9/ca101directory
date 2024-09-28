import Container from '@/components/shared/container';
import { BlogCategoryListQueryResult } from '@/sanity.types';
import { sanityFetch } from '@/sanity/lib/fetch';
import { blogCategoryListQuery } from '@/sanity/lib/queries';
import { Suspense } from 'react';
import { BlogCategoryList } from "./blog-category-list";
import { BlogCategoryListMobile } from './blog-category-list-mobile';

/**
 * TODO: maybe change to CustomSwitch
 */
export async function BlogCategoryFilter() {
  const categoryList = await sanityFetch<BlogCategoryListQueryResult>({
    query: blogCategoryListQuery
  });

  return (
    <>
      {/* TODO: simplify this component */}
      {/* Desktop View, has Container */}
      <Container className="hidden md:flex items-center justify-center">
        <div className="w-full">
          <Suspense fallback={null}>
            <BlogCategoryList categoryList={categoryList} />
          </Suspense>
        </div>
      </Container>

      {/* Mobile View, no Container */}
      <div className="md:hidden flex flex-col">
        <Suspense fallback={null}>
          <BlogCategoryListMobile categoryList={categoryList} />
        </Suspense>
      </div>
    </>
  );
}
