"use client";

import Container from "@/components/container";
import HomeSearchBox from "@/components/home/home-search-box";
import { ListingCardClient } from "@/components/listings/ListingCardClient";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import EmptyGrid from "@/components/shared/empty-grid";
import CustomPagination from "@/components/shared/pagination";
import { BlogSection } from "@/components/blog/blog-section";
import { CollectionsSection } from "@/components/collections/collections-section";
import { siteConfig } from "@/config/site";
import { getCategories } from "@/data/categories";
import { getPublicListings } from "@/data/listings";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Script from "next/script";
import { Suspense, useEffect, useState } from "react";

function HomePageContent() {
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const category = searchParams.get("category") || "";
  const region = searchParams.get("region") || "";
  const state = searchParams.get("state") || "";
  const approved101 = searchParams.get("approved101") || "";
  const query = searchParams.get("q") || "";
  const page = searchParams.get("page") || "1";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch categories and listings
        const [categoriesData, listingsData] = await Promise.all([
          getCategories(),
          getPublicListings({
    q: query,
    category,
    region,
    state,
          }),
        ]);

        setCategories(categoriesData);

  // Apply 101 Approved filter
        let filteredListings = listingsData;
  if (approved101 === "true") {
          filteredListings = listingsData.filter(
      (listing) => listing.approved_101_badge === "checked",
    );
  }

  // Sort by plan tier (Premium > Pro > Basic > Free) then by name
        filteredListings.sort((a, b) => {
    const planPriority = (plan: string | null) => {
      switch (plan) {
        case "Premium":
          return 4;
        case "Pro":
          return 3;
        case "Basic":
          return 2;
        case "Free":
          return 1;
        default:
          return 0;
      }
    };

    const aPriority = planPriority(a.plan);
    const bPriority = planPriority(b.plan);

    if (aPriority !== bPriority) {
      return bPriority - aPriority; // Higher priority first
    }

    // If same priority, sort by name
          return (a.listing_name || "").localeCompare(b.listing_name || "");
        });

        setListings(filteredListings);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category, region, state, approved101, query]);

  const totalCount = listings.length;
  const currentPage = Number(page);
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Paginate listings
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedListings = listings.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Container className="py-8">
          <div className="text-center">Loading...</div>
        </Container>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://js.stripe.com/v3/pricing-table.js"
        strategy="afterInteractive"
      />
      <div className="flex min-h-screen flex-col">
        {/* Main Directory Layout */}
        <Container className="py-8">
          <div className="flex flex-col gap-8">
            {/* Search Bar */}
            <div className="w-full">
              <div className="max-w-2xl mx-auto">
                <HomeSearchBox urlPrefix="/" />
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Categories Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-muted/50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Popular Categories
                  </h3>
                  <div className="space-y-2">
                    <Link
                      href="/"
                      className="block w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors"
                    >
                      All Categories
                    </Link>
                    {categories.slice(0, 8).map((category) => (
                      <Link
                        key={category.id}
                        href={`/category/${category.category_name.toLowerCase().replace(/\s+/g, "-")}`}
                        className="block w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors"
                      >
                        {category.category_name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="lg:col-span-3">
                {/* Filters */}
                <div className="mb-6">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex flex-wrap gap-4 items-center">
                      {/* Region Filter */}
                      <div className="flex items-center gap-2">
                        <label
                          htmlFor="region-filter"
                          className="text-sm font-medium"
                        >
                          Region:
                        </label>
                        <select
                          id="region-filter"
                          className="px-3 py-1 border rounded-md text-sm"
                          defaultValue={region || ""}
                          onChange={(e) => {
                            const url = new URL(window.location.href);
                            if (e.target.value) {
                              url.searchParams.set("region", e.target.value);
                            } else {
                              url.searchParams.delete("region");
                            }
                            window.location.href = url.toString();
                          }}
                        >
                          <option value="">All Regions</option>
                          <option value="Los Angeles County">
                            Los Angeles County
                          </option>
                          <option value="Orange County">Orange County</option>
                          <option value="San Diego County">
                            San Diego County
                          </option>
                          <option value="San Francisco Bay Area">
                            San Francisco Bay Area
                          </option>
                          <option value="New York City">New York City</option>
                          <option value="Atlanta Metro">Atlanta Metro</option>
                          <option value="Chicago Metro">Chicago Metro</option>
                          <option value="Dallas-Fort Worth">
                            Dallas-Fort Worth
                          </option>
                          <option value="Houston Metro">Houston Metro</option>
                          <option value="Online/Virtual">Online/Virtual</option>
                        </select>
                      </div>

                      {/* Format Filter */}
                      <div className="flex items-center gap-2">
                        <label
                          htmlFor="format-filter"
                          className="text-sm font-medium"
                        >
                          Format:
                        </label>
                        <select
                          id="format-filter"
                          className="px-3 py-1 border rounded-md text-sm"
                          defaultValue={state || ""}
                          onChange={(e) => {
                            const url = new URL(window.location.href);
                            if (e.target.value) {
                              url.searchParams.set("state", e.target.value);
                            } else {
                              url.searchParams.delete("state");
                            }
                            window.location.href = url.toString();
                          }}
                        >
                          <option value="">All Formats</option>
                          <option value="Online">Online Only</option>
                          <option value="In-Person">In-Person Only</option>
                          <option value="Hybrid">Hybrid</option>
                        </select>
                      </div>

                      {/* Age Filter */}
                      <div className="flex items-center gap-2">
                        <label
                          htmlFor="age-filter"
                          className="text-sm font-medium"
                        >
                          Age:
                        </label>
                        <select
                          id="age-filter"
                          className="px-3 py-1 border rounded-md text-sm"
                          defaultValue={category || ""}
                          onChange={(e) => {
                            const url = new URL(window.location.href);
                            if (e.target.value) {
                              url.searchParams.set("category", e.target.value);
                            } else {
                              url.searchParams.delete("category");
                            }
                            window.location.href = url.toString();
                          }}
                        >
                          <option value="">All Ages</option>
                          <option value="0-5">0-5 years</option>
                          <option value="6-12">6-12 years</option>
                          <option value="13-17">13-17 years</option>
                          <option value="18+">18+ years</option>
                        </select>
                      </div>

                      {/* 101 Approved Filter */}
                      <div className="flex items-center gap-2">
                        <label
                          htmlFor="approved-filter"
                          className="text-sm font-medium"
                        >
                          101 Approved:
                        </label>
                        <select
                          id="approved-filter"
                          className="px-3 py-1 border rounded-md text-sm"
                          defaultValue={approved101 || ""}
                          onChange={(e) => {
                            const url = new URL(window.location.href);
                            if (e.target.value) {
                              url.searchParams.set(
                                "approved101",
                                e.target.value,
                              );
                            } else {
                              url.searchParams.delete("approved101");
                            }
                            window.location.href = url.toString();
                          }}
                        >
                          <option value="">All Listings</option>
                          <option value="true">101 Approved Only</option>
                        </select>
                      </div>

                      {/* Reset Button */}
                      <button
                        type="button"
                        onClick={() => {
                          window.location.href = "/";
                        }}
                        className="px-3 py-1 text-sm border rounded-md hover:bg-muted transition-colors"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>

                {/* Results Header */}
                <div className="mb-6">
                  <h1 className="text-2xl font-bold mb-2">
                    {query
                      ? `Search Results for "${query}"`
                      : "Professional Directory"}
                  </h1>
                  <p className="text-muted-foreground">
              {query
                ? `Found ${totalCount} professional${totalCount !== 1 ? "s" : ""} matching your search`
                      : `Browse ${totalCount} vetted child actor professionals`}
                  </p>
            </div>

            {/* Listings Grid */}
                {paginatedListings.length === 0 ? (
                <EmptyGrid />
              ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {paginatedListings.map((listing) => (
                    <ListingCardClient key={listing.id} listing={listing} />
                  ))}
                </div>
              )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center">
                    <CustomPagination routePrefix="/" totalPages={totalPages} />
            </div>
                )}
          </div>
            </div>
          </div>
        </Container>

                {/* Collections Section */}
                <Container className="py-16">
                  <CollectionsSection />
                </Container>

                {/* Blog Section */}
        <Container className="py-16">
                  <BlogSection />
        </Container>

        {/* Newsletter Section */}
        <Container className="py-16">
          <NewsletterCard />
        </Container>
      </div>
    </>
          );
        }

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col">
          <Container className="py-8">
            <div className="text-center">Loading...</div>
          </Container>
        </div>
      }
    >
      <HomePageContent />
    </Suspense>
  );
}
