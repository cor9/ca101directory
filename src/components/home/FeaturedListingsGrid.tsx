import { getFeaturedListings } from "@/data/listings";
import { ListingCardClient } from "@/components/listings/ListingCardClient";

export default async function FeaturedListingsGrid() {
  let featuredListings = [];

  try {
    featuredListings = await getFeaturedListings();
    // Limit to 6 listings
    featuredListings = featuredListings.slice(0, 6);
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {featuredListings.map((listing) => (
        <ListingCardClient key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
