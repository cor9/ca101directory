import { sorting } from '@/lib/constants';
import { CategoryListQueryResult, TagListQueryResult } from '@/sanity.types';
import { sanityFetch } from '@/sanity/lib/fetch';
import { categoryListQuery, tagListQuery } from '@/sanity/lib/queries';
import Container from '../shared/container';
import { SearchFilterClient } from './search-filter-client';
import { Suspense } from 'react';

export async function SearchFilter() {
  const [categoryList, tagList] = await Promise.all([
    sanityFetch<CategoryListQueryResult>({
      query: categoryListQuery
    }),
    sanityFetch<TagListQueryResult>({
      query: tagListQuery
    })
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
    <>
      {/* Desktop View, has Container */}
      <Container className="hidden md:flex md:flex-col md:mt-4">
        <div className="w-full">
          <Suspense fallback={null}>
            <SearchFilterClient tagList={tags} categoryList={categories} sortList={sorting} />
          </Suspense>
        </div>
      </Container>

      {/* Mobile View, no Container */}
      <div className="md:hidden flex flex-col mt-4">
        <div className="mx-4">
          <Suspense fallback={null}>
            <SearchFilterClient tagList={tags} categoryList={categories} sortList={sorting} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
