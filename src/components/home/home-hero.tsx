import { Suspense } from 'react';
import HomeSearch from './home-search';
import { SearchSkeleton } from '../search';
import MaxWidthWrapper from '../shared/max-width-wrapper';

export async function HomeHero() {
  // const categoryList = await sanityFetch<CategoryListQueryResult>({
  //   query: categoryListQuery
  // });
  // const tagList = await sanityFetch<TagListQueryResult>({
  //   query: tagListQuery
  // });

  // // convert categoryList/tagList to CategoryFilterItem[]/TagFilterItem[]
  // const categories = categoryList.map((category) => ({
  //   slug: category.slug.current,
  //   name: category.name.find((name) => name._key === 'en')?.value || '',
  // }));
  // const tags = tagList.map((tag) => ({
  //   slug: tag.slug.current,
  //   name: tag.name.find((name) => name._key === 'en')?.value || '',
  // }));

  return (
    <>
      {/* Desktop View, has MaxWidthWrapper */}
      <MaxWidthWrapper className="hidden md:flex md:flex-col mt-8">
        <div className='w-full'>
          <Suspense fallback={<SearchSkeleton />}>
            <HomeSearch />
          </Suspense>
        </div>

        {/* <div className='flex items-center justify-between'>
          <div className="w-full">
            <Suspense fallback={<SearchSkeleton />}>
              <HomeFilter tagList={tags} categoryList={categories} sortList={sorting} />
            </Suspense>
          </div>
        </div> */}
      </MaxWidthWrapper>

      {/* Mobile View, no MaxWidthWrapper */}
      <div className="md:hidden flex flex-col mt-8">
        <div className='w-full'>
          <Suspense fallback={<SearchSkeleton />}>
            <HomeSearch />
          </Suspense>
        </div>

        {/* <div className="mx-4">
          <Suspense fallback={<SearchSkeleton />}>
            <HomeFilter tagList={tags} categoryList={categories} sortList={sorting} />
          </Suspense>
        </div> */}
      </div>
    </>
  );
}
