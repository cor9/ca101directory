import clsx from 'clsx';
import { Suspense } from 'react';
import FilterList from './filter/filter-list';
import { CategoryListQueryResult } from '@/sanity.types';
import { sanityFetch } from '@/sanity/lib/fetch';
import { categoryListQuery } from '@/sanity/lib/queries';

/**
 * TODO: need to refactor
 */
function reshapeCategoryList(categoryList: CategoryListQueryResult) {
  return categoryList.map((category) => ({
    handle: category.slug?.current,
    title: category.name?.find((kv) => kv._key === 'en')?.value || 'No Name',
    description: category.description?.find((kv) => kv._key === 'en')?.value || 'No Description',
    seo: {
      title: category.name?.find((kv) => kv._key === 'en')?.value || 'No Name',
      description: category.description?.find((kv) => kv._key === 'en')?.value || 'No Description',
    },
    path: `/category/${category.slug?.current}`,
    updatedAt: new Date().toISOString()
  }));
}

/**
 * TODO: i18n support for all
 */
async function getCategoryList() {
  const categoryList = await sanityFetch<CategoryListQueryResult>({
    query: categoryListQuery
  });
  console.log('getCategoryList, categoryList:', categoryList);

  const list = [
    {
      handle: '',
      title: 'All',
      description: 'All items',
      seo: {
        title: 'All',
        description: 'All items'
      },
      path: '/category',
      updatedAt: new Date().toISOString()
    },
    ...reshapeCategoryList(categoryList)
  ];
  return list;
}

async function CategoryFilterList() {
  const list = await getCategoryList();
  return <FilterList list={list} title="Categories" />;
}

const skeleton = 'mb-3 h-4 w-5/6 animate-pulse rounded';
// const activeAndTitles = 'bg-neutral-800 dark:bg-neutral-300';
const items = 'bg-neutral-400 dark:bg-neutral-700';

export default function CategoryList() {
  return (
    <Suspense
      fallback={
        <div className="col-span-2 hidden h-[400px] w-full flex-none py-4 lg:block">
          {/* <div className={clsx(skeleton, activeAndTitles)} /> */}
          {/* <div className={clsx(skeleton, activeAndTitles)} /> */}
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
        </div>
      }
    >
      <CategoryFilterList />
    </Suspense>
  );
}
