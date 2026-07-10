"use client";

import { Badge } from "@/components/ui/badge";
import { BauhausButton } from "@/components/ui/bauhaus-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Listing } from "@/data/listings";
import { Check, Star } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface ClaimUpgradeFormProps {
  listing: Listing;
}

const PRO_PLAN = {
  name: "Pro",
  price: 399,
  description: "Best for growing businesses",
  features: [
    "Featured placement",
    "Priority support",
    "Advanced analytics",
    "Multiple categories",
    "Unlimited active event postings",
    "Social media integration",
  ],
};

export function ClaimUpgradeForm({ listing }: ClaimUpgradeFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const claimToken = searchParams.get("token") || undefined;
  const repCode = searchParams.get("rep") || undefined;
  const [isLoading, setIsLoading] = useState(false);
  const badgeMonthly = process.env.NEXT_PUBLIC_BADGE_MONTHLY_URL;
  const badgeYearly = process.env.NEXT_PUBLIC_BADGE_YEARLY_URL;
  const hasBadgeAddOns = Boolean(badgeMonthly || badgeYearly);

  const handleClaimFree = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/claim-free", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId: listing.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to claim free");
      toast.success("Listing claimed! You can now manage your info.");
      // Go to vendor dashboard with success cue
      router.push(`/dashboard/vendor?lid=${listing.id}&claimed=1`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to claim free");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgradeToPro = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listingId: listing.id,
          // Use unified success URL and include fallback context
          successUrl: `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}&flow=claim_upgrade&lid=${encodeURIComponent(listing.id)}`,
          cancelUrl: window.location.href,
          // Flag this as a claim-upgrade flow
          flow: "claim_upgrade",
          token: claimToken,
          repCode,
        }),
      });

      const json = await response.json();
      if (response.ok && json?.url) {
        const url = json.url as string;
        window.location.href = url;
      } else {
        const msg =
          json && (json.error || json.details)
            ? String(json.error || json.details)
            : "No checkout URL received";
        throw new Error(msg);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      alert(
        `Failed to start checkout: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Brand Header */}
      <div className="flex flex-col items-center mb-6 mt-2">
        <Image
          src="/logo.png"
          alt="Child Actor 101 Directory"
          width={220}
          height={48}
          priority
          className="h-10 w-auto opacity-95"
        />
      </div>

      {/* Friendly welcome + primary Free claim CTA */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h1 className="bauhaus-heading text-3xl text-paper">
          Claim Your Free Listing
        </h1>
        <p className="bauhaus-body text-paper mt-2">
          You're all set! Claim now to manage your info. Edits go live after a
          quick admin review.
        </p>
        <Button
          size="lg"
          className="mt-5 px-6"
          onClick={handleClaimFree}
          disabled={isLoading}
        >
          {isLoading ? "Claiming..." : "Claim Your Free Listing"}
        </Button>
        <p className="bauhaus-body text-xs text-paper mt-2">
          No credit card required. Free forever. Upgrade anytime.
        </p>
      </div>

      {/* Optional upgrades */}
      <div className="text-center mb-3">
        <h2 className="bauhaus-heading text-2xl text-paper">
          Boost your visibility (optional)
        </h2>
        <p className="bauhaus-body text-paper text-sm mt-1">
          Upgrade now or anytime from your dashboard
        </p>
        <p className="bauhaus-body text-paper text-xs mt-1 opacity-90">
          If you upgrade, you’ll go to Stripe to pay and then come right back
          here to finish your listing (logo, gallery, rich details).
        </p>
      </div>

      {/* Pro plan */}
      <div className="grid grid-cols-1 max-w-md mx-auto gap-6">
        <Card className="relative border-primary">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-primary text-primary-foreground">
              <Star className="w-3 h-3 mr-1" />
              Most Popular
            </Badge>
          </div>

          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{PRO_PLAN.name}</CardTitle>
            <CardDescription>{PRO_PLAN.description}</CardDescription>
            <div className="mt-4 text-center">
              <div className="text-2xl font-semibold">
                ${PRO_PLAN.price}
                <span className="text-sm font-normal text-paper">/year</span>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <ul className="space-y-2">
              {PRO_PLAN.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-center justify-center">
              <BauhausButton onClick={handleUpgradeToPro} disabled={isLoading}>
                Upgrade to Pro — $399/year
              </BauhausButton>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 101 Badge Add-ons (optional) */}
      {hasBadgeAddOns && (
        <div className="mt-10">
          <div className="text-center mb-4">
            <Badge variant="secondary">Add-ons</Badge>
            <p className="text-sm text-paper mt-1">
              Boost credibility with a 101 Badge subscription.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {badgeMonthly && (
              <Card className="relative">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">101 Badge Monthly</CardTitle>
                  <CardDescription>$10/month</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-green-600" /> Display 101
                      Badge on listing
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-green-600" /> Cancel
                      anytime
                    </li>
                  </ul>
                  <Button
                    className="w-full mt-6"
                    onClick={() => {
                      const url = new URL(badgeMonthly);
                      url.searchParams.set("listing_id", listing.id);
                      window.location.href = url.toString();
                    }}
                  >
                    Choose 101 Badge Monthly
                  </Button>
                </CardContent>
              </Card>
            )}
            {badgeYearly && (
              <Card className="relative">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">101 Badge Annual</CardTitle>
                  <CardDescription>$100/year</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-green-600" /> Display 101
                      Badge on listing
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-green-600" /> Save vs
                      monthly
                    </li>
                  </ul>
                  <Button
                    className="w-full mt-6"
                    onClick={() => {
                      const url = new URL(badgeYearly);
                      url.searchParams.set("listing_id", listing.id);
                      window.location.href = url.toString();
                    }}
                  >
                    Choose 101 Badge Annual
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Additional Info */}
      <div className="mt-8 text-center text-sm text-paper">
        <p>
          After payment, your claim will be submitted for review. Once approved,
          you'll have full control over your listing.
        </p>
      </div>
    </div>
  );
}
