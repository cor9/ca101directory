import { expect, afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import React from "react";

// Cleanup after each test case
afterEach(() => {
  cleanup();
});

// Mock Next.js navigation
vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT: ${url}`);
  }),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/dashboard/parent",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock Next.js Link component
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => {
    return <a href={href}>{children}</a>;
  },
}));

// Mock auth module
vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

// Mock Supabase client
vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnThis(),
    })),
  },
  createServerClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnThis(),
    })),
  })),
}));

// Environment variables for testing
process.env.NEXT_PUBLIC_ENABLE_PARENT_AUTH = "true";
process.env.NEXT_PUBLIC_ENABLE_PARENT_DASHBOARD = "true";
process.env.NEXT_PUBLIC_ENABLE_FAVORITES = "true";
process.env.NEXT_PUBLIC_ENABLE_REVIEWS = "true";
process.env.NEXT_PUBLIC_ENABLE_FAVORITE_BUTTONS = "true";
process.env.NEXT_PUBLIC_ENABLE_REVIEW_BUTTONS = "true";
process.env.NEXT_PUBLIC_SHOW_PARENT_NAV = "true";
process.env.NEXT_PUBLIC_ENABLE_FAVORITE_API = "true";
process.env.NEXT_PUBLIC_ENABLE_REVIEW_API = "true";
