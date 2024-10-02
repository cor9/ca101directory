import { Icons } from "@/components/shared/icons";
import {
  BlogPostListQueryResult,
  ItemListQueryResult,
  ItemQueryResult
} from '@/sanity.types';

// Itme
export type ItemInfo = ItemListQueryResult[number];
// FullInfo has more fields (eg. content)
export type ItemFullInfo = ItemQueryResult;
// Blog 
export type BlogPostInfo = BlogPostListQueryResult[number];

export type SubmitConfig = {
  title: string;
  subtitle: string;
  form: {
    title: string;
    name: string;
    namePlaceHolder: string;
    link: string;
    linkPlaceHolder: string;
    submit: string;
    submiting: string;
    desc: string;
    descPlaceHolder: string;
    types: string;
    tags: string;
    categories: string;
    logo: string;
    image: string;
    update: string;
    updating: string;
    delete: string;
    deleting: string;
    imageUploading: string;
    notice: string;
    success: string;
    error: string;
  }
}

export type SiteConfig = {
  name: string;
  slogan: string;
  description: string;
  keywords: string[];
  author: string;
  url: string;
  image: string;
  mail: string;
  links: {
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
};

export type MarketingConfig = {
  mainNav: NavItem[];
};

export type DashboardConfig = {
  mainNav: NavItem[];
};

export type NavItem = {
  title: string;
  href: string;
  badge?: number;
  disabled?: boolean;
  external?: boolean;
  authorizeOnly?: UserRole;
  icon?: keyof typeof Icons;
};

export type NestedNavItem = {
  title: string;
  items: NavItem[];
  authorizeOnly?: UserRole;
  icon?: keyof typeof Icons;
};

// price plans
export type PricePlan = {
  title: string;
  description: string;
  benefits: string[];
  limitations: string[];
  price: number;
  stripePriceId: string | null;
};

// landing sections
export type InfoList = {
  icon: keyof typeof Icons;
  title: string;
  description: string;
};

export type InfoLdg = {
  title: string;
  image: string;
  description: string;
  list: InfoList[];
};

export type FeatureLdg = {
  title: string;
  description: string;
  link: string;
  icon: keyof typeof Icons;
};

export type TestimonialType = {
  name: string;
  job: string;
  image: string;
  review: string;
};
