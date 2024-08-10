export const ITEMS_PER_PAGE = 4;

export type SortFilterItem = {
  title: string;
  slug: string | null;
  sortKey: 'publishDate' | 'stars' | '_createdAt' | '_updatedAt' | 'name';
  reverse: boolean;
};

export const defaultSort: SortFilterItem = {
  title: 'Sort by Time (Latest)',
  slug: null,
  sortKey: 'publishDate',
  reverse: true
};

export const sorting: SortFilterItem[] = [
  defaultSort,
  { title: 'Sort by Time (Oldest)', slug: 'publish-asc', sortKey: 'publishDate', reverse: false },
  { title: 'Sort by Stars', slug: 'votes-desc', sortKey: 'stars', reverse: true },
  // { title: 'Name', slug: 'name-asc', sortKey: 'name', reverse: false },
  // { title: 'Name', slug: 'name-desc', sortKey: 'name', reverse: true },
  // { title: 'Oldest', slug: 'publish-asc', sortKey: 'publishDate', reverse: false },
  // { title: 'created: newest', slug: 'created-desc', sortKey: '_createdAt', reverse: true },
  // { title: 'created: oldest', slug: 'created-asc', sortKey: '_createdAt', reverse: false },
  // { title: 'updated: newest', slug: 'updated-desc', sortKey: '_updatedAt', reverse: true },
  // { title: 'updated: oldest', slug: 'updated-asc', sortKey: '_updatedAt', reverse: false },
];


export type ShopifyProduct = {
  id: string;
  handle: string;
  availableForSale: boolean;
  title: string;
  description: string;
  descriptionHtml: string;
  // options: ProductOption[];
  priceRange: {
    maxVariantPrice: Money;
    minVariantPrice: Money;
  };
  // variants: Connection<ProductVariant>;
  featuredImage: Image;
  // images: Connection<Image>;
  // seo: SEO;
  tags: string[];
  updatedAt: string;
};

export type Product = Omit<ShopifyProduct, 'variants' | 'images'> & {
  // variants: ProductVariant[];
  images: Image[];
};

export type Image = {
  url: string;
  altText: string;
  width: number;
  height: number;
};

export type Money = {
  amount: string;
  currencyCode: string;
};

export type Menu = {
  title: string;
  path: string;
};