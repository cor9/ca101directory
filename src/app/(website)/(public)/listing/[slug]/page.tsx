import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { getListingById } from "@/lib/airtable";
import { constructMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";
import {
  CheckCircleIcon,
  GlobeIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  StarIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// Force dynamic rendering to avoid static/dynamic conflicts
export const dynamic = "force-dynamic";

/**
 * Generate static params for all listing pages
 * This tells Next.js which listing pages to pre-build
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
      console.warn(
        `generateMetadata, listing not found for slug: ${params.slug}`,
      );
      return;
    }

    return constructMetadata({
      title: `${listing.businessName} - Child Actor 101 Directory`,
      description: listing.description,
      canonicalUrl: `${siteConfig.url}/listing/${params.slug}`,
      image: listing.logo,
    });
  } catch (error) {
    console.error("generateMetadata error:", error);
    return constructMetadata({
      title: "Listing - Child Actor 101 Directory",
      description: "Professional acting services for young actors",
      canonicalUrl: `${siteConfig.url}/listing/${params.slug}`,
    });
  }
}

interface ListingPageProps {
  params: { slug: string };
}

export default async function ListingPage({ params }: ListingPageProps) {
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
      console.error("ListingPage, listing not found");
      return notFound();
    }

    return (
      <div className="flex flex-col gap-8">
        {/* Header section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left column */}
          <div className="lg:col-span-3 gap-8 flex flex-col">
            {/* Basic information */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/search" className="hover:text-foreground">
                Directory
              </Link>
              <span>/</span>
              <span>{listing.businessName}</span>
            </div>

            {/* logo + name + description */}
            <div className="flex flex-1 items-center">
              <div className="flex flex-col gap-8">
                <div className="flex w-full items-center gap-4">
                  {listing.logo && (
                    <Image
                      src={listing.logo}
                      alt={`Logo of ${listing.businessName}`}
                      title={`Logo of ${listing.businessName}`}
                      width={64}
                      height={64}
                      className="object-cover rounded-lg"
                    />
                  )}
                  <div className="flex flex-col gap-2">
                    <h1
                      className={cn(
                        "text-4xl tracking-wider font-bold flex items-center gap-2 text-foreground",
                        listing.featured &&
                          "text-gradient_blue-orange font-semibold",
                      )}
                    >
                      {listing.businessName}
                    </h1>
                    <div className="flex items-center gap-2">
                      {listing.featured && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <StarIcon className="h-3 w-3" />
                          Featured
                        </span>
                      )}
                      {listing.approved101 && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <CheckCircleIcon className="h-3 w-3" />
                          101 Approved
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-foreground text-balance leading-relaxed">
                  {listing.description}
                </p>
              </div>
            </div>

            {/* action buttons */}
            <div className="flex gap-4">
              {listing.website && (
                <Button size="lg" variant="default" asChild className="group">
                  <Link
                    href={listing.website}
                    target="_blank"
                    prefetch={false}
                    className="flex items-center justify-center space-x-2"
                  >
                    <GlobeIcon className="w-4 h-4 icon-scale" />
                    <span>Visit Website</span>
                  </Link>
                </Button>
              )}
              {listing.instagram && (
                <Button size="lg" variant="outline" asChild>
                  <Link
                    href={listing.instagram}
                    target="_blank"
                    prefetch={false}
                    className="flex items-center justify-center space-x-2"
                  >
                    <span>Follow on Instagram</span>
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-2">
            {/* Gallery */}
            {listing.gallery && listing.gallery.length > 0 && (
              <div className="relative group overflow-hidden rounded-lg aspect-[16/9]">
                <Image
                  src={listing.gallery[0]}
                  alt={`Gallery image for ${listing.businessName}`}
                  title={`Gallery image for ${listing.businessName}`}
                  loading="eager"
                  fill
                  className="border w-full shadow-lg object-cover image-scale"
                />
              </div>
            )}
          </div>
        </div>

        {/* Content section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left column */}
          <div className="lg:col-span-3 flex flex-col">
            {/* Detailed content */}
            <div className="bg-muted/50 rounded-lg p-6 mr-0 lg:mr-8">
              <h2 className="text-xl font-semibold mb-6 text-foreground">
                About This Professional
              </h2>
              <div className="prose prose-sm max-w-none text-foreground">
                <p className="text-base leading-relaxed mb-4">
                  {listing.description}
                </p>
                {listing.servicesOffered && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-3 text-foreground">
                      Services Offered:
                    </h3>
                    <p className="text-base leading-relaxed">
                      {listing.servicesOffered}
                    </p>
                  </div>
                )}
                {listing.uniqueValue && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-3 text-foreground">
                      What Makes This Unique:
                    </h3>
                    <p className="text-base leading-relaxed">
                      {listing.uniqueValue}
                    </p>
                  </div>
                )}
                {listing.format && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-3 text-foreground">
                      Service Format:
                    </h3>
                    <p className="text-base leading-relaxed">
                      {listing.format}
                    </p>
                  </div>
                )}
                {listing.notes && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-3 text-foreground">
                      Additional Notes:
                    </h3>
                    <p className="text-base leading-relaxed">{listing.notes}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-start mt-16">
              <Link
                href="/search"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                ← Back to Directory
              </Link>
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-2">
            <div className="flex flex-col space-y-8">
              <div className="flex flex-col space-y-4">
                {/* Contact Information */}
                <div className="bg-muted/50 rounded-lg p-6">
                  <h2 className="text-lg font-semibold mb-4 text-foreground">
                    Contact Information
                  </h2>
                  <ul className="space-y-4 text-base">
                    {listing.location && (
                      <li className="flex items-start gap-3">
                        <MapPinIcon className="w-4 h-4 text-muted-foreground mt-1" />
                        <span className="text-foreground">
                          {listing.location}
                        </span>
                      </li>
                    )}
                    {listing.phone && (
                      <li className="flex items-start gap-3">
                        <PhoneIcon className="w-4 h-4 text-muted-foreground mt-1" />
                        <a
                          href={`tel:${listing.phone}`}
                          className="hover:text-primary text-foreground"
                        >
                          {listing.phone}
                        </a>
                      </li>
                    )}
                    {listing.email && (
                      <li className="flex items-start gap-3">
                        <MailIcon className="w-4 h-4 text-muted-foreground mt-1" />
                        <a
                          href={`mailto:${listing.email}`}
                          className="hover:text-primary text-foreground"
                        >
                          {listing.email}
                        </a>
                      </li>
                    )}
                    {listing.virtual && (
                      <li className="flex items-start gap-3">
                        <GlobeIcon className="w-4 h-4 text-muted-foreground mt-1" />
                        <span className="text-foreground">
                          Virtual services available
                        </span>
                      </li>
                    )}
                  </ul>
                </div>

                {/* Categories */}
                <div className="bg-muted/50 rounded-lg p-6">
                  <h2 className="text-lg font-semibold mb-4 text-foreground">
                    Categories
                  </h2>
                  <ul className="flex flex-wrap gap-2">
                    {listing.categories && Array.isArray(listing.categories) ? (
                      listing.categories.map((category) => (
                        <li key={category}>
                          <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                            {category}
                          </span>
                        </li>
                      ))
                    ) : listing.categories ? (
                      <li>
                        <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                          {listing.categories}
                        </span>
                      </li>
                    ) : (
                      <li className="text-sm text-muted-foreground">
                        No categories listed
                      </li>
                    )}
                  </ul>
                </div>

                {/* Age Range */}
                <div className="bg-muted/50 rounded-lg p-6">
                  <h2 className="text-lg font-semibold mb-4 text-foreground">
                    Age Range
                  </h2>
                  <ul className="flex flex-wrap gap-2">
                    {listing.tags && listing.tags.length > 0 ? (
                      listing.tags.map((tag) => (
                        <li key={tag}>
                          <span className="text-sm bg-brand-blue/10 text-brand-blue px-3 py-1 rounded-full">
                            {tag}
                          </span>
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-muted-foreground">
                        No age range specified
                      </li>
                    )}
                  </ul>
                </div>


                {/* Certifications & Compliance */}
                {(listing.performerPermit || listing.bonded) && (
                  <div className="bg-muted/50 rounded-lg p-6">
                    <h2 className="text-lg font-semibold mb-4 text-foreground">
                      Certifications & Compliance
                    </h2>
                    <ul className="space-y-2 text-sm">
                      {listing.performerPermit && (
                        <li className="flex items-center gap-2">
                          <CheckCircleIcon className="w-4 h-4 text-green-600" />
                          <span>
                            California Child Performer Services Permit
                          </span>
                        </li>
                      )}
                      {listing.bonded && (
                        <li className="flex items-center gap-2">
                          <CheckCircleIcon className="w-4 h-4 text-green-600" />
                          <span>Bonded for Advanced Fees</span>
                          {listing.bondNumber && (
                            <span className="text-muted-foreground">
                              (Bond #{listing.bondNumber})
                            </span>
                          )}
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("ListingPage error:", error);
    return notFound();
  }
}
