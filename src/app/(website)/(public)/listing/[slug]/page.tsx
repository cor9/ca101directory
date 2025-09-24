import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";
import { getListingById } from "@/lib/airtable";
import { cn } from "@/lib/utils";
import { GlobeIcon, MapPinIcon, PhoneIcon, MailIcon, StarIcon, CheckCircleIcon } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata | undefined> {
  const listing = await getListingById(params.slug);
  if (!listing) {
    console.warn(`generateMetadata, listing not found for slug: ${params.slug}`);
    return;
  }

  return constructMetadata({
    title: `${listing.businessName} - Child Actor 101 Directory`,
    description: listing.description,
    canonicalUrl: `${siteConfig.url}/listing/${params.slug}`,
    image: listing.logo,
  });
}

interface ListingPageProps {
  params: { slug: string };
}

export default async function ListingPage({ params }: ListingPageProps) {
  const listing = await getListingById(params.slug);

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
            <Link href="/search" className="hover:text-foreground">Directory</Link>
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
                  <h1 className={cn(
                    "text-4xl tracking-wider font-bold flex items-center gap-2",
                    listing.featured && "text-gradient_indigo-purple font-semibold"
                  )}>
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
              <p className="text-muted-foreground text-balance leading-relaxed">
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
            <h2 className="text-lg font-semibold mb-4">About This Professional</h2>
            <div className="prose prose-sm max-w-none">
              <p>{listing.description}</p>
              {listing.servicesOffered && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Services Offered:</h3>
                  <p>{listing.servicesOffered}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-start mt-16">
            <Link href="/search" className="text-sm text-muted-foreground hover:text-foreground">
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
                <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
                <ul className="space-y-4 text-sm">
                  {listing.location && (
                    <li className="flex items-start gap-3">
                      <MapPinIcon className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <span>{listing.location}</span>
                    </li>
                  )}
                  {listing.phone && (
                    <li className="flex items-start gap-3">
                      <PhoneIcon className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <a href={`tel:${listing.phone}`} className="hover:text-primary">
                        {listing.phone}
                      </a>
                    </li>
                  )}
                  {listing.email && (
                    <li className="flex items-start gap-3">
                      <MailIcon className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <a href={`mailto:${listing.email}`} className="hover:text-primary">
                        {listing.email}
                      </a>
                    </li>
                  )}
                  {listing.virtual && (
                    <li className="flex items-start gap-3">
                      <GlobeIcon className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <span>Virtual services available</span>
                    </li>
                  )}
                </ul>
              </div>

              {/* Categories */}
              <div className="bg-muted/50 rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Categories</h2>
                <ul className="flex flex-wrap gap-2">
                  {listing.categories?.map((cat) => (
                    <li key={cat}>
                      <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                        {cat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Age Range */}
              <div className="bg-muted/50 rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Age Range</h2>
                <ul className="flex flex-wrap gap-2">
                  {listing.tags?.map((tag) => (
                    <li key={tag}>
                      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {tag}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Plan */}
              <div className="bg-muted/50 rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Listing Plan</h2>
                <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">
                  {listing.plan}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

