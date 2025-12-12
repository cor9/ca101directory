"use client";

import { Icons } from "@/components/icons/icons";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Category {
  id: string;
  category_name: string;
}

interface HomeSidebarProps {
  categories: Category[];
}

export function HomeSidebar({ categories }: HomeSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [verified, setVerified] = useState(
    searchParams.get("verified") === "true",
  );
  const [backgroundChecked, setBackgroundChecked] = useState(
    searchParams.get("bg_checked") === "true",
  );
  const [highRating, setHighRating] = useState(
    searchParams.get("high_rating") === "true",
  );
  const [trustedRepeat, setTrustedRepeat] = useState(
    searchParams.get("repeat") === "true",
  );

  const updateFilter = (key: string, value: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, "true");
    } else {
      params.delete(key);
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <aside className="hidden lg:block w-64 space-y-6">
      {/* Browse Section */}
      <section>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Browse</h3>
        <nav className="space-y-2">
          {categories.slice(0, 8).map((category) => {
            const Icon = Icons["star"]; // Default icon, can be enhanced
            return (
              <Link
                key={category.id}
                href={`/category/${category.category_name
                  .toLowerCase()
                  .replace(/[^a-z0-9\s]/g, "")
                  .replace(/\s+/g, "-")}`}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-bg-3 transition-colors text-text-secondary hover:text-text-primary"
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{category.category_name}</span>
              </Link>
            );
          })}
        </nav>
      </section>

      {/* Quick Filters */}
      <section>
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Quick Filters
        </h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-bg-3/60 transition-colors cursor-pointer group">
            <Checkbox
              checked={verified}
              onCheckedChange={(checked) => {
                setVerified(checked as boolean);
                updateFilter("verified", checked as boolean);
              }}
              className="border-subtle data-[state=checked]:bg-accent-teal data-[state=checked]:border-accent-teal"
            />
            <span
              className={`text-sm flex-1 ${
                verified
                  ? "text-text-primary font-semibold"
                  : "text-text-secondary"
              }`}
            >
              Verified Providers
            </span>
          </label>

          <label className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-bg-3/60 transition-colors cursor-pointer group">
            <Checkbox
              checked={backgroundChecked}
              onCheckedChange={(checked) => {
                setBackgroundChecked(checked as boolean);
                updateFilter("bg_checked", checked as boolean);
              }}
              className="border-subtle data-[state=checked]:bg-accent-teal data-[state=checked]:border-accent-teal"
            />
            <span
              className={`text-sm flex-1 ${
                backgroundChecked
                  ? "text-text-primary font-semibold"
                  : "text-text-secondary"
              }`}
            >
              Background Checked
            </span>
          </label>

          <label className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-bg-3/60 transition-colors cursor-pointer group">
            <Checkbox
              checked={highRating}
              onCheckedChange={(checked) => {
                setHighRating(checked as boolean);
                updateFilter("high_rating", checked as boolean);
              }}
              className="border-subtle data-[state=checked]:bg-accent-teal data-[state=checked]:border-accent-teal"
            />
            <span
              className={`text-sm flex-1 ${
                highRating
                  ? "text-text-primary font-semibold"
                  : "text-text-secondary"
              }`}
            >
              4.5+ Stars
            </span>
          </label>

          <label className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-bg-3/60 transition-colors cursor-pointer group">
            <Checkbox
              checked={trustedRepeat}
              onCheckedChange={(checked) => {
                setTrustedRepeat(checked as boolean);
                updateFilter("repeat", checked as boolean);
              }}
              className="border-subtle data-[state=checked]:bg-accent-teal data-[state=checked]:border-accent-teal"
            />
            <span
              className={`text-sm flex-1 ${
                trustedRepeat
                  ? "text-text-primary font-semibold"
                  : "text-text-secondary"
              }`}
            >
              Trusted by Repeat Families
            </span>
          </label>
        </div>
      </section>

      {/* Suggest Vendor CTA */}
      <section>
        <Link
          href="/suggest-vendor"
          className="block p-4 rounded-xl border border-accent-teal/40 bg-accent-teal/10 hover:bg-accent-teal/20 transition-all hover:border-accent-teal/60 hover:shadow-lg hover:shadow-accent-teal/20 group"
        >
          <div className="flex items-center justify-between">
            <span className="font-semibold text-base text-text-primary group-hover:text-accent-teal transition-colors">
              Know someone great?
            </span>
            <ArrowRightIcon className="w-5 h-5 text-accent-teal group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-sm text-text-secondary mt-2 group-hover:text-text-primary">
            Suggest a vendor →
          </p>
        </Link>
      </section>
    </aside>
  );
}
