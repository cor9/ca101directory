import type { Listing } from "@/data/listings";
import Link from "next/link";

interface RelatedLinksProps {
  listing: Listing;
  relatedListings?: Listing[];
}

/**
 * Internal linking component for SEO
 * Bauhaus theme with varied accent colors: mustard, denim, orange
 */
export function RelatedLinks({
  listing,
  relatedListings = [],
}: RelatedLinksProps) {
  const primaryCategory = listing.categories?.[0];
  const location = listing.city || listing.region || listing.state;

  // Create category slug
  const categorySlug = primaryCategory
    ?.toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  return (
    <div className="space-y-8 mt-12">
      {/* Contextual Paragraph - DENIM BLUE BACKGROUND */}
      {primaryCategory && (
        <div className="rounded-lg p-6" style={{ backgroundColor: "#3a76a6" }}>
          <p className="text-lg leading-relaxed" style={{ color: "#fafaf4" }}>
            <strong style={{ color: "#fafaf4" }}>{listing.listing_name}</strong>{" "}
            is a professional{" "}
            {categorySlug ? (
              <Link
                href={`/category/${categorySlug}`}
                className="font-medium underline"
                style={{ color: "#e4a72e" }}
              >
                {primaryCategory.toLowerCase()}
              </Link>
            ) : (
              <span style={{ color: "#fafaf4" }}>
                {primaryCategory.toLowerCase()}
              </span>
            )}{" "}
            {location && (
              <>
                serving <strong style={{ color: "#fafaf4" }}>{location}</strong>
              </>
            )}
            .{" "}
            {categorySlug && (
              <>
                View more{" "}
                <Link
                  href={`/category/${categorySlug}`}
                  className="font-medium underline"
                  style={{ color: "#e4a72e" }}
                >
                  {primaryCategory.toLowerCase()} professionals
                </Link>
              </>
            )}{" "}
            or{" "}
            <Link
              href="/directory"
              className="font-medium underline"
              style={{ color: "#e4a72e" }}
            >
              browse all categories
            </Link>
            .
          </p>
        </div>
      )}

      {/* Related Listings - "You Might Also Like" - MUSTARD BACKGROUND */}
      {relatedListings.length > 0 && (
        <div className="rounded-lg p-8" style={{ backgroundColor: "#e4a72e" }}>
          <h2 className="text-3xl font-bold mb-6" style={{ color: "#0f1113" }}>
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
                  className="block rounded-lg p-5 transition-all hover:shadow-lg"
                  style={{ 
                    backgroundColor: "#fafaf4",
                    border: "2px solid #0d1b2a"
                  }}
                >
                  <h4
                    className="font-bold mb-2 line-clamp-1 text-lg"
                    style={{ color: "#0f1113" }}
                  >
                    {related.listing_name}
                  </h4>
                  <p
                    className="text-sm line-clamp-3 mb-3 leading-relaxed"
                    style={{ color: "#1f2327" }}
                  >
                    {related.what_you_offer
                      ?.replace(/<[^>]*>/g, "")
                      .slice(0, 120) ||
                      "Professional services for child actors"}
                  </p>
                  <span
                    className="text-sm font-bold inline-block"
                    style={{ color: "#e4572e" }}
                  >
                    View Listing →
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Category Navigation - NAVY BACKGROUND WITH VARIED ACCENT BUTTONS */}
      {listing.categories && listing.categories.length > 1 && (
        <div className="rounded-lg p-6" style={{ backgroundColor: "#0d1b2a" }}>
          <h3 className="text-xl font-bold mb-4" style={{ color: "#fafaf4" }}>
            Related Categories
          </h3>
          <div className="flex flex-wrap gap-3">
            {listing.categories.map((category, index) => {
              const slug = category
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "");

              // Rotate through accent colors: orange, mustard, denim
              const colors = [
                { bg: "#e4572e", text: "#fafaf4", hover: "#e4a72e" }, // Orange
                { bg: "#e4a72e", text: "#0f1113", hover: "#e4572e" }, // Mustard
                { bg: "#3a76a6", text: "#fafaf4", hover: "#e4572e" }, // Denim
              ];
              const colorSet = colors[index % colors.length];

              return (
                <Link
                  key={category}
                  href={`/category/${slug}`}
                  className="inline-block px-5 py-2 rounded-md transition-all text-sm font-bold"
                  style={{
                    backgroundColor: colorSet.bg,
                    color: colorSet.text,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colorSet.hover;
                    e.currentTarget.style.color = "#fafaf4";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colorSet.bg;
                    e.currentTarget.style.color = colorSet.text;
                  }}
                >
                  {category}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Back to Directory CTA - CLAPPER ORANGE */}
      <div className="text-center">
        <Link
          href="/directory"
          className="inline-block px-8 py-4 rounded-md transition-all font-bold text-lg hover:shadow-lg"
          style={{
            backgroundColor: "#e4572e",
            color: "#fafaf4",
          }}
        >
          ← Browse All Professionals
        </Link>
      </div>
    </div>
  );
}
