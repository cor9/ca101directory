// show more logs
export const SHOW_QUERY_LOGS = false;
// support item icon, default is false (Mkdirs launches with no item icon)
// set env variable NEXT_PUBLIC_SUPPORT_ITEM_ICON=true if you want to support item icon
// NOTE: if you set true, you should make sure the item icon is available
export const SUPPORT_ITEM_ICON =
  process.env.NEXT_PUBLIC_SUPPORT_ITEM_ICON === "true";
// number of items per page
export const ITEMS_PER_PAGE = 12;
// number of collections per page
export const COLLECTIONS_PER_PAGE = 12;
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

export type QueryFilterItem = {
  label: string;
  slug: string | null;
};

export const DEFAULT_QUERY: QueryFilterItem = {
  label: "No Filter",
  slug: null,
};

export const QUERY_FILTER_LIST: QueryFilterItem[] = [
  DEFAULT_QUERY,
  {
    label: "Featured",
    slug: "featured==true",
  },
];