"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BauhausButton } from "@/components/ui/bauhaus-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Listing } from "@/data/listings";
import { cn } from "@/lib/utils";
import { Check, Star } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

interface ClaimUpgradeFormProps {
  listing: Listing;
}

type PlanDef = {
  id: string;
  name: string;
  description: string;
  features: string[];
  popular?: boolean;
  monthlyPrice?: number;
  yearlyPrice?: number;
  checkoutLink?: string; // if present, use direct link instead of API checkout
  badge?: string;
  monthlyLink?: string;
  yearlyLink?: string;
};

function getPlans(): PlanDef[] {
  const env = process.env as Record<string, string | undefined>;
  const foundingStandard = env.NEXT_PUBLIC_FOUNDING_STANDARD_URL;
  const foundingPro = env.NEXT_PUBLIC_FOUNDING_PRO_URL;
  const stdMonthly = env.NEXT_PUBLIC_STANDARD_MONTHLY_URL;
  const stdYearly = env.NEXT_PUBLIC_STANDARD_YEARLY_URL;
  const proMonthly = env.NEXT_PUBLIC_PRO_MONTHLY_URL;
  const proYearly = env.NEXT_PUBLIC_PRO_YEARLY_URL;
  const badgeMonthly = env.NEXT_PUBLIC_BADGE_MONTHLY_URL;
  const badgeYearly = env.NEXT_PUBLIC_BADGE_YEARLY_URL;

  const result: PlanDef[] = [];

  // Founding Vendor specials (surface these first if links provided)
  if (foundingStandard) {
    result.push({
      id: "founding-standard",
      name: "Founding Standard",
      description: "Limited-time founding vendor rate (6 months)",
      features: [
        "Logo/Image display",
        "Enhanced placement above Free vendors",
        "SEO boost for increased visibility",
        "Advanced business description",
        "Multi-category listing",
      ],
      popular: false,
      checkoutLink: foundingStandard,
      badge: "Founding Special",
    });
  }
  if (foundingPro) {
    result.push({
      id: "founding-pro",
      name: "Founding Pro",
      description: "Top placement + badge (6 months)",
      features: [
        "Everything in Standard",
        "Featured placement at top of categories",
        "101 Approved badge eligibility",
        "Gallery images (up to 4)",
        "Social links & promo opportunities",
      ],
      popular: true,
      checkoutLink: foundingPro,
      badge: "Founding Special",
    });
  }
  // Removed combo card per request: no dedicated "Founding Standard + 101 Badge" plan card

  // Regular plans (fallback to Stripe checkout session if direct links not supplied)
  result.push(
    {
      id: "standard",
      name: "Standard",
      monthlyPrice: 25,
      yearlyPrice: 250,
      description: "Perfect for established businesses",
      features: [
        "Full listing control",
        "Edit business information",
        "Upload photos & logo",
        "Respond to reviews",
        "Basic analytics",
        "Email support",
      ],
      popular: false,
      monthlyLink: stdMonthly,
      yearlyLink: stdYearly,
    },
    {
      id: "pro",
      name: "Pro",
      monthlyPrice: 50,
      yearlyPrice: 500,
      description: "Best for growing businesses",
      features: [
        "Everything in Standard",
        "Featured placement",
        "Priority support",
        "Advanced analytics",
        "Multiple categories",
        "101 Approved Badge",
        "Social media integration",
      ],
      popular: true,
      monthlyLink: proMonthly,
      yearlyLink: proYearly,
    },
  );

  return result;
}

