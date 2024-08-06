import clsx from 'clsx';
import { Suspense } from 'react';
import FilterList from './filter';
import { CategoryListQueryResult } from '@/sanity.types';
import { sanityFetch } from '@/sanity/lib/fetch';
import { categoryListQuery } from '@/sanity/lib/queries';

function reshapeCategoryList(categoryList: CategoryListQueryResult) {
  return categoryList.map((category) => ({
    handle: category.slug?.current,
    title: category.name?.find((kv) => kv._key === 'en')?.value || 'No Name',
    description: category.description?.find((kv) => kv._key === 'en')?.value || 'No Description',
    seo: {
      title: category.name?.find((kv) => kv._key === 'en')?.value || 'No Name',
      description: category.description?.find((kv) => kv._key === 'en')?.value || 'No Description',
    },
    path: `/search/${category.slug?.current}`,
    updatedAt: new Date().toISOString()
  }));
}

async function getCollections() {
  const categoryList = await sanityFetch<CategoryListQueryResult>({
    query: categoryListQuery
  });
  console.log('CategoryListPage, categoryList:', categoryList);

  const collections = [
    {
      handle: '',
      title: 'All',
      description: 'All products',
      seo: {
        title: 'All',
        description: 'All products'
      },
      path: '/search',
      updatedAt: new Date().toISOString()
    },
    ...reshapeCategoryList(categoryList)
  ];
  return collections;
}

async function CollectionList() {
  const collections = await getCollections();
  return <FilterList list={collections} title="Collections" />;
}

const skeleton = 'mb-3 h-4 w-5/6 animate-pulse rounded';
const activeAndTitles = 'bg-neutral-800 dark:bg-neutral-300';
const items = 'bg-neutral-400 dark:bg-neutral-700';

export default function Collections() {
  return (
    <Suspense
      fallback={
        <div className="col-span-2 hidden h-[400px] w-full flex-none py-4 lg:block">
          <div className={clsx(skeleton, activeAndTitles)} />
          <div className={clsx(skeleton, activeAndTitles)} />
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
      <CollectionList />
    </Suspense>
  );
}
