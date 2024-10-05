import { SORT_FILTER_LIST } from '@/lib/constants';
import { CategoryListQueryResult, TagListQueryResult } from '@/sanity.types';
import { sanityFetch } from '@/sanity/lib/fetch';
import { categoryListQuery, tagListQuery } from '@/sanity/lib/queries';
import Container from '../container';
import { HomeFilterClient } from './home-filter-client';

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
    <div>
      {/* Desktop View, has Container */}
      <Container className="hidden md:flex md:flex-col">
        <div className="w-full">
          <HomeFilterClient tagList={tags} categoryList={categories} sortList={SORT_FILTER_LIST} />
        </div>
      </Container>

      {/* Mobile View, no Container */}
      <div className="md:hidden flex flex-col">
        <div className="mx-4">
          <HomeFilterClient tagList={tags} categoryList={categories} sortList={SORT_FILTER_LIST} />
        </div>
      </div>
    </div>
  );
}
