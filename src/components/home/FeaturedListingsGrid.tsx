import { getFeaturedListings } from "@/data/listings";
import { ListingCardClient } from "@/components/listings/ListingCardClient";

export default async function FeaturedListingsGrid() {
  let featuredListings = [];

  try {
    featuredListings = await getFeaturedListings();
  } catch (error) {
    console.error("Error fetching featured listings:", error);
  }

  if (featuredListings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text-muted">No featured listings available.</p>
      </div>
    );
  }

  // Responsive limits: Desktop 6, Tablet 4, Mobile 3
  const displayListings = featuredListings.slice(0, 6);

  return (
    <>
      {/* Mobile: show 3 */}
      <div className="grid grid-cols-1 gap-8 md:hidden">
        {displayListings.slice(0, 3).map((listing) => (
          <ListingCardClient key={listing.id} listing={listing} isFeatured />
        ))}
      </div>
      {/* Tablet: show 4 */}
      <div className="hidden md:grid lg:hidden grid-cols-2 gap-8">
        {displayListings.slice(0, 4).map((listing) => (
          <ListingCardClient key={listing.id} listing={listing} isFeatured />
        ))}
      </div>
      {/* Desktop: show 6 */}
      <div className="hidden lg:grid grid-cols-3 gap-8">
        {displayListings.map((listing) => (
          <ListingCardClient key={listing.id} listing={listing} isFeatured />
        ))}
      </div>
    </>
  );
}
