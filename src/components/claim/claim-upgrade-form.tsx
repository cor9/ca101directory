"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { useRouter } from "next/navigation";
import { useState } from "react";

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
  const foundingStdBadge = env.NEXT_PUBLIC_FOUNDING_STANDARD_BADGE_URL;
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
  if (foundingStdBadge) {
    result.push({
      id: "founding-standard-badge",
      name: "Founding Standard + 101 Badge",
      description: "Founding Standard plus 101 Badge (6 months)",
      features: [
        "Everything in Founding Standard",
        "101 Approved badge included (if qualified)",
      ],
      checkoutLink: foundingStdBadge,
      badge: "Founding Special",
    });
  }

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
  const [selectedPlan, setSelectedPlan] = useState<string>(
    (process.env.NEXT_PUBLIC_FOUNDING_STANDARD_URL || process.env.NEXT_PUBLIC_FOUNDING_PRO_URL)
      ? (process.env.NEXT_PUBLIC_FOUNDING_PRO_URL ? "founding-pro" : "founding-standard")
      : "standard",
  );
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "yearly",
  );
  const [isLoading, setIsLoading] = useState(false);
  const plans = getPlans();
  const hasBadgeAddOns = Boolean(process.env.NEXT_PUBLIC_BADGE_MONTHLY_URL || process.env.NEXT_PUBLIC_BADGE_YEARLY_URL);

  const handleSelectPlan = async (planId: string) => {
    setIsLoading(true);

    try {
      const plan = plans.find((p) => p.id === planId);
      // If a direct checkout link is configured, use it
      if (plan?.checkoutLink) {
        const url = new URL(plan.checkoutLink);
        url.searchParams.set("listing_id", listing.id);
        window.location.href = url.toString();
        return;
      }

      // If monthly/yearly specific links are configured, route accordingly
      const direct = billingCycle === "yearly" ? plan?.yearlyLink : plan?.monthlyLink;
      if (direct) {
        const url = new URL(direct);
        url.searchParams.set("listing_id", listing.id);
        window.location.href = url.toString();
        return;
      }

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listingId: listing.id,
          planId,
          billingCycle,
          successUrl: `${window.location.origin}/claim/success?listing_id=${listing.id}`,
          cancelUrl: window.location.href,
        }),
      });

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      alert("Failed to start checkout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Founding Vendor banner if enabled */}
      {(process.env.NEXT_PUBLIC_FOUNDING_STANDARD_URL || process.env.NEXT_PUBLIC_FOUNDING_PRO_URL) && (
        <div className="mb-6 text-center">
          <Badge className="bg-brand-orange text-white">Founding Vendor Special</Badge>
          <p className="mt-2 text-paper">
            Limited to the first 100 vendors. Lock lifetime pricing and get special placement.
          </p>
        </div>
      )}

      {/* Billing Toggle for Standard/Pro selection */}
      <div className="flex justify-center mb-8">
        <div className="bg-muted p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setBillingCycle("monthly")}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              billingCycle === "monthly"
                ? "bg-background text-paper shadow-sm"
                : "text-paper hover:text-paper",
            )}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle("yearly")}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              billingCycle === "yearly"
                ? "bg-background text-paper shadow-sm"
                : "text-paper hover:text-paper",
            )}
          >
            Yearly
            <Badge variant="secondary" className="ml-2 text-xs">
              Save 17%
            </Badge>
          </button>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan) => (
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
              {!plan.checkoutLink && (
                <div className="mt-4">
                  <div className="text-4xl font-bold">
                    $
                    {billingCycle === "yearly"
                      ? plan.yearlyPrice
                      : plan.monthlyPrice}
                  </div>
                  <div className="text-paper">
                    per {billingCycle === "yearly" ? "year" : "month"}
                  </div>
                  {billingCycle === "yearly" && plan.monthlyPrice && plan.yearlyPrice && (
                    <div className="text-sm text-green-600 mt-1">
                      Save ${plan.monthlyPrice * 12 - plan.yearlyPrice}/year
                    </div>
                  )}
                </div>
              )}
            </CardHeader>

            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full mt-6"
                variant={selectedPlan === plan.id ? "default" : "outline"}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectPlan(plan.id);
                }}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : plan.checkoutLink ? `Choose ${plan.name}` : `Choose ${plan.name}`}
              </Button>
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
