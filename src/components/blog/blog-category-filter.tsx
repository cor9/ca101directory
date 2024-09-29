import Container from '@/components/shared/container';
import { BlogCategoryListQueryResult } from '@/sanity.types';
import { sanityFetch } from '@/sanity/lib/fetch';
import { blogCategoryListQuery } from '@/sanity/lib/queries';
import { Suspense } from 'react';
import { BlogCategoryListDesktop } from "./blog-category-list";
import { BlogCategoryListMobile } from './blog-category-list-mobile';
import { HeaderSection } from '../shared/header-section';

export async function BlogCategoryFilter() {
  const categoryList = await sanityFetch<BlogCategoryListQueryResult>({
    query: blogCategoryListQuery
  });

  return (
    <>
      <div className="w-full flex flex-col items-center justify-center gap-8">
        <HeaderSection
          label="Blog"
          title="Explore our blog posts"
        />

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
      </div>
    </>
  );
}
