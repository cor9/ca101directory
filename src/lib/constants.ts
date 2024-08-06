export type SortFilterItem = {
  title: string;
  slug: string | null;
  sortKey: '_createdAt' | '_updatedAt';
  reverse: boolean;
};

export const defaultSort: SortFilterItem = {
  title: 'created: newest',
  slug: null,
  sortKey: '_createdAt',
  reverse: false
};

export const sorting: SortFilterItem[] = [
  defaultSort,
  { title: 'created: oldest', slug: 'created-desc', sortKey: '_createdAt', reverse: true },
  { title: 'updated: newest', slug: 'updated-asc', sortKey: '_updatedAt', reverse: false },
  { title: 'updated: oldest', slug: 'updated-desc', sortKey: '_updatedAt', reverse: true },
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