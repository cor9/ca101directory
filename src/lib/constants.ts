// show more logs
export const SHOW_QUERY_LOGS = false;
// number of items per page
export const ITEMS_PER_PAGE = 9;
// number of posts per page
export const POSTS_PER_PAGE = 6;
// number of submissions per page
export const SUBMISSIONS_PER_PAGE = 3;

export type SortFilterItem = {
  label: string;
  slug: string | null;
  sortKey: "publishDate" | "name"; // | 'stars' | '_createdAt' | '_updatedAt'
  reverse: boolean;
};

export const DEFAULT_SORT: SortFilterItem = {
  label: "Sort by Time (dsc)",
  slug: null,
  sortKey: "publishDate",
  reverse: true,
};

export const SORT_FILTER_LIST: SortFilterItem[] = [
  DEFAULT_SORT,
  {
    label: "Sort by Time (asc)",
    slug: "date-asc",
    sortKey: "publishDate",
    reverse: false,
  },
  {
    label: "Sort by Name (dsc)",
    slug: "name-desc",
    sortKey: "name",
    reverse: true,
  },
  {
    label: "Sort by Name (asc)",
    slug: "name-asc",
    sortKey: "name",
    reverse: false,
  },
];
