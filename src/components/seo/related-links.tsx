import Link from "next/link";
import type { Listing } from "@/data/listings";

interface RelatedLinksProps {
  listing: Listing;
  relatedListings?: Listing[];
}

/**
 * Internal linking component for SEO
 * Adds contextual links back to categories and related listings
 * Bauhaus theme with proper contrast
 */
export function RelatedLinks({ listing, relatedListings = [] }: RelatedLinksProps) {
  const primaryCategory = listing.categories?.[0];
  const location = listing.city || listing.region || listing.state;

  // Create category slug
  const categorySlug = primaryCategory
    ?.toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  return (
    <div className="space-y-8 mt-12">
      {/* Contextual Paragraph with Internal Links - CREAM CARD WITH DARK TEXT */}
      {primaryCategory && (
        <div className="bg-paper rounded-lg p-6 border-2 border-surface/20">
          <p className="text-lg leading-relaxed" style={{ color: "#0C1A2B" }}>
            <strong style={{ color: "#0C1A2B" }}>{listing.listing_name}</strong> is a
            professional{" "}
            {categorySlug ? (
              <Link
                href={`/category/${categorySlug}`}
                className="font-medium underline"
                style={{ color: "#FF6B35" }}
              >
                {primaryCategory.toLowerCase()}
              </Link>
            ) : (
              <span style={{ color: "#0C1A2B" }}>{primaryCategory.toLowerCase()}</span>
            )}{" "}
            {location && (
              <>
                serving <strong style={{ color: "#0C1A2B" }}>{location}</strong>
              </>
            )}
            . {categorySlug && (
              <>
                View more{" "}
                <Link
                  href={`/category/${categorySlug}`}
                  className="font-medium underline"
                  style={{ color: "#FF6B35" }}
                >
                  {primaryCategory.toLowerCase()} professionals
                </Link>
              </>
            )}{" "}
            or{" "}
            <Link
              href="/directory"
              className="font-medium underline"
              style={{ color: "#FF6B35" }}
            >
              browse all categories
            </Link>
            .
          </p>
        </div>
      )}

      {/* Related Listings - "You Might Also Like" - NAVY BACKGROUND WITH LIGHT TEXT */}
      {relatedListings.length > 0 && (
        <div className="bg-surface rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6" style={{ color: "#F7F3E8" }}>
            You Might Also Like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedListings.slice(0, 3).map((related) => {
              const relatedSlug = (related.listing_name || "")
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "");

              return (
                <Link
                  key={related.id}
                  href={`/listing/${relatedSlug}`}
                  className="block bg-paper rounded-lg p-4 border-2 border-surface/20 hover:border-primary-orange transition-colors"
                >
                  <h4 className="font-semibold mb-2 line-clamp-1" style={{ color: "#0C1A2B" }}>
                    {related.listing_name}
                  </h4>
                  <p className="text-sm line-clamp-3 mb-3" style={{ color: "#333333" }}>
                    {related.what_you_offer
                      ?.replace(/<[^>]*>/g, "")
                      .slice(0, 120) || "Professional services for child actors"}
                  </p>
                  <span className="text-sm font-medium inline-block" style={{ color: "#FF6B35" }}>
                    View Listing →
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Category Navigation - CREAM CARD WITH DARK TEXT */}
      {listing.categories && listing.categories.length > 1 && (
        <div className="bg-paper rounded-lg p-6 border-2 border-surface/20">
          <h3 className="text-xl font-bold mb-4" style={{ color: "#0C1A2B" }}>
            Related Categories
          </h3>
          <div className="flex flex-wrap gap-2">
            {listing.categories.map((category) => {
              const slug = category
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "");

              return (
                <Link
                  key={category}
                  href={`/category/${slug}`}
                  className="inline-block px-4 py-2 rounded-md transition-colors text-sm font-medium"
                  style={{ 
                    backgroundColor: "#0C1A2B",
                    color: "#F7F3E8"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#FF6B35";
                    e.currentTarget.style.color = "#FFFFFF";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#0C1A2B";
                    e.currentTarget.style.color = "#F7F3E8";
                  }}
                >
                  {category}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Back to Directory CTA */}
      <div className="text-center">
        <Link
          href="/directory"
          className="inline-block px-6 py-3 bg-primary-orange text-white rounded-md hover:bg-primary-orange/90 transition-colors font-semibold"
        >
          ← Browse All Professionals
        </Link>
      </div>
    </div>
  );
}
