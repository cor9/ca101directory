import type { Icons } from "@/components/icons/icons";

// Stripe pricing table custom elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "stripe-pricing-table": {
        "pricing-table-id": string;
        "publishable-key": string;
      };
    }
  }
}

// Custom ItemInfo type for Airtable integration (no Sanity dependency)
export type ItemInfo = {
  _id: string;
  _createdAt: string;
  name: string;
  slug: {
    _type: "slug";
    current?: string;
  };
  description: string;
  link: string;
  affiliateLink: string | null;
  sponsor: boolean;
  sponsorStartDate: string | null;
  sponsorEndDate: string | null;
  note: string | null;
  featured: boolean;
  icon: {
    asset: {
      _ref: string;
      _type: "reference";
    };
    hotspot: any;
    crop: any;
    alt: string;
    _type: "image";
    blurDataURL: string | null;
    imageColor: string | null;
  } | null;
  image: {
    asset: {
      _ref: string;
      _type: "reference";
    };
    hotspot: any;
    crop: any;
    alt: string;
    _type: "image";
    blurDataURL: string | null;
    imageColor: string | null;
  } | null;
  publishDate: string;
  paid: boolean;
  order: number | null;
  pricePlan: string;
  freePlanStatus: string;
  proPlanStatus: string | null;
  sponsorPlanStatus: string | null;
  rejectionReason: string | null;
  collections: any[];
  categories: Array<{
    _id: string;
    _type: "category";
    _createdAt: string;
    _updatedAt: string;
    _rev: string;
    name: string;
    slug: {
      _type: "slug";
      current: string;
    };
    description: string | null;
    group: string | null;
    priority: number | null;
  }>;
  tags: Array<{
    _id: string;
    _type: "tag";
    _createdAt: string;
    _updatedAt: string;
    _rev: string;
    name: string;
    slug: {
      _type: "slug";
      current: string;
    };
    description: string | null;
    priority: number | null;
  }>;
  submitter: any;
  related?: any[];
};

// ItemFullInfo has more fields (eg. introduction and related items)
export type ItemFullInfo = ItemInfo & {
  introduction?: string;
  related?: ItemInfo[];
};

// Blog (disabled for now)
export type BlogPostInfo = any;

// Collection (disabled for now)
export type CollectionInfo = any;

export type SiteConfig = {
  name: string;
  tagline: string;
  description: string;
  keywords: string[];
  author: string;
  url: string;
  logo: string;
  logoDark?: string;
  image: string;
  mail: string;
  utm: {
    source: string;
    medium: string;
    campaign: string;
  };
  links: {
    github?: string;
    twitter?: string;
    youtube?: string;
  };
};

export type HeroConfig = {
  title: {
    first: string;
    second: string;
  };
  subtitle: string;
  label: {
    text: string;
    icon: keyof typeof Icons;
    href: string;
  };
};

export type MarketingConfig = {
  menus: NavItem[];
};

export type DashboardConfig = {
  menus: NavItem[];
};

export type UserButtonConfig = {
  menus: NavItem[];
};

export type FooterConfig = {
  links: NestedNavItem[];
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

export type PriceConfig = {
  plans: PricePlan[];
  annualPlans?: PricePlan[];
  foundingBundles?: PricePlan[];
};

export type PricePlan = {
  title: string;
  description: string;
  benefits: string[];
  limitations: string[];
  price: number;
  priceSuffix: string;
  stripePriceId: string | null;
};

export type HomeConfig = {
  valueProps: Array<{
    title: string;
    description: string;
    icon: keyof typeof Icons;
  }>;
  howItWorks: Array<{
    title: string;
    description: string;
  }>;
  pricing: {
    heading: string;
    subheading: string;
    featuredPlan: string;
  };
  ctaBanner: {
    heading: string;
    description: string;
    primaryCta: {
      label: string;
      href: string;
    };
    secondaryCta: {
      label: string;
      href: string;
    };
  };
  parentCta: {
    heading: string;
    description: string;
    primaryCta: {
      label: string;
      href: string;
    };
    secondaryCta: {
      label: string;
      href: string;
    };
  };
};

export type FAQConfig = {
  items: FAQItem[];
};

export type FAQItem = {
  id: string;
  question: string;
  answer: string;
};
