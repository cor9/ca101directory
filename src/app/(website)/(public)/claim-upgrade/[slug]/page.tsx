import { auth } from "@/auth";
import { ClaimUpgradeForm } from "@/components/claim/claim-upgrade-form";
import Container from "@/components/container";
import { HeaderSection } from "@/components/shared/header-section";
import { SocialProofStats } from "@/components/conversion/social-proof-stats";
import { getPublicListings, getListingById } from "@/data/listings";
import { redirect, notFound } from "next/navigation";

export const metadata = {
  title: "Claim & Upgrade Your Listing - Child Actor 101 Directory",
  description:
    "Claim your business listing and upgrade to a paid plan for full control",
};

interface ClaimUpgradePageProps {
  params: { slug: string };
  searchParams: { lid?: string; token?: string };
}

export default async function ClaimUpgradePage({ params, searchParams }: ClaimUpgradePageProps) {
  const session = await auth();

  // Preserve existing query params in login callback so token/lid aren't lost
  if (!session?.user?.id) {
    const qs = new URLSearchParams();
    if (searchParams?.lid) qs.set("lid", searchParams.lid);
    if (searchParams?.token) qs.set("token", searchParams.token);
    const cb = `/claim-upgrade/${params.slug}${qs.toString() ? `?${qs.toString()}` : ""}`;
    redirect(`/login?callbackUrl=${encodeURIComponent(cb)}`);
  }

  try {
    // Prefer fetching by ID (works for Pending/Free listings that aren't public yet)
    let listing = null as any;
    if (searchParams?.lid) {
      try {
        listing = await getListingById(searchParams.lid);
      } catch (e) {
        listing = null;
      }
    }

    // Fallback to public listings by slug if no lid or not found
    if (!listing) {
      const listings = await getPublicListings();
      listing = listings.find(
        (l) =>
          l.listing_name
            ?.toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "") === params.slug,
      );
    }

    if (!listing) {
      return notFound();
    }

    // Check if listing is already claimed
    if (listing.is_claimed === true) {
      return (
        <div className="mb-16">
          <div className="mt-8">
            <div className="w-full flex flex-col items-center justify-center gap-8">
              <HeaderSection
                labelAs="h1"
                label="Listing Already Claimed"
                titleAs="h2"
                title="This listing has already been claimed"
                subtitle="This business listing is no longer available for claiming."
              />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="mb-16">
        <div className="mt-8">
          <div className="w-full flex flex-col items-center justify-center gap-8">
            <HeaderSection
              labelAs="h1"
              label="Claim & Upgrade"
              titleAs="h2"
              title={`Claim "${listing.listing_name}"`}
              subtitle="Claim your free listing now. Upgrades are optional and boost visibility."
            />
          </div>
        </div>

        <Container className="mt-8">
          <SocialProofStats />
          <ClaimUpgradeForm listing={listing} />
        </Container>
      </div>
    );
  } catch (error) {
    console.error("Error loading claim upgrade page:", error);
    return notFound();
  }
}
