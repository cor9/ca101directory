// export const SHOW_AUTH_LOGS = true;
export const SHOW_AUTH_LOGS = false;
export const ITEMS_PER_PAGE = 4;

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
