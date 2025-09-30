import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Container from "@/components/container";
import { HeaderSection } from "@/components/shared/header-section";
import { ClaimUpgradeForm } from "@/components/claim/claim-upgrade-form";
import { getListings } from "@/lib/airtable";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Claim & Upgrade Your Listing - Child Actor 101 Directory",
  description: "Claim your business listing and upgrade to a paid plan for full control",
};

interface ClaimUpgradePageProps {
  params: { slug: string };
}

export default async function ClaimUpgradePage({ params }: ClaimUpgradePageProps) {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/claim-upgrade/${params.slug}`);
  }

  try {
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

    // Check if listing is already claimed
    if (listing.claimed) {
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
              title={`Claim "${listing.businessName}"`}
              subtitle="To claim your listing and gain full control, you must upgrade to a paid plan."
            />
          </div>
        </div>

        <Container className="mt-8">
          <ClaimUpgradeForm listing={listing} />
        </Container>
      </div>
    );
  } catch (error) {
    console.error("Error loading claim upgrade page:", error);
    return notFound();
  }
}
