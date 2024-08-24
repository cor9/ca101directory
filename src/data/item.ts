import { ITEMS_PER_PAGE } from "@/lib/constants";
import { sanityFetch } from "@/sanity/lib/fetch";
import { ItemListQueryResult } from "@/sanity.types";

/**
 * get items from sanity
 */
export async function getItems({
    category,
    tag,
    sortKey,
    reverse,
    query,
    currentPage
  }: {
    category?: string;
    tag?: string;
    sortKey?: string;
    reverse?: boolean;
    query?: string;
    currentPage: number
  }) {
    console.log('getItems, query', query, 'sortKey', sortKey, 'reverse', reverse);
    const { countQuery, dataQuery } = buildQuery(category, tag, sortKey, reverse, query, currentPage);
    const [totalCount, items] = await Promise.all([
      sanityFetch<number>({ query: countQuery }),
      sanityFetch<ItemListQueryResult>({ query: dataQuery })
    ]);
    return { items, totalCount };
  }
  
  /**
   * build count and data query for get items from sanity
   */
  const buildQuery = (category?: string, tag?: string, sortKey?: string, reverse?: boolean, query?: string, currentPage: number = 1) => {
    const orderDirection = reverse ? 'desc' : 'asc';
    const sortOrder = sortKey ? `| order(${sortKey} ${orderDirection})` : '| order(publishDate desc)';
    const queryPattern = query ? `*${query}*` : '';
    const queryCondition = query
      ? `&& (name[].value match "${queryPattern}" || description[].value match "${queryPattern}")`
      : '';
    const categoryCondition = category ? `&& "${category}" in categories[]->slug.current` : '';
    const tagCondition = tag ? `&& "${tag}" in tags[]->slug.current` : '';
    const offsetStart = (currentPage - 1) * ITEMS_PER_PAGE;
    const offsetEnd = offsetStart + ITEMS_PER_PAGE;
  
    // @sanity-typegen-ignore
    const countQuery = `count(*[_type == "item" && defined(slug.current) 
      ${queryCondition} ${categoryCondition} ${tagCondition}])`;
    // @sanity-typegen-ignore
    const dataQuery = `*[_type == "item" && defined(slug.current) 
      ${queryCondition} ${categoryCondition} ${tagCondition}] ${sortOrder} [${offsetStart}...${offsetEnd}] {
      ...,
      categories[]->{
        ...,
      },
      tags[]->{
        ...,
      }
    }`;
    console.log('buildQuery, countQuery', countQuery);
    console.log('buildQuery, dataQuery', dataQuery);
    return { countQuery, dataQuery };
  };