import { sanityClient } from '@/sanity/lib/client';
import { blogCategoryListQuery } from '@/sanity/lib/queries';
import { Suspense } from 'react';
import Container from '@/components/shared/container';
import { BlogCategoryList } from "./blog-category-list";

/**
 * TODO: maybe change to CustomSwitch
 */
export async function BlogCategoryFilter() {
  const categoryList = await sanityClient.fetch(blogCategoryListQuery);

  return (
    <>
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
