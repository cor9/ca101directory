// show more logs
export const SHOW_QUERY_LOGS = false;
// support AI submit, default is false
// NOTE: if you set true, you should make sure the AI provider
// and the API_KEY is set in the env variables.
// if something is wrong in AI submit, you can set false to disable it.
export const SUPPORT_AI_SUBMIT = false;
// support category group, default is true (aka, show category group)
// NOTE: if you set true, you should make sure each category belongs to a group
// if you set false, the category will be shown in the root level
export const SUPPORT_CATEGORY_GROUP = true;
// support item icon, default is true (aka, show item icon)
// NOTE: if you set true, you should make sure the item icon is available
export const SUPPORT_ITEM_ICON = true;
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
  sortKey: "publishDate" | "name" | "virtual-first"; // | 'stars' | '_createdAt' | '_updatedAt'
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
    label: "Virtual first",
    slug: "virtual-first",
    sortKey: "virtual-first",
    reverse: false,
  },
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

// Plan configurations with clear messaging
export const PLAN_FEATURES = {
  FREE: {
    name: "Free Listing",
    price: 0,
    features: [
      "Basic directory listing",
      "Contact information",
      "Social media links",
      "Searchable in directory",
      "1 logo or thumbnail image",
      "Age tags",
      "Services metadata",
    ],
    limitations: ["Standard placement", "Admin review required"],
    upgradePrompt:
      "Upgrade to Standard for profile image and featured placement",
  },
  STANDARD: {
    name: "Standard Plan",
    price: 25,
    features: [
      "Everything in Free",
      "1 profile image",
      "Video embeds (YouTube/Vimeo)",
      "Enhanced listing layout",
      "Featured placement",
      "SEO boost",
    ],
    upgradePrompt: "Upgrade to Pro for gallery images and priority support",
  },
  PRO: {
    name: "Pro Plan",
    price: 50,
    features: [
      "Everything in Standard",
      "Up to 12 gallery images",
      "101 Approved badge",
      "Top priority placement",
      "Premium support",
    ],
    upgradePrompt: "Best value for serious professionals",
  },
} as const;
