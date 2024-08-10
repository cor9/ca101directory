import { CategoryListQueryResult } from '@/sanity.types';
import { sanityFetch } from '@/sanity/lib/fetch';
import { categoryListQuery } from '@/sanity/lib/queries';
import { CategoryList } from "./category-list";

/**
 * TODO: need to refactor
 */
// function reshapeCategoryList(categoryList: CategoryListQueryResult) {
//   return categoryList.map((category) => ({
//     handle: category.slug?.current,
//     title: category.name?.find((kv) => kv._key === 'en')?.value || 'No Name',
//     description: category.description?.find((kv) => kv._key === 'en')?.value || 'No Description',
//     seo: {
//       title: category.name?.find((kv) => kv._key === 'en')?.value || 'No Name',
//       description: category.description?.find((kv) => kv._key === 'en')?.value || 'No Description',
//     },
//     path: `/category/${category.slug?.current}`,
//     updatedAt: new Date().toISOString(),
//     ...category
//   }));
// }

/**
 * TODO: i18n support for all
 */
async function getCategoryList() {
  const categoryList = await sanityFetch<CategoryListQueryResult>({
    query: categoryListQuery
  });
  console.log('getCategoryList, categoryList:', categoryList);

  // const list = [
  // {
  //   handle: '',
  //   title: 'All',
  //   description: 'All items',
  //   seo: {
  //     title: 'All',
  //     description: 'All items'
  //   },
  //   path: '/category',
  //   updatedAt: new Date().toISOString()
  // },
  //   ...reshapeCategoryList(categoryList)
  // ];
  return categoryList;
}

export async function CategoryListLayout() {
  const categoryList = await getCategoryList();

  return (
    <>
      <CategoryList categoryList={categoryList} />
    </>
  );
}
