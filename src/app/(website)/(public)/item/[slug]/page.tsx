import { siteConfig } from "@/config/site";
import { getItemById } from "@/data/airtable-item";
import { constructMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

// Force dynamic rendering to avoid static/dynamic conflicts
export const dynamic = "force-dynamic";

/**
 * Generate static params for all item pages
 * This tells Next.js which item pages to pre-build
 */
export async function generateStaticParams() {
  try {
    const { getListings } = await import("@/lib/airtable");
    const listings = await getListings();

    // Convert listing names to slugs
    return listings.map((listing) => ({
      slug: listing.businessName
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, ""),
    }));
  } catch (error) {
    console.error("generateStaticParams error:", error);
    // Return empty array if Airtable is not configured
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata | undefined> {
  try {
    const { getListings } = await import("@/lib/airtable");
    const listings = await getListings();
    const listing = listings.find(
      (listing) =>
        listing.businessName
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "") === params.slug,
    );

    if (!listing) {
      return constructMetadata({
        title: "Listing Not Found - Child Actor 101 Directory",
        description: "The requested listing could not be found",
        canonicalUrl: `${siteConfig.url}/item/${params.slug}`,
      });
    }

    return constructMetadata({
      title: `${listing.businessName} - Child Actor 101 Directory`,
      description:
        listing.description ||
        `Professional ${listing.categories?.[0] || "acting"} services for young actors`,
      canonicalUrl: `${siteConfig.url}/item/${params.slug}`,
    });
  } catch (error) {
    console.error("generateMetadata error:", error);
    return constructMetadata({
      title: "Listing - Child Actor 101 Directory",
      description: "Professional acting services for young actors",
      canonicalUrl: `${siteConfig.url}/item/${params.slug}`,
    });
  }
}

export default async function ItemDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  try {
    const { getListings } = await import("@/lib/airtable");
    const listings = await getListings();
    const listing = listings.find(
      (listing) =>
        listing.businessName
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "") === params.slug,
    );

    if (!listing) {
      return notFound();
    }

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {listing.businessName}
          </h1>

          {listing.description && (
            <p className="text-lg text-gray-600 mb-4">{listing.description}</p>
          )}

          <div className="flex flex-wrap gap-2 mb-4">
            {listing.categories?.map((cat) => (
              <span
                key={cat}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>

            {listing.website && (
              <div className="mb-4">
                <strong>Website:</strong>{" "}
                <a
                  href={listing.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {listing.website}
                </a>
              </div>
            )}

            {listing.email && (
              <div className="mb-4">
                <strong>Email:</strong>{" "}
                <a
                  href={`mailto:${listing.email}`}
                  className="text-blue-600 hover:underline"
                >
                  {listing.email}
                </a>
              </div>
            )}

            {listing.phone && (
              <div className="mb-4">
                <strong>Phone:</strong>{" "}
                <a
                  href={`tel:${listing.phone}`}
                  className="text-blue-600 hover:underline"
                >
                  {listing.phone}
                </a>
              </div>
            )}

            {listing.location && (
              <div className="mb-4">
                <strong>Location:</strong> {listing.location}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Services</h2>

            {listing.servicesOffered && (
              <p className="mb-4">{listing.servicesOffered}</p>
            )}

            {listing.tags && listing.tags.length > 0 && (
              <div className="mb-4">
                <strong>Age Range:</strong>{" "}
                <span>{listing.tags.join(", ")}</span>
              </div>
            )}

            {listing.plan && (
              <div className="mb-4">
                <strong>Plan:</strong>{" "}
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    listing.plan === "Premium"
                      ? "bg-purple-100 text-purple-800"
                      : listing.plan === "Pro"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {listing.plan}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("ItemDetailPage error:", error);
    return notFound();
  }
}
