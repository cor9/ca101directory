// show more logs
export const SHOW_QUERY_LOGS = false;
// number of items per page 
export const ITEMS_PER_PAGE = 9;
// number of posts per page
export const POSTS_PER_PAGE = 6;
// number of submissions per page
export const SUBMISSIONS_PER_PAGE = 3;

export type SortFilterItem = {
  title: string;
  slug: string | null;
  sortKey: 'publishDate' | 'stars' | '_createdAt' | '_updatedAt' | 'name';
  reverse: boolean;
};

export const defaultSort: SortFilterItem = {
  title: 'Sort by Time (dsc)',
  slug: null,
  sortKey: 'publishDate',
  reverse: true
};

export const sorting: SortFilterItem[] = [
  defaultSort,
  { title: 'Sort by Time (asc)', slug: 'date-asc', sortKey: 'publishDate', reverse: false },
  { title: 'Sort by Stars (dsc)', slug: 'stars-desc', sortKey: 'stars', reverse: true },
  { title: 'Sort by Stars (asc)', slug: 'stars-asc', sortKey: 'stars', reverse: false },
  { title: 'Sort by Name (dsc)', slug: 'name-desc', sortKey: 'name', reverse: true },
  { title: 'Sort by Name (asc)', slug: 'name-asc', sortKey: 'name', reverse: false },
];
