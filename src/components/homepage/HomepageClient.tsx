"use client";

import Container from "@/components/container";
import HomeSearchBox from "@/components/home/home-search-box";
import { HomeSidebar } from "@/components/home/home-sidebar";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { ListingCardClient } from "@/components/listings/ListingCardClient";
import { marketingConfig } from "@/config/marketing";
import { Suspense } from "react";
import type { ReactNode } from "react";

interface HomepageClientProps {
  categories: Array<{ id: string; category_name: string }>;
  previewItems: Array<any>;
  user: any;
  featuredListings: ReactNode;
  categoryGrid: ReactNode;
}

export default function HomepageClient({
  categories,
  previewItems,
  user,
  featuredListings,
  categoryGrid,
}: HomepageClientProps) {
  return (
    <div className="flex flex-col min-h-screen bg-bg-dark text-text-primary">
      <Navbar scroll={true} config={marketingConfig} user={user} />
      <main className="flex-1 pt-16">
        <Container className="py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar */}
            <div className="lg:col-span-3">
              <HomeSidebar categories={categories} />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-9 space-y-8">
              {/* Hero Section - Simplified */}
              <section className="space-y-4">
                <h1 className="text-4xl font-bold text-text-primary">
                  Find Trusted Acting Professionals
                </h1>
                <p className="text-lg text-text-secondary max-w-2xl">
                  Connect with vetted coaches, photographers, agents, and more
                  for your child's acting journey.
                </p>
                <div className="max-w-md">
                  <Suspense
                    fallback={<div className="h-12 bg-bg-dark-2 rounded-lg" />}
                  >
                    <HomeSearchBox urlPrefix="/" />
                  </Suspense>
                </div>
              </section>

              {/* Featured Professionals */}
              <section>
                <h2 className="text-2xl font-semibold text-text-primary mb-6">
                  Featured Professionals
                </h2>
                {featuredListings}
              </section>

              {/* Browse by Category */}
              {categoryGrid}

              {/* Newest / Recently Updated */}
              <section>
                <h2 className="text-2xl font-semibold text-text-primary mb-6">
                  Newest Professionals
                </h2>
                <Suspense
                  fallback={
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-64 bg-bg-dark-2 rounded-lg" />
                      ))}
                    </div>
                  }
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {previewItems.map((item) => (
                      <ListingCardClient key={item.id} listing={item} />
                    ))}
                  </div>
                </Suspense>
              </section>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
