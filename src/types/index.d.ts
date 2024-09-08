import type { Icon } from "lucide-react";
import { Icons } from "@/components/shared/icons";
import { ItemListQueryResult, ItemQueryResult, BlogListQueryResult, SubmissionListQueryResult } from '@/sanity.types';

// Itme
export type ItemInfo = ItemListQueryResult[number];
// FullInfo has more fields (eg. content)
export type ItemFullInfo = ItemQueryResult;

// Blog 
export type PostInfo = BlogListQueryResult[number];
export type BlogCategoryInfo = CatPathQueryResult[number];

// Submissions
export type SubmissionInfo = SubmissionListQueryResult[number];

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
  url: string;
  ogImage: string;
  mailSupport: string;
  links: {
    twitter: string;
    github: string;
  };
};

export type MarketingConfig = {
  mainNav: NavItem[];
};

export type DocsConfig = {
  mainNav: NavItem[];
  sidebarNav: NestedNavItem[];
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

// subcriptions
export type SubscriptionPlan = {
  title: string;
  description: string;
  benefits: string[];
  limitations: string[];
  prices: {
    monthly: number;
    yearly: number;
  };
  stripeIds: {
    monthly: string | null;
    yearly: string | null;
  };
};

export type UserSubscriptionPlan = SubscriptionPlan &
  Pick<User, "stripeCustomerId" | "stripeSubscriptionId" | "stripePriceId"> & {
    stripeCurrentPeriodEnd: number;
    isPaid: boolean;
    interval: "month" | "year" | null;
    isCanceled?: boolean;
  };

// compare plans
export type ColumnType = string | boolean | null;
export type PlansRow = { feature: string; tooltip?: string } & {
  [key in (typeof plansColumns)[number]]: ColumnType;
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
