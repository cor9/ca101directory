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
      {/* Contextual Paragraph with Internal Links */}
      {primaryCategory && (
        <div className="bg-paper rounded-lg p-6 border-2 border-surface/20">
          <p className="text-surface/90 leading-relaxed">
            <strong className="text-surface">{listing.listing_name}</strong> is a
            professional{" "}
            {categorySlug ? (
              <Link
                href={`/category/${categorySlug}`}
                className="text-primary-orange hover:text-primary-orange/80 font-medium underline"
              >
                {primaryCategory.toLowerCase()}
              </Link>
            ) : (
              <span>{primaryCategory.toLowerCase()}</span>
            )}{" "}
            {location && (
              <>
                serving <strong>{location}</strong>
              </>
            )}
            . {categorySlug && (
              <>
                View more{" "}
                <Link
                  href={`/category/${categorySlug}`}
                  className="text-primary-orange hover:text-primary-orange/80 font-medium underline"
                >
                  {primaryCategory.toLowerCase()} professionals
                </Link>
              </>
            )}{" "}
            or{" "}
            <Link
              href="/directory"
              className="text-primary-orange hover:text-primary-orange/80 font-medium underline"
            >
              browse all categories
            </Link>
            .
          </p>
        </div>
      )}

      {/* Related Listings - "You Might Also Like" */}
      {relatedListings.length > 0 && (
        <div className="bg-surface rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4 text-paper">
            You Might Also Like
          </h3>
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
                  <h4 className="font-semibold text-surface mb-1 line-clamp-1">
                    {related.listing_name}
                  </h4>
                  <p className="text-sm text-surface/70 line-clamp-2">
                    {related.what_you_offer
                      ?.replace(/<[^>]*>/g, "")
                      .slice(0, 100) || "Professional services for child actors"}
                  </p>
                  <span className="text-xs text-primary-orange mt-2 inline-block">
                    View Listing →
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Category Navigation */}
      {listing.categories && listing.categories.length > 1 && (
        <div className="bg-paper rounded-lg p-6 border-2 border-surface/20">
          <h3 className="text-lg font-semibold mb-3 text-surface">
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
                  className="inline-block px-4 py-2 bg-surface text-paper rounded-md hover:bg-primary-orange hover:text-white transition-colors text-sm font-medium"
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
