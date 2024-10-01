import Container from '@/components/shared/container';
import { BlogCategoryListQueryResult } from '@/sanity.types';
import { sanityFetch } from '@/sanity/lib/fetch';
import { blogCategoryListQuery } from '@/sanity/lib/queries';
import { Suspense } from 'react';
import { BlogCategoryListDesktop } from "./blog-category-list-desktop";
import { BlogCategoryListMobile } from './blog-category-list-mobile';

export async function BlogCategoryFilter() {
  const categoryList = await sanityFetch<BlogCategoryListQueryResult>({
    query: blogCategoryListQuery
  });

  return (
    <section className='w-full'>
      {/* Desktop View, has Container */}
      <Container className="hidden md:block">
        <Suspense fallback={null}>
          <BlogCategoryListDesktop categoryList={categoryList} />
        </Suspense>
      </Container>

      {/* Mobile View, no Container */}
      <div className="block md:hidden w-full">
        <Suspense fallback={null}>
          <BlogCategoryListMobile categoryList={categoryList} />
        </Suspense>
      </div>
    </section>
  );
}
