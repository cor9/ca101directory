import clsx from 'clsx';
import { Suspense } from 'react';
import FilterList from './filter/filter-list';
import { TagListQueryResult } from '@/sanity.types';
import { sanityFetch } from '@/sanity/lib/fetch';
import { tagListQuery } from '@/sanity/lib/queries';

/**
 * TODO: need to refactor
 */
function reshapeTagList(tagList: TagListQueryResult) {
  return tagList.map((tag) => ({
    handle: tag.slug?.current,
    title: tag.name?.find((kv) => kv._key === 'en')?.value || 'No Name',
    description: tag.description?.find((kv) => kv._key === 'en')?.value || 'No Description',
    seo: {
      title: tag.name?.find((kv) => kv._key === 'en')?.value || 'No Name',
      description: tag.description?.find((kv) => kv._key === 'en')?.value || 'No Description',
    },
    path: `/tag/${tag.slug?.current}`,
    updatedAt: new Date().toISOString()
  }));
}

/**
 * TODO: i18n support for all
 */
async function getTagList() {
  const tagList = await sanityFetch<TagListQueryResult>({
    query: tagListQuery
  });
  console.log('getTagList, tagList:', tagList);

  const list = [
    {
      handle: '',
      title: 'All',
      description: 'All items',
      seo: {
        title: 'All',
        description: 'All items'
      },
      path: '/tag',
      updatedAt: new Date().toISOString()
    },
    ...reshapeTagList(tagList)
  ];
  return list;
}

async function TagFilterList() {
  const list = await getTagList();
  return <FilterList list={list} title="Tags" />;
}

const skeleton = 'mb-3 h-4 w-5/6 animate-pulse rounded';
// const activeAndTitles = 'bg-neutral-800 dark:bg-neutral-300';
const items = 'bg-neutral-400 dark:bg-neutral-700';

export default function TagList() {
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
      <TagFilterList />
    </Suspense>
  );
}
