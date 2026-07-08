"use client";

import { Button } from "@/components/ui/button";
import type { Listing } from "@/data/listings";
import { useState } from "react";

type PlanOption = {
  id: "standard" | "pro" | "founding-standard" | "founding-pro";
  label: string;
  price: string;
  blurb: string;
};

const PLAN_OPTIONS: PlanOption[] = [
  {
    id: "standard",
    label: "Standard",
    price: "$25/mo or $250/yr",
    blurb: "Core visibility boost.",
  },
  {
    id: "pro",
    label: "Pro",
    price: "$50/mo or $500/yr",
    blurb: "Top visibility + advanced features.",
  },
  {
    id: "founding-standard",
    label: "Founding Standard",
    price: "$101 / 6 months",
    blurb: "Limited founding special.",
  },
  {
    id: "founding-pro",
    label: "Founding Pro",
    price: "$199 / 6 months",
    blurb: "Limited founding top tier.",
  },
];

export function VendorUpgradePanel({ listing }: { listing: Listing }) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly",
  );
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const startCheckout = async (planId: PlanOption["id"]) => {
    try {
      setLoadingPlan(planId);
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: listing.id,
          planId,
          billingCycle,
          successUrl: `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}&flow=dashboard_upgrade&lid=${encodeURIComponent(listing.id)}`,
          cancelUrl: `${window.location.origin}/dashboard/vendor?upgrade=true`,
          flow: "dashboard_upgrade",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data?.url) {
        throw new Error(data?.error || "Unable to start checkout");
      }
      window.location.href = data.url;
    } catch (error) {
      alert(error instanceof Error ? error.message : "Checkout failed");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section className="bg-card rounded-lg p-6 border space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-foreground">
          Upgrade your listing
        </h2>
        <p className="text-sm text-foreground/80 mt-1">
          Current plan: <strong>{listing.plan || "Free"}</strong>
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={billingCycle === "monthly" ? "default" : "outline"}
          size="sm"
          onClick={() => setBillingCycle("monthly")}
        >
          Monthly
        </Button>
        <Button
          variant={billingCycle === "yearly" ? "default" : "outline"}
          size="sm"
          onClick={() => setBillingCycle("yearly")}
        >
          Yearly
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {PLAN_OPTIONS.map((plan) => (
          <div key={plan.id} className="rounded-md border p-4 bg-background">
            <p className="font-semibold">{plan.label}</p>
            <p className="text-sm text-foreground/80">{plan.price}</p>
            <p className="text-xs text-foreground/70 mt-1">{plan.blurb}</p>
            <Button
              className="mt-3"
              size="sm"
              onClick={() => startCheckout(plan.id)}
              disabled={loadingPlan !== null}
            >
              {loadingPlan === plan.id
                ? "Starting checkout..."
                : `Choose ${plan.label}`}
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
