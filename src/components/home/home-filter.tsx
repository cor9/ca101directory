import { sorting } from '@/lib/constants';
import { CategoryListQueryResult, TagListQueryResult } from '@/sanity.types';
import { sanityFetch } from '@/sanity/lib/fetch';
import { categoryListQuery, tagListQuery } from '@/sanity/lib/queries';
import MaxWidthWrapper from '../shared/max-width-wrapper';
import { HomeFilterClient } from './home-filter-client';
import { Suspense } from 'react';

export async function HomeFilter() {
  const [categoryList, tagList] = await Promise.all([
    sanityFetch<CategoryListQueryResult>({
      query: categoryListQuery
    }),
    sanityFetch<TagListQueryResult>({
      query: tagListQuery
    })
  ]);

  // convert categoryList/tagList to CategoryFilterItem[]/TagFilterItem[]
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
      {/* Desktop View, has MaxWidthWrapper */}
      <MaxWidthWrapper className="hidden md:flex md:flex-col md:mt-4">
        {/* <div className='w-full'>
          <Suspense fallback={<SearchSkeleton />}>
            <HomeSearch />
          </Suspense>
        </div> */}

        {/* <div className='flex items-center justify-between'> */}
        <div className="w-full">
          <Suspense fallback={null}>
            <HomeFilterClient tagList={tags} categoryList={categories} sortList={sorting} />
          </Suspense>
        </div>
        {/* </div> */}
      </MaxWidthWrapper>

      {/* Mobile View, no MaxWidthWrapper */}
      <div className="md:hidden flex flex-col mt-4">
        {/* <div className='w-full'>
          <Suspense fallback={<SearchSkeleton />}>
            <HomeSearch />
          </Suspense>
        </div> */}

        <div className="mx-4">
          <Suspense fallback={null}>
            <HomeFilterClient tagList={tags} categoryList={categories} sortList={sorting} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