export function ClaimUpgradeForm({ listing }: ClaimUpgradeFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const claimToken = searchParams.get("token") || undefined;
  const [selectedPlan, setSelectedPlan] = useState<string>(
    (process.env.NEXT_PUBLIC_FOUNDING_STANDARD_URL || process.env.NEXT_PUBLIC_FOUNDING_PRO_URL)
      ? (process.env.NEXT_PUBLIC_FOUNDING_PRO_URL ? "founding-pro" : "founding-standard")
      : "standard",
  );
  // Bauhaus-ish minimalist: default emphasis on monthly. Annual shown as a subtle alternate.
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly",
  );
  const [isLoading, setIsLoading] = useState(false);
  const plans = getPlans();
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

  const handleSelectPlan = async (planId: string, cycle: "monthly" | "yearly" = billingCycle) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listingId: listing.id,
          planId,
          billingCycle: cycle,
          // Use unified success URL and include fallback context
          successUrl: `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}&flow=claim_upgrade&lid=${encodeURIComponent(listing.id)}`,
          cancelUrl: window.location.href,
          // Flag this as a claim-upgrade flow
          flow: "claim_upgrade",
          token: claimToken,
        }),
      });

      const json = await response.json();
      if (response.ok && json?.url) {
        const url = json.url as string;
        window.location.href = url;
      } else {
        const msg = (json && (json.error || json.details)) ? String(json.error || json.details) : "No checkout URL received";
        throw new Error(msg);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      alert(`Failed to start checkout: ${error instanceof Error ? error.message : "Unknown error"}`);
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
        <h1 className="bauhaus-heading text-3xl text-paper">Claim Your Free Listing</h1>
        <p className="bauhaus-body text-paper mt-2">
          You're all set! Claim now to manage your info. Edits go live after a quick admin review.
        </p>
        <Button
          size="lg"
          className="mt-5 px-6"
          onClick={handleClaimFree}
          disabled={isLoading}
        >
          {isLoading ? "Claiming..." : "Claim Your Free Listing"}
        </Button>
        <p className="bauhaus-body text-xs text-paper mt-2">No credit card required. Free forever. Upgrade anytime.</p>
      </div>

      {/* Founding Vendor banner if enabled */}
      {(process.env.NEXT_PUBLIC_FOUNDING_STANDARD_URL || process.env.NEXT_PUBLIC_FOUNDING_PRO_URL) && (
        <div className="mb-6 text-center">
          <Badge className="bg-brand-orange text-white">Founding Vendor Special</Badge>
          <div className="mt-2">
            <Badge variant="secondary" className="text-xs">First 100 vendors only</Badge>
          </div>
          <p className="mt-2 text-paper">
            Lock lifetime pricing and get special placement.
          </p>
        </div>
      )}

      {/* Optional upgrades */}
      <div className="text-center mb-3">
        <h2 className="bauhaus-heading text-2xl text-paper">Boost your visibility (optional)</h2>
        <p className="bauhaus-body text-paper text-sm mt-1">Upgrade now or anytime from your dashboard</p>
      </div>

      {/* Founding specials as two primary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {plans
          .filter((p) => p.id === "founding-pro" || p.id === "founding-standard")
          .map((plan) => (
          <Card key={plan.id} className="bauhaus-card">
            <CardHeader className="text-center">
              <CardTitle className="bauhaus-heading text-2xl text-gray-900">{plan.name}</CardTitle>
              <CardDescription className="bauhaus-body text-gray-900">
                {plan.description}
              </CardDescription>
              {/* Price highlight for Founding specials */}
              <div className="mt-2">
                {plan.id === "founding-standard" && (
                  <>
                    <div className="bauhaus-heading text-xl text-gray-900">$101 <span className="bauhaus-body text-sm">for 6 months</span></div>
                    <div className="text-green-600 text-sm mt-1">Save $49</div>
                  </>
                )}
                {plan.id === "founding-pro" && (
                  <>
                    <div className="bauhaus-heading text-xl text-gray-900">$199 <span className="bauhaus-body text-sm">for 6 months</span></div>
                    <div className="text-green-600 text-sm mt-1">Save $101</div>
                  </>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.features.slice(0, 4).map((f) => (
                  <li key={f} className="flex items-center gap-3 text-gray-900">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="bauhaus-body">{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-center justify-center gap-3">
                <BauhausButton onClick={() => handleSelectPlan(plan.id, "monthly")}>
                  Upgrade to {plan.name}
                </BauhausButton>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Standard/Pro Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.filter(p => p.id === "standard" || p.id === "pro").map((plan) => (
          <Card
            key={plan.id}
            className={cn(
              "relative cursor-pointer transition-all hover:shadow-lg",
              selectedPlan === plan.id && "ring-2 ring-primary",
              plan.popular && "border-primary",
            )}
            onClick={() => setSelectedPlan(plan.id)}
          >
            {(plan.popular || plan.badge) && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">
                  <Star className="w-3 h-3 mr-1" />
                  {plan.badge || "Most Popular"}
                </Badge>
              </div>
            )}

            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              {/* Minimal pricing emphasis: default monthly; show annual as subtle alternative */}
              {!plan.checkoutLink && (
                <div className="mt-4 text-center">
                  {plan.monthlyPrice ? (
                    <div className="text-2xl font-semibold">${plan.monthlyPrice}<span className="text-sm font-normal text-paper">/mo</span></div>
                  ) : null}
                  {plan.yearlyPrice ? (
                    <div className="text-xs text-paper mt-1">or ${plan.yearlyPrice}/yr</div>
                  ) : null}
                </div>
              )}
            </CardHeader>

            <CardContent>
              <ul className="space-y-2">
                {plan.features.slice(0, 5).map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex items-center justify-center gap-3">
                <BauhausButton onClick={() => handleSelectPlan(plan.id, "monthly")}>
                  {plan.name} Monthly
                </BauhausButton>
                {(plan.yearlyLink || plan.yearlyPrice) && (
                  <BauhausButton variant="secondary" onClick={() => handleSelectPlan(plan.id, "yearly")}>
                    {plan.name} Annual
                  </BauhausButton>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 101 Badge Add-ons (optional) */}
      {hasBadgeAddOns && (
        <div className="mt-10">
          <div className="text-center mb-4">
            <Badge variant="secondary">Add-ons</Badge>
            <p className="text-sm text-paper mt-1">Boost credibility with a 101 Badge subscription.</p>
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
                    <li className="flex items-center gap-3"><Check className="w-4 h-4 text-green-600" /> Display 101 Badge on listing</li>
                    <li className="flex items-center gap-3"><Check className="w-4 h-4 text-green-600" /> Cancel anytime</li>
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
                    <li className="flex items-center gap-3"><Check className="w-4 h-4 text-green-600" /> Display 101 Badge on listing</li>
                    <li className="flex items-center gap-3"><Check className="w-4 h-4 text-green-600" /> Save vs monthly</li>
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
