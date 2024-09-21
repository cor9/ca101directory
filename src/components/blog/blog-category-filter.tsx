import Container from '@/components/shared/container';
import { BlogCategoryListQueryResult } from '@/sanity.types';
import { sanityFetch } from '@/sanity/lib/fetch';
import { blogCategoryListQuery } from '@/sanity/lib/queries';
import { Suspense } from 'react';
import { BlogCategoryList } from "./blog-category-list";

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
      <Container className="hidden md:block">
        <div className='flex items-center justify-between gap-8'>
          <div className="w-full">
            <Suspense fallback={null}>
              <BlogCategoryList categoryList={categoryList} />
            </Suspense>
          </div>
        </div>
      </Container>

      {/* Mobile View, no Container */}
      <div className="md:hidden flex flex-col gap-8">
        <Suspense fallback={null}>
          <BlogCategoryList categoryList={categoryList} />
        </Suspense>
      </div>
    </>
  );
}
