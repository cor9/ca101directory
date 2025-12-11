/**
 * TypeScript types for the tri-role system
 * Defines types for guest, parent, vendor, and admin roles
 */

import type { UserRole } from "@/lib/auth/roles";

// Base user interface
export interface BaseUser {
  id: string;
  email: string;
  full_name?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

// Guest user (not authenticated)
export interface GuestUser {
  role: "guest";
  id?: never;
  email?: never;
  full_name?: never;
  created_at?: never;
  updated_at?: never;
}

// Parent user
export interface ParentUser extends BaseUser {
  role: "parent";
  stripe_customer_id?: string;
}

// Vendor user
export interface VendorUser extends BaseUser {
  role: "vendor";
  stripe_customer_id?: string;
}

// Admin user
export interface AdminUser extends BaseUser {
  role: "admin";
  stripe_customer_id?: string;
}

// Union type for all user types
export type User = GuestUser | ParentUser | VendorUser | AdminUser;

// Listing interface
export interface Listing {
  id: string;
  vendor_id: string;
  listing_name?: string;
  what_you_offer?: string;
  why_is_it_unique?: string;
  format?: string;
  extras_notes?: string;
  permit?: boolean;
  bonded?: boolean;
  bond_number?: string;
  website?: string;
  email?: string;
  phone?: string;
  region?: string;
  city?: string;
  state?: string;
  zip?: string;
  age_range?: string;
  categories?: string;
  approved_101_badge?: boolean;
  profile_image?: string;
  stripe_plan_id?: string;
  plan?: string;
  active?: boolean;
  claimed?: boolean;
  claimed_by_email?: string;
  date_claimed?: string;
  verification_status?: string;
  gallery?: string;
  status?: string;
  created_at: string;
  updated_at: string;
}

// Review interface
export interface Review {
  id: string;
  listing_id: string;
  author_id: string;
  stars: number;
  text?: string;
  status: "pending" | "approved" | "rejected" | "moderated";
  created_at: string;
  updated_at: string;
}

// Favorite interface
export interface Favorite {
  id: string;
  user_id: string;
  listing_id: string;
  created_at: string;
}

// Submission interface
export interface Submission {
  id: string;
  listing_id: string;
  form_submitted: boolean;
  reviewed: boolean;
  approved: boolean;
  status: string;
  converted_paid_listing?: string;
  created_at: string;
  updated_at: string;
}

// Vendor suggestion interface
export interface VendorSuggestion {
  id: string;
  vendor_name?: string;
  website?: string;
  category?: string;
  city?: string;
  state?: string;
  region?: string;
  notes?: string;
  suggested_by?: string;
  status: string;
  created_at: string;
}

// Plan interface
export interface Plan {
  id: string;
  plan?: string;
  monthly_price?: number;
  annual_price?: number;
  semi_annual_price?: number;
  listings?: string;
  stripe_plan_id?: string;
  listings_2?: string;
  created_at: string;
  updated_at: string;
}

// Category interface
export interface Category {
  id: string;
  category_name?: string;
  listings?: string;
  created_at: string;
  updated_at: string;
}

// Dashboard data interfaces
export interface VendorDashboardData {
  user: VendorUser;
  listings: Listing[];
  submissions: Submission[];
  reviews: Review[];
  analytics?: {
    totalViews: number;
    totalClicks: number;
    totalReviews: number;
    averageRating: number;
  };
}

export interface ParentDashboardData {
  user: ParentUser;
  favorites: Favorite[];
  reviews: Review[];
  bookmarks: Favorite[];
  recentSearches?: string[];
}

export interface AdminDashboardData {
  user: AdminUser;
  totalUsers: number;
  totalListings: number;
  totalReviews: number;
  pendingSubmissions: Submission[];
  pendingReviews: Review[];
  vendorSuggestions: VendorSuggestion[];
}

// API response interfaces
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form interfaces
export interface CreateListingForm {
  listing_name: string;
  what_you_offer: string;
  why_is_it_unique: string;
  format: string;
  website: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  region: string;
  categories: string[];
  age_range: string[];
}

export interface CreateReviewForm {
  listing_id: string;
  stars: number;
  text: string;
}

export interface UpdateProfileForm {
  full_name: string;
  email: string;
}

// Permission interfaces
export interface Permission {
  name: string;
  description: string;
  roles: UserRole[];
}

export interface RolePermissions {
  role: UserRole;
  permissions: Permission[];
}
